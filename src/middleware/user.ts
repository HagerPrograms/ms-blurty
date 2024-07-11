//user middleware
import { NextFunction, Request, Response } from "express"
import prisma from "../utils/prisma";


const user = async (req: Request, res: Response, next: NextFunction) => {
    let user;
    const user_ip: string = req.body.user_ip

    const userType = 
    req.headers.apikey === process.env['MS-BLURTY-ADMIN-APIKEY'] ? 'ADMIN' : 
        req.headers.apikey === process.env['MS-BLURTY-USER-APIKEY'] ? 'USER' : 
        'UNAUTHORIZED'

    console.log(process.env)

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
    
    req.user = {
        user_id: user.id,
        user_type: userType,
        user_status: user.status === "banned" ? "BANNED" : "OK"

    }

    return next()
    
}
export { user }