import { Router } from 'express';
import SchoolsController from './controller';
import { admin } from '../../middleware/admin';
import { validate } from 'express-validation';
import { createSchoolValidation, deleteSchoolValidation } from '../../validations/schools';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const response = await SchoolsController.GetSchools(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/create', validate(createSchoolValidation), admin, async (req, res) => {
    try{
        const response = await SchoolsController.CreateSchool(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.delete('/delete', validate(deleteSchoolValidation), admin, async (req, res) => {
    try{
        const response = await SchoolsController.DeleteSchool(req, res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
  
export default router;