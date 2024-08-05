import { Request, Response } from "express"
import { response } from "./response"
import prisma from "../../utils/prisma"

class ReportsController {
    GetReports = async (req: Request, res: Response) => {
        try{
            const reports = await prisma.rEPORTS.findMany({})
            return response(reports)
        }catch{
            throw new Error("Failed to get reports.")
        }
    }
    ResolveAllReports = async (req: Request, res: Response) => {
        try{
            const { post_id } = req.body
            const reports = await prisma.rEPORTS.updateMany({
                where: {
                    post_id: post_id
                },
                data: {
                    resolved: true
                }
            })
            return response(reports)
        } catch {
            throw new Error("Failed to resolve all reports.")
        }
    }
    ResolveOneReport = async (req: Request, res: Response) => {
        try{
            const { report_id } = req.body
            const reports = await prisma.rEPORTS.update({
                where: {
                    id: report_id
                },
                data: {
                    resolved: true
                }
            })
            return response(reports)
        } catch {
            throw new Error("Failed to resolve report.")
        }
    }
    unresolveAllReports = async (req: Request, res: Response) => {
        try{
            const { post_id } = req.body
            const reports = await prisma.rEPORTS.updateMany({
                where: {
                    post_id: post_id
                },
                data: {
                    resolved: false
                }
            })
            return response(reports)
        } catch {
            throw new Error("Failed to resolve all reports.")
        }
    }
    unresolveOneReport = async (req: Request, res: Response) => {
        try{
            const { report_id } = req.body
            const reports = await prisma.rEPORTS.update({
                where: {
                    id: report_id
                },
                data: {
                    resolved: false
                }
            })
            return response(reports)
        } catch {
            throw new Error("Failed to resolve report.")
        }
    }
}
export default new ReportsController