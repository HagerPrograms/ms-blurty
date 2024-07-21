import { Router } from 'express';
import PostController from './controller';
import { validate } from 'express-validation' 
import { createPostValidation, getPostsValidation, createReplyValidation, deletePost } from '../../validations/post';
import { admin } from '../../middleware/admin';
const router = Router();

//create a post

//should add bulk support where possible
router.post('/', validate(createPostValidation), async (req, res) => {
    try{
        const response = await PostController.CreatePost(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

//create a post
router.post('/reply', validate(createReplyValidation), async (req, res) => {
    try{
        const response = await PostController.CreateReply(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
//get posts for a school
router.get('/:school', validate(getPostsValidation), async (req, res) =>{
    try{
        const response = await PostController.GetPosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});
//delete a post
router.delete('/', admin, validate(deletePost), async (req, res) => {
    try{
        const response = await PostController.DeletePosts(req, res)
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

//unreact
router.post('/unreact', async (req, res) => {
    try{
        const response = await PostController.UnreactToPosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

//report post
router.post('/report/:post_id', async (req, res) => {
    try{
        const response = await PostController.ReportPost(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
} )
  
export default router;