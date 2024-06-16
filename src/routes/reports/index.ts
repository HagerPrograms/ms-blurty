import { Router } from 'express';
import ReportsController from './controller';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = await ReportsController.GetReports(req,res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;