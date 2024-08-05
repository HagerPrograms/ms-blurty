import { Router } from 'express';
import ReportsController from './controller';
import { admin } from '../../middleware/admin';

const router = Router();

router.get('/', admin, async (req, res) => {
    try{
        const response = await ReportsController.GetReports(req,res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/resolveAll', admin, async (req, res) => {
    try{
        const response = await ReportsController.ResolveAllReports(req,res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/resolveOne', admin, async (req, res) => {
    try{
        const response = await ReportsController.ResolveOneReport(req,res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/unresolveAll', admin, async (req, res) => {
    try{
        const response = await ReportsController.unresolveAllReports(req,res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/unresolveOne', admin, async (req, res) => {
    try{
        const response = await ReportsController.unresolveOneReport(req,res)
        res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

  
export default router;