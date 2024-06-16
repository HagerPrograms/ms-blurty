import { Router } from 'express';
import { controller } from './controller';

const router = Router();

router.get('/', async (req, res) => {
    const response = controller()
    res.send(response)
});
  
export default router;