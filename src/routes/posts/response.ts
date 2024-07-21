import { reaction_type } from '@prisma/client'
import {GetPostsResponse, Post} from '../types/api'

const response = (posts: any) => {
    return posts
}

const countReactions = (post: Post | undefined) => {
    let reactionCount = 0
    if(!post){
        return 0
    }
    post.REACTIONS?.forEach((reaction) => {
        if(reaction.reaction_type === 'like'){
            reactionCount++
        }
        if(reaction.reaction_type === 'dislike'){
            reactionCount--
        }
    })
    return reactionCount
}
    

const getPostsResponse = (getPostsResponse: GetPostsResponse[]) => {
    const [school] = getPostsResponse
    const posts = school.POSTS.map((post) => {
        const { text, created_on, id: post_id, media_url} = post
        const reaction_count = countReactions(post)

    
    return {
        text,
        created_on,
        post_id,
        media_url,
        reaction_count,
        replies: post.other_POSTS?.map((reply) => {
            return {
                id: reply.id,
                text: reply.text,
                media_url: reply.media_url,
                reaction_count: countReactions(reply as Post)
            }
        }) ?? []
    }
})
return posts
}

export { response, getPostsResponse }