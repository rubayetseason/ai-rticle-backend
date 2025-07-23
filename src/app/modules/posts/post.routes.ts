import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import PostController from './post.controller';
import { PostValidation } from './post.validation';

const router = express.Router();

router.get('/', PostController.getAllPosts);

router.get('/:postId', PostController.getSinglePost);

router.post(
  '/create-post',
  validateRequest(PostValidation.createPostZodValidation),
  PostController.createPost
);

router.post('/generate', PostController.generateAIResponse);

router.patch('/:postId', PostController.increaseViewCount);

router.delete('/:postId', PostController.deletePost);

export const PostRoutes = router;
