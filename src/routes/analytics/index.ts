import { Router } from 'express';
import { controller } from './controller';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = controller()
        res.send(response)
    } catch (error) {
        return res.status(500).send({error: `${error}`});
    }

});
  
export default router;