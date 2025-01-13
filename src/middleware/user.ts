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

        if(userType === "UNAUTHORIZED"){
            req.user = {
                id: undefined,
                role: "UNAUTHORIZED"
            }
            return res.status(401).send({error: "Access to this api has been denied."})
        }

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

        if(user.status === "banned"){
            req.user = {
                id: user.id,
                role: "UNAUTHORIZED"
            }
            return res.status(401).send({error: "This user has been banned."})
        }
        if(user.id === undefined){
            req.user = {
                id: undefined,
                role: "UNAUTHORIZED"
            }
            console.log('how?')
            return res.status(401).send({error: "This user was not found"})
        }

        req.user = {
            id: user.id,
            role: userType,
        }

        next()
    }
    catch (error){
        return res.status(400).send({error: `Unable to locate user: ${req.body.ip}`, })
    }

}
export { user }
