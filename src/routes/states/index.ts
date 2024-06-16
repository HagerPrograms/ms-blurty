import { Router } from 'express';
import StatesController from './controller';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = await StatesController.GetStates(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;