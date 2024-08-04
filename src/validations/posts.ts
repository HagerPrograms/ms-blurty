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

export const unreactToPostsValidation = {
    body: Joi.object({
        post_ids: Joi.array().items(Joi.number())
    })
}

export const reactToPostsValidation = {
    body: Joi.object({
        likes: Joi.array().items(Joi.number()),
        dislikes: Joi.array().items(Joi.number()),
    })
}

export const createReportValidation = {
    body: Joi.object({
        text: Joi.string().required(),
        post_id: Joi.number().required()
    })
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
//create a post
//react a post
//unreact
//report post
