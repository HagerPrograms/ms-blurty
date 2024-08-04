// router.get('/',
// router.get('/resolveAll',

import Joi from "joi"


export const getAllReportsValidation = {
    body: Joi.object({
    })
}

export const resolveOneReportValidation = {
    body: Joi.object({
        report_id: Joi.number().required()
    })
}

export const resolveAllReportsValidation = {
    body: Joi.object({
        post_id: Joi.number().required()
    })
}