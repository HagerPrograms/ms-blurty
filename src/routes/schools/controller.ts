import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import { response } from "./response"

class SchoolsController {
    GetSchools = async (req: Request, res: Response) => {
        const states = prisma.sCHOOLS.findMany()
        return response(states)
    }
}
export default new SchoolsController