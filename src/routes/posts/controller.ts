import { Request, Response } from "express"
import prisma from "../../utils/prisma";
import { response } from "./response";
import { exist } from "joi";

class PostController {
    async GetPosts(req: Request, res: Response) {
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

    //deleted array and failed to delete array
    async DeletePosts(req: Request, res: Response){
        const { post_ids } = req.body
        try{
            const existingPosts = await prisma.pOSTS.findMany({
                where: {
                    id: {in: post_ids}
                }
            })
            const postsToBeDeleted: number[] = []
            const postsAlreadyDeleted: number[] = []

            existingPosts.forEach((post) => {
                if(post.logical_delete_indicator === false){
                    postsToBeDeleted.push(post.id)
                }
                if(post.logical_delete_indicator === true){
                    postsAlreadyDeleted.push(post.id)
                }
            })

            const postsAccountedFor = new Set(postsAlreadyDeleted.concat(postsAlreadyDeleted))
            const postsUnaccountedFor = post_ids.filter((post: number) => !postsAccountedFor.has(post))


            const posts = await prisma.pOSTS.updateMany({
                where: {
                    id: {in: postsToBeDeleted},
                },
                data: {
                    logical_delete_indicator: true
                }
            })

            return response({
                postsToBeDeleted: postsToBeDeleted,
                postsAlreadyDeleted: postsAlreadyDeleted,
                postsUnaccountedFor,
                numberOfDeletions: posts.count
            })
        } catch (error) {
            throw new Error(`Failed to delete post: ${post_ids}`)
        }
    }

    async CreatePost(req: Request, res: Response) {
        const { text, school_id, media_url } = req.body
        const {id} = req.user
        try{
            const post = await prisma.pOSTS.create({
                data: {
                    text: text,
                    author_id: id,
                    school_id: school_id,
                    media_url: media_url,
                    logical_delete_indicator: false
                }
            })

            return response(post)
        } catch (error) {
            throw error
        }
    }
    CreateReply = async (req: Request, res: Response) => {
        const { text, author_ip, school_id, media_url, parent_post_id } = req.body
        try{
            if(!parent_post_id){
                throw new Error(`parent_post_id required!`)
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
                    author_id: req.user.id,
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
    async ReactToPosts(req: Request, res: Response) {
        
        const {id} = req.user
        const likes: number[] = req.body.likes
        const dislikes: number[] = req.body.dislikes

        try{

            const reactions = likes.map((like) => {
                return {
                    reaction_type: 'like' as "dislike" | "like",
                    post_id: like,
                    id
                }
            }).concat(dislikes.map((dislike) => {
                return {
                    reaction_type: 'dislike' as "dislike" | "like",
                    post_id: dislike,
                    id
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
    async UnreactToPosts(req: Request, res: Response) {
        const { id } = req.user
        const post_ids: number[] = req.body.post_ids
        try{
            const unreactToPost = await prisma.rEACTIONS.deleteMany({
                where:{
                    user_id: id,
                    post_id: {in: post_ids}
                }
            })

            return response(unreactToPost)
        } catch (error) {
            throw new Error(`Failed to like post.`)
        }
    }
    async ReportPost(req: Request, res: Response) {
        
        const { id } = req.user
        const text: string = req.body.text
        const post_id: number = Number(req.params.postId)

        try{
            const post = await prisma.rEPORTS.create({
                data: {
                    text: text,
                    author_id: id,
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