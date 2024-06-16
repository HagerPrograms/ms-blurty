import { Request, Response } from "express"
import { response } from "./response"
import prisma from "../../utils/prisma"

class ReplyController {
    CreateReply = async (req: Request, res: Response) => {
        const { text, author_ip, school_id, media_url, parent_post_id } = req.body
        try{
            if(!parent_post_id){
                throw new Error(`parent_post_id required!`)
            }

            let user;
            user = await prisma.uSERS.findFirst({
                where: {
                    ip: author_ip
                }
            })

            if(!user){
                user = await prisma.uSERS.create({
                    data: {
                        ip: author_ip
                    }
                })
            }
            
            const parent_post = await prisma.pOSTS.findFirst({
                where: {
                    id: parent_post_id,
                    logical_delete_indicator: false
                }
            })

            if(!parent_post){
                throw new Error(`Parent post not found!`)
            }

            const post = await prisma.pOSTS.create({
                data: {
                    text: text,
                    author_id: user?.id ?? null,
                    school_id: school_id,
                    media_url: media_url,
                    parent_post_id: parent_post_id,
                    logical_delete_indicator: false
                }
            })

            return response(post)
        } catch (error) {
            throw error
        }
    }
    ReactReply = async (req: Request, res: Response) => {
        const reactor_ip: string = req.body.reactor_ip
        const likes: number[] = req.body.likes
        const dislikes: number[] = req.body.dislikes

        try{
            
            let user;
            user = await prisma.uSERS.findFirst({
                where: {
                    ip: reactor_ip
                }
            })

            if(!user){
                user = await prisma.uSERS.create({
                    data: {
                        ip: reactor_ip
                    }
                })
            }

            const reactions = likes.map((like) => {
                return {
                    reaction_type: 'like' as "dislike" | "like",
                    post_id: like,
                    user_id: user.id
                }
            }).concat(dislikes.map((dislike) => {
                return {
                    reaction_type: 'dislike' as "dislike" | "like",
                    post_id: dislike,
                    user_id: user.id
                }
            }))

            const post = await prisma.rEACTIONS.createMany({
                data: reactions
            })
            return response(post)
        } catch (error) {
            throw new Error(`Failed to like post.`)
        }
    }
}
export default new ReplyController