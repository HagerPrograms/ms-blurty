import Joi from "joi";

export const createUserValidation = {
    body: Joi.object({
        user_id: Joi.number().required()
    })
}

export const banUserValidation = {
    body: Joi.object({
        user_id: Joi.number().required()
    })
}

export const unbanUserValidation = {
    body: Joi.object({
        user_id: Joi.number().required()
    })
}