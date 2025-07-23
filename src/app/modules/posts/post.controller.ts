import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import PostService from './post.service';

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
  const filters = pick(req.query, ['search']);
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
  const response = await PostService.getAllPosts(filters, options);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Categories fetched successfully',
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
  getSinglePost,
  getAllPosts,
  increaseViewCount,
  deletePost,
};
export default PostController;
