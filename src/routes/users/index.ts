import { Router } from 'express';
import UserController from './controller';
import { admin } from '../../middleware/admin';
import { unbanUserValidation } from '../../validations/user';
import { validate } from 'express-validation';
import { createUserValidation } from '../../validations/user';
import { banUserValidation } from '../../validations/user';

const router = Router();

router.post('/', validate(createUserValidation), admin, async (req, res) => {
    try{
        const response = await UserController.CreateUser(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/ban', validate(banUserValidation), admin, async (req, res) => {
    try{
        const response = await UserController.BanUser(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
})

router.post('/unban', validate(unbanUserValidation), admin, async (req, res) => {
    try{
        const response = await UserController.unbanUser(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
})
;
  
export default router;
