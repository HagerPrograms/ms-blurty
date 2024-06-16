import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import { response } from "./response"

class SchoolsController {
    GetSchools = async (req: Request, res: Response) => {
        const states = prisma.sCHOOLS.findMany()
        return response(states)
    }
    AddSchool = async (req: Request, res: Response) => {
        const {name, abbreviation, state_id} = await req.body.body
        const states = prisma.sCHOOLS.create({
            data: {
                name: name,
                abbreviation: abbreviation,
                state_id: state_id
            }})
        return response(states)
    }
}
export default new SchoolsController