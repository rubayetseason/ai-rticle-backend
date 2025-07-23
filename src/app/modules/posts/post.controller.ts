import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PROMPT_MAP } from '../../../constants/aiPrompts';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import prisma from '../../../shared/prisma';
import PostService from './post.service';

const generateAIResponse = catchAsync(async (req: Request, res: Response) => {
  const { postId, mode } = req.body;

  if (!postId || !mode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'postId and mode are required');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const promptBuilder = PROMPT_MAP[mode as keyof typeof PROMPT_MAP];
  if (!promptBuilder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid mode');
  }

  const prompt = promptBuilder(post.title, post.tags, post.content);
  const result = await PostService.generateAIResponse(prompt);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'AI response generated',
    data: result,
  });
});

const createPost = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await PostService.createPost(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Post created successfully',
    data: response,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['search', 'tag']);
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
  const response = await PostService.getAllPosts(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Posts fetched successfully',
    data: response,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const response = await PostService.getSinglePost(postId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Post fetched successfully',
    data: response,
  });
});

const increaseViewCount = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const response = await PostService.increaseViewCount(postId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Post updated successfully',
    data: response,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const response = await PostService.deletePost(postId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Post deleted successfully',
    data: response,
  });
});

const PostController = {
  createPost,
  generateAIResponse,
  getSinglePost,
  getAllPosts,
  increaseViewCount,
  deletePost,
};
export default PostController;
