import { Router } from 'express';
import UserController from './controller';

const router = Router();

router.post('/', async (req, res) => {
    try{
        const response = await UserController.CreateUser(req, res)
        console.log('response:', response)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;