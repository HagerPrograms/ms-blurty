import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import { response } from "./response"

class StatesController {
    GetStates = async (req: Request, res: Response) => {
        const states = prisma.sTATES.findMany()
        return response(states)
    }
}
export default new StatesController