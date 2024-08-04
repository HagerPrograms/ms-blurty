import { Router } from 'express';
import StatesController from './controller';
import { admin } from '../../middleware/admin';
import { validate } from 'express-validation';
import { createStateValidation, deleteStateValidation } from '../../validations/states';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = await StatesController.GetStates(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/create', validate(createStateValidation), admin ,async (req, res) => {
    try{
        const response = await StatesController.CreateState(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.delete('/delete', validate(deleteStateValidation), admin, async (req, res) => {
    try{
        const response = await StatesController.DeleteState(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;