import { Request, Response } from "express"
import { response } from "./response"
import prisma from "../../utils/prisma"

class ReportsController {
    GetReports = async (req: Request, res: Response) => {
        const reports = await prisma.rEPORTS.findMany({})
        return response(reports)
    }
    ResolveAllReports = async (req: Request, res: Response) => {
        const {post_id} = req.body
        const reports = await prisma.rEPORTS.updateMany({
            where: {
                post_id: post_id
            },
            data: {
                resolved: true
            }
        })
        return response(reports)
    }
    ResolveOneReport = async (req: Request, res: Response) => {
        const {report_id} = req.body
        const reports = await prisma.rEPORTS.update({
            where: {
                id: report_id
            },
            data: {
                resolved: true
            }
        })
        return response(reports)
    }
}
export default new ReportsController