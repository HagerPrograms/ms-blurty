//admin middleware
import { NextFunction, Request, Response } from "express"

const admin = async (req: Request, res: Response, next: NextFunction) => {
    if(req.user.role !== "ADMIN"){
        return res.status(401).send({error: "Access to this api has been denied."})
    }
    return next()
}

export { admin }