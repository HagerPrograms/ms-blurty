import { Router } from 'express';
import SchoolsController from './controller';

const router = Router();

router.get('/', async (req, res) => {
    const response = await SchoolsController.GetSchools(req, res)
    res.send(response)
});
  
export default router;