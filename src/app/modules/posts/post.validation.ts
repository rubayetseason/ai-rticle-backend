import { z } from 'zod';

const createPostZodValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    shortDescp: z.string().min(1, 'Short description is required'),
    tags: z.array(z.string().min(1, 'Tag cannot be empty')),
    content: z.string().min(1, 'Content is required'),
    userId: z.string().min(1, 'User id is required'),
  }),
});

export const PostValidation = { createPostZodValidation };
