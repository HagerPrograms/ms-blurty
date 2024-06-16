import { Router } from 'express';
import ReportsController from './controller';

const router = Router();

router.get('/', async (req, res) => {
    const response = await ReportsController.GetReports(req,res)
    res.send(response)
});
  
export default router;