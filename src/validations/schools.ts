import Joi from "joi"

export const getSchoolsValidation = {
    body: Joi.object({
    })
}

export const createSchoolValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        abbreviation: Joi.string().required(),
        state_id: Joi.number().required()
    })
}

export const deleteSchoolValidation = {
    body: Joi.object({
        id: Joi.number().required()
    })
}
