import { Router } from 'express';
import PostController from './controller';

const router = Router();

//get posts for a school
router.get('/:school', async (req, res) =>{
    try{
        const response = await PostController.GetPosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

//delete a post
router.delete('/:postId', async (req, res) => {
    try{
        const response = await PostController.DeletePosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

//create a post
router.post('/', async (req, res) => {
    try{
        const response = await PostController.CreatePost(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});


//react a post
router.post('/react', async (req, res) => {
    try{
        const response = await PostController.ReactToPosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/report/:postId', async (req, res) => {
    try{
        const response = await PostController.ReportPost(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
} )
  
export default router;