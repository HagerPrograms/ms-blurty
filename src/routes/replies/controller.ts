import { Request, Response } from "express"
import { response } from "./response"
import prisma from "../../utils/prisma"

class ReplyController {
    ReactReply = async (req: Request, res: Response) => {
        const likes: number[] = req.body.likes
        const dislikes: number[] = req.body.dislikes

        try{
            const reactions = likes.map((like) => {
                return {
                    reaction_type: 'like' as "dislike" | "like",
                    post_id: like,
                    user_id: req.user.id
                }
            }).concat(dislikes.map((dislike) => {
                return {
                    reaction_type: 'dislike' as "dislike" | "like",
                    post_id: dislike,
                    user_id: req.user.id
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