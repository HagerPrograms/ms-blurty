import { Request, Response } from "express"
import { response } from "./response"
import prisma from "../../utils/prisma"

class UserController {
    CreateUser = async (req: Request, _res: Response) => {
        let user;
        const ip = req.body.ip

        user = await prisma.uSERS.findFirst({
            where: {
                ip: ip
            }
        })

        if(!user){
            user = await prisma.uSERS.create({
                data: {
                    ip: ip
                }
            })
        }

        return response(user)
    }
}

export default new UserController