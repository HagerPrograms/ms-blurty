import { Router } from 'express';
import SchoolsController from './controller';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = await SchoolsController.GetSchools(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/add', async (req, res) => {
    try{
        const response = await SchoolsController.AddSchool(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/remove', async (req, res) => {
    try{
        const response = await SchoolsController.RemoveSchool(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;