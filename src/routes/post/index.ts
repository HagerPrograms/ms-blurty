import { Router } from 'express';
import { controller } from './controller';

const router = Router();

//create post
//delete post
//get posts
//ban posts

router.get('/', async (req, res) => {
    const response = controller()
    res.send(response)
});
  
export default router;