import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import { response } from "./response"

class StatesController {
    GetStates = async (req: Request, res: Response) => {
        const states = prisma.sTATES.findMany()
        return response(states)
    }
    AddState = async (req: Request, res: Response) => {
        const {state_name, state_abbreviation} = req.body
        const states = prisma.sTATES.create(
            {data: {
                abbreviation: state_abbreviation,
                name: state_name
            }}
        )
        return response(states)
    }
    RemoveState = async (req: Request, res: Response) => {
        const {state_id} = req.body
        const states = prisma.sTATES.delete(
            {
                where: {
                    id: state_id
                }
            }
        )
        return response(states)
    }
}
export default new StatesController