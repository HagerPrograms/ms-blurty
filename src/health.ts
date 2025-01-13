import { Router } from 'express';
import prisma from './utils/prisma'
const router = Router();

router.get('/health', async (_req, res) => {
    try{
        await prisma.$queryRaw`SELECT 1`;
        return res.status(200).send({
            'status': 'Healthy!',
        })
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

export default router