import Joi from "joi"


export const getPostsValidation = {
    params: Joi.object({
        school: Joi.string().required()
    })
}

export const createPostValidation = {
    body: Joi.object({
        text: Joi.string().required(),
        ip: Joi.string().required(),
        school_id: Joi.number().required(),
        media_url: Joi.string().allow(null)
    })
}

export const deletePost = {
    params: Joi.object({

    }),
    body: Joi.object({
        ip: Joi.string().required(),
        post_ids: Joi.array().items(Joi.number())
    })
}

export const reactToAPost = {
    
}

export const createReplyValidation = {
    body: Joi.object({
        text: Joi.string().required(),
        ip: Joi.string().required(),
        school_id: Joi.number().required(),
        media_url: Joi.string().allow(null),
        parent_post_id: Joi.number().required(),
    })
}

//react to a post

//unreact to a post

//report post
