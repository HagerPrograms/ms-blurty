import { Router } from 'express';
import StatesController from './controller';

const router = Router();

router.get('/', async (req, res) => {
    const response = await StatesController.GetStates(req, res)
    res.send(response)
});
  
export default router;