import { Router } from 'express';
import prisma from './utils/prisma'
const router = Router();

router.get('/health', async (req, res) => {
    try{
        const dbHealth = await prisma.$queryRaw`SELECT 1`;
        return res.status(200).send({
            'status': 'Healthy!',
            'dbConnection': !!dbHealth
        })
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

export default router
