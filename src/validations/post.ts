import Joi from "joi"


export const getPostsValidation = {
    params: Joi.object({
        school: Joi.string().required()
    })
}

export const createPostValidation = {
    body: Joi.object({
        text: Joi.string().required(),
        author_ip: Joi.string().required(),
        school_id: Joi.number().required(),
        media_url: Joi.string().allow(null)
    })
}

export const deletePost = {
    params: Joi.object({
        post_id: Joi.string().required()
    })
}

export const reactToAPost = {
    
}

// export const createReplyValidation = {
//     body: Joi.object({
//         text: Joi.string().required(),
//         author_ip: Joi.string().required(),
//         school_id: Joi.number().required(),
//         media_url: Joi.string().allow(null)
//     })
// }

//react to a post

//unreact to a post

//report post
