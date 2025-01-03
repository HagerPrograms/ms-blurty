import Joi from "joi"

export const getSchoolsValidation = {
    body: Joi.object({
        ip: Joi.string().required()
    })
}

export const createSchoolValidation = {
    body: Joi.object({
        ip: Joi.string().required(),
        name: Joi.string().required(),
        abbreviation: Joi.string().required(),
        state_id: Joi.number().required()
    })
}

export const deleteSchoolValidation = {
    body: Joi.object({
        ip: Joi.string().required(),
        id: Joi.number().required()
    })
}
