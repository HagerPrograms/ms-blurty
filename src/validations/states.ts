import Joi from "joi";

export const createStateValidation = {
    body: Joi.object({
        state_name: Joi.string().required(),
        state_abbreviation: Joi.string().required()
    })
}

export const deleteStateValidation = {
    body: Joi.object({
        state_id: Joi.number().required()
    })
}

export const getStatesValidation = {
    body: Joi.object({
    })
}