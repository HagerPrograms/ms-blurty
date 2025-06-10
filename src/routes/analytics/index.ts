import { Router } from 'express';
import AnalyticsController from './controller';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const analytics = await AnalyticsController.GetAnalytics(req, res)
        res.send(analytics)
    } catch (error) {
        return res.status(500).send({error: `${error}`});
    }

});
  
export default router;