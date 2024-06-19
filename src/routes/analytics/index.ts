import { Router } from 'express';
import { controller } from './controller';

const router = Router();

router.get('/', async (req, res) => {
    try{
        //to be implemented
        //const response = controller()
        res.send('Not yet implemented')
    } catch (error) {
        return res.status(500).send({error: `${error}`});
    }

});
  
export default router;