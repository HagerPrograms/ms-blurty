// router.get('/',
// router.get('/resolveAll',

import Joi from "joi"


export const getAllReportsValidation = {
    body: Joi.object({
        ip: Joi.string().required()
    })
}

export const resolveOneReportValidation = {
    body: Joi.object({
        ip: Joi.string().required(),
        report_id: Joi.number().required()
    })
}

export const resolveAllReportsValidation = {
    body: Joi.object({
        ip: Joi.string().required(),
        post_id: Joi.number().required()
    })
}