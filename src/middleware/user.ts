//user middleware
import { NextFunction, Request, Response } from "express"
import prisma from "../utils/prisma";


const user = async (req: Request, res: Response, next: NextFunction) => {
    const user_ip: string = req.body.ip
    try{
        let user;
        const userType = 
            req.headers.apikey === process.env['MS-BLURTY-ADMIN-APIKEY'] ? 'ADMIN' : 
            req.headers.apikey === process.env['MS-BLURTY-USER-APIKEY'] ? 'USER' : 
            'UNAUTHORIZED'

        user = await prisma.uSERS.findFirst({
            where: {
                ip: user_ip
            }
        })

        if(!user) {
            user = await prisma.uSERS.create({
                data: {
                    ip: user_ip
                }
            })
        }

        if(userType === "UNAUTHORIZED"){
            return res.status(401).send({error: "Access to this api has been denied."})
        }
        if(user.status === "banned"){
            return res.status(401).send({error: "This user has been banned."})
        }
        if(user.id === undefined){
            return res.status(401).send({error: "This user was not found"})
        }

        req.user = {
            id: user.id,
            role: userType,
        }

        return next()
    }
    catch (error){
        return res.status(400).send({error: `Unable to locate user: ${req.body.ip}`, })
    }

}
export { user }
