import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import PostController from './post.controller';
import { PostValidation } from './post.validation';

const router = express.Router();

router.get('/', PostController.getAllPosts);

router.get('/:postId', auth(), PostController.getSinglePost);

router.post(
  '/create-post',

  validateRequest(PostValidation.createPostZodValidation),
  PostController.createPost
);

router.patch('/:postId', auth(), PostController.increaseViewCount);

router.delete('/:postId', auth(), PostController.deletePost);

export const PostRoutes = router;
