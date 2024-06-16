import { Request, Response } from "express"
import prisma from "../../utils/prisma";
import { response } from "./response";

class PostController {
    async getPosts(req: Request, res: Response){
        const { school } = req.params
        try{
            const posts = prisma.sCHOOLS.findMany({
                where: {
                    abbreviation: school
                },
                include: {
                    POSTS: {
                        include: {
                        
                        }
                    }
                }
            })
            return response(posts)
        } catch (error) {
            throw new Error(`Failed fetching data for school: ${school}`)
        }
    }

    async deletePosts(req: Request, res: Response){
        const { postId } = req.params
        try{
            
            const post = await prisma.pOSTS.findUnique({
                where: {
                    id: Number(postId)
                }
            })
    
            if (!post) {
                throw new Error(`Post not found: ${postId}`)
            }

            if (post.logical_delete_indicator === true) {
                throw new Error(`Post already deleted: ${postId}`)
            }
            
            const posts = prisma.pOSTS.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    logical_delete_indicator: true
                }
            })

            return response(posts)
        } catch (error) {
            throw new Error(`Failed to delete post: ${postId}`)
        }
    }

    async createPost(req: Request, res: Response) {
        const { text, author_ip, school_id, media_url, parent_post_id } = req.body
        try{
            
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
            throw new Error(`Failed to create post.`)
        }
    }

    async reactToPosts(req: Request, res: Response) {
        
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

    async reportPost(req: Request, res: Response) {
        
        const reporter_ip: string = req.body.reporter_ip
        const text: string = req.body.text
        const post_id: number = Number(req.params.postId)

        try{
            let user;
            user = await prisma.uSERS.findFirst({
                where: {
                    ip: reporter_ip
                }
            })

            if(!user){
                user = await prisma.uSERS.create({
                    data: {
                        ip: reporter_ip
                    }
                })
            }

            const post = await prisma.rEPORTS.create({
                data: {
                    text: text,
                    author_id: user.id,
                    post_id:post_id,

                }
            })

            return response(post)
        } catch (error) {
            throw new Error(`Failed to like post.`)
        }
    }
}

export default new PostController