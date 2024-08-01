import { Router } from 'express';
import UserController from './controller';

const router = Router();

router.post('/', async (req, res) => {
    try{
        const response = await UserController.CreateUser(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/ban', async (req, res) => {
    try{
        const response = await UserController.BanUser(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
})

router.post('/unban', async (req, res) => {
    try{
        const response = await UserController.unbanUser(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
})
;
  
export default router;