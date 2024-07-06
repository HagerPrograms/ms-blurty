import Joi from "joi"


export const getPostsValidation = {
    params: Joi.object({
        school: Joi.string().required()
    })
}