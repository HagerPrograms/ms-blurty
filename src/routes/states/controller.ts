import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import { response } from "./response"

class StatesController {
    GetStates = async (req: Request, res: Response) => {
        try{
            const states = prisma.sTATES.findMany()
            return response(states)
        } catch (error) {
            throw new Error("Failed to /GET states.")
        }
    }
    CreateState = async (req: Request, res: Response) => {
        try {
            const {state_name, state_abbreviation} = req.body
            const states = prisma.sTATES.create(
                {data: {
                    abbreviation: state_abbreviation,
                    name: state_name
                }}
            )
            return response(states)
        } catch (error) {
            throw new Error("Failed to create state.")
        }
    }
    DeleteState = async (req: Request, res: Response) => {
        try{
            const {state_id} = req.body
            const states = prisma.sTATES.delete(
                {
                    where: {
                        id: state_id
                    }
                }
            )
            return response(states)
        } catch (error) {
            throw new Error("Failed to delete state.")
        }

    }
}
export default new StatesController