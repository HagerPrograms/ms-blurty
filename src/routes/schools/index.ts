import { Router } from 'express';
import SchoolsController from './controller';
import { admin } from '../../middleware/admin';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = await SchoolsController.GetSchools(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/add', admin, async (req, res) => {
    try{
        const response = await SchoolsController.AddSchool(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/remove', admin, async (req, res) => {
    try{
        const response = await SchoolsController.RemoveSchool(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;