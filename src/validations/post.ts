import Joi from "joi"


const getPostsValidation = {
    params: Joi.object({
        school: Joi.string().required()
    })
}