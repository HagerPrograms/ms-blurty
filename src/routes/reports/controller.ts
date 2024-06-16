import { Request, Response } from "express"
import { response } from "./response"
import prisma from "../../utils/prisma"

class ReportsController {
    GetReports = async (req: Request, res: Response) => {
        const reports = await prisma.rEPORTS.findMany({})
        return response(reports)
    }
}
export default new ReportsController