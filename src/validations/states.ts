import Joi from "joi";

export const createStateValidation = {
    body: Joi.object({
        ip: Joi.string().required(),
        state_name: Joi.string().required(),
        state_abbreviation: Joi.string().required()
    })
}

export const deleteStateValidation = {
    body: Joi.object({
        ip: Joi.string().required(),
        state_id: Joi.string().required()
    })
}

export const getStatesValidation = {
    body: Joi.object({
        ip: Joi.string().required()
    })
}