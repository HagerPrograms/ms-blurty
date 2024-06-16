import { Router } from 'express';
import ReplyController from './controller';

const router = Router();

router.post('/', async (req, res) => {
    try{
        const response = await ReplyController.CreateReply(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;