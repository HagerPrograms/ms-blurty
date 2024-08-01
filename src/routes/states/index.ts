import { Router } from 'express';
import StatesController from './controller';
import { admin } from '../../middleware/admin';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = await StatesController.GetStates(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/create', admin ,async (req, res) => {
    try{
        const response = await StatesController.AddState(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.delete('/delete', admin, async (req, res) => {
    try{
        const response = await StatesController.RemoveState(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;