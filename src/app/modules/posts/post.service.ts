import { Post, Prisma } from '@prisma/client';
import {
  calculatePagination,
  PaginationOptions,
} from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';

const createPost = async (data: Post) => {
  return prisma.post.create({ data });
};

const getAllPosts = async (
  filters: { search?: string; tag?: string } & Partial<Post>,
  options: PaginationOptions
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, ...filterData } = filters;

  const conditions: Prisma.PostWhereInput[] = [];

  // partial match
  if (search) {
    conditions.push({
      OR: ['title'].map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }
  // exact match
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map(key => {
        if (key === 'tag') {
          return {
            tags: {
              has: filterData[key],
            },
          };
        }
        return {
          [key]: {
            equals: filterData[key as keyof typeof filterData],
          },
        };
      }),
    });
  }
  const whereConditions = conditions.length ? { AND: conditions } : {};

  const [result, total] = await Promise.all([
    await prisma.post.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    }),
    await prisma.post.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const getSinglePost = async (id: string) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};

const increaseViewCount = async (id: string) => {
  return prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
};

const deletePost = async (id: string) => {
  return prisma.post.delete({ where: { id } });
};

const PostService = {
  createPost,
  getSinglePost,
  getAllPosts,
  increaseViewCount,
  deletePost,
};
export default PostService;
