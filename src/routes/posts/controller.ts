import { Request, Response } from "express"
import prisma from "../../utils/prisma";
import { getPostsResponse, response } from "./response";
import { GetPostsResponse } from "../../utils/types/api";

class PostController {
    async GetPosts(req: Request, _res: Response) {
        const { school } = req.params
        try{
            const posts = (await prisma.sCHOOLS.findMany({
                where: {
                    abbreviation: school
                },
                include: {
                    POSTS: {
                        where: {
                            parent_post_id: null,
                            logical_delete_indicator: false
                        },
                        include: {
                            REACTIONS: true,
                            other_POSTS: {
                                include: {
                                    REACTIONS: true
                                },
                                where: {
                                    logical_delete_indicator: false
                                }
                            }
                    }}
                }
            })) as unknown as GetPostsResponse[]
            return getPostsResponse(posts)
        } catch (error) {
            throw new Error(`Failed fetching data for school: ${school}`)
        }
    }

    //deleted array and failed to delete array
    async DeletePosts(req: Request, _res: Response){
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

    async CreatePost(req: Request, _res: Response) {
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
    CreateReply = async (req: Request, _res: Response) => {
        const { text, school_id, media_url, parent_post_id } = req.body
        try{
            if(!parent_post_id){
                throw new Error(`parent_post_id required.`)
            }
            
            const parent_post = await prisma.pOSTS.findFirst({
                where: {
                    id: parent_post_id,
                    logical_delete_indicator: false
                }
            })

            if(!parent_post){
                throw new Error(`Parent post not found.`)
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
    //TODO: rework reactToPosts
    async ReactToPosts(req: Request, _res: Response) {
        //three cases - post exists (no reactions), post exists (has reactions), post doesn't exist
        const { id } = req.user
        const likes: number[] = req.body.likes ?? []
        const dislikes: number[] = req.body.dislikes ?? []

        try{

            const likedPosts = await prisma.rEACTIONS.findMany({
                where: {
                    user_id: id,
                    post_id: {in: likes},
                }
            })

            const dislikedPosts = await prisma.rEACTIONS.findMany({
                where: {
                    user_id: id,
                    post_id: {in: dislikes},
                }
            })

            const existingPosts = new Set(dislikedPosts.concat(likedPosts).map(post => post.post_id))
            const nonexistingLikes = likes?.filter(like => !existingPosts.has(like)) ?? []
            const nonexistingDislikes = dislikes?.filter(dislike => !existingPosts.has(dislike)) ?? []

            const posts = new Set((await prisma.pOSTS.findMany({
                where: {
                    id: {in: likes.concat(dislikes)}
                }
            })).map(post => post.id))

            const reactions = nonexistingLikes.map((like) => {
                return {
                    reaction_type: 'like' as "dislike" | "like",
                    post_id: like,
                    user_id: id
                }

            }).concat(nonexistingDislikes.map((dislike) => {
                return {
                    reaction_type: 'dislike' as "dislike" | "like",
                    post_id: dislike,
                    user_id: id
                }
            })).filter((reaction) => posts.has(reaction.post_id))

            //create reaction type for user for posts liked/disliked not previously in database.
            const post = await prisma.rEACTIONS.createMany({
                data: reactions
            })

            //modify records in database previously liked/disliked but changed.
            const modifiedLikedPosts = await prisma.rEACTIONS.updateMany({
                where: {
                    id: {in: likedPosts.map((post) => {return post.id})},
                },
                data: {
                    reaction_type: 'like'
                }
            })

            const modifiedDislikedPosts = await prisma.rEACTIONS.updateMany({
                where: {
                    id: {in: dislikedPosts.map((post) => {return post.id})},
                },
                data: {
                    reaction_type: 'dislike'
                }
            })

            return response({
                newlyCreatedReactions: post.count, 
                modifiedDislikedPosts: modifiedDislikedPosts.count, 
                modifiedLikedPosts: modifiedLikedPosts.count
            })
        } catch (error) {
            throw error
        }
    }
    
    async UnreactToPosts(req: Request, _res: Response) {
        const { id } = req.user
        const post_ids: number[] = req.body.post_ids
        try{

            const unreactToPost = await prisma.rEACTIONS.deleteMany({
                where:{
                    user_id: id,
                    post_id: {in: post_ids}
                }
            })

            return response({message: `Unreacted to ${unreactToPost.count} posts.`})
        } catch (error) {
            throw new Error(`Failed to like post.`)
        }
    }

    async ReportPost(req: Request, _res: Response) {
        const { id } = req.user
        const text: string = req.body.text
        const post_id: number = Number(req.params.post_id)

        try{
            await prisma.rEPORTS.create({
                data: {
                    text: text,
                    author_id: id,
                    post_id: post_id
                }
            })
            return response({message: "Reported post: " + post_id})
        } catch (error) {
            throw new Error(`Failed to report post.`)
        }
    }
}

export default new PostController
