import { Router } from 'express';
import PostController from './controller';

const router = Router();

//get posts for a school
router.get('/:school', async (req, res) =>{
    try{
        const response = await PostController.getPosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

//delete a post
router.delete('/:postId', async (req, res) => {
    try{
        const response = await PostController.deletePosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

//create a post
router.post('/', async (req, res) => {
    try{
        const response = await PostController.createPost(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});


//react a post
router.post('/react', async (req, res) => {
    try{
        const response = await PostController.reactToPosts(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
});

router.post('/report/:postId', async (req, res) => {
    try{
        const response = await PostController.reportPost(req, res)
        return res.send(response)
    } catch (error){
        return res.status(500).send({error: `${error}`});
    }
} )



//dislike a post
// router.post('/dislike', async (req, res) => {
//     try{
//         const response = await PostController.dislikePosts(req, res)
//         return res.send(response)
//     } catch (error){
//         return res.status(500).send({error: `${error}`});
//     }
// });

// router.post('/', async (req, res) => {
//     const response = controller()
//     res.send(response)
// });
  
export default router;