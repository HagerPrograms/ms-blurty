import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import { response } from "./response"

class SchoolsController {
    GetSchools = async (req: Request, res: Response) => {
        try {
            const states = prisma.sCHOOLS.findMany()
            return response(states)
        } catch {
            throw new Error("Failed to /GET schools.")
        }
    }
    CreateSchool = async (req: Request, res: Response) => {
        try {
            const {name, abbreviation, state_id} = await req.body
            const states = prisma.sCHOOLS.create({
                data: {
                    name: name,
                    abbreviation: abbreviation,
                    state_id: state_id
                }})
            return response(states)
        } catch (error) {
            console.log(error)
            throw new Error("Failed to create school.")
        }

    }
    DeleteSchool = async (req: Request, res: Response) => {
        try{
            const {id} = await req.body
            const states = prisma.sCHOOLS.delete({
                where: {
                    id:  id
                }
            })
            return response(states)
        } catch {
            throw new Error("Failed to delete school.")
        }

    }
}
export default new SchoolsController