import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { PostRoutes } from '../modules/posts/post.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/post',
    routes: PostRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
