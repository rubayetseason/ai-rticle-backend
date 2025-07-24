import httpStatus from 'http-status';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/shared/prisma';

describe('POST /api/v1/post/create-post', () => {
  const mockUserId = 'e509a8f6-d1f7-4e68-bd80-a7ce7b419cc4';
  let validPost: Record<string, unknown>;

  beforeAll(async () => {
    await prisma.user.upsert({
      where: { id: mockUserId },
      update: {},
      create: {
        id: mockUserId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword123',
      },
    });
  });

  beforeEach(() => {
    validPost = {
      title: 'Testing AIrticle Post',
      shortDescp: 'A short summary about this test post',
      tags: ['test', 'jest', 'integration'],
      content: '<p>This is <strong>AIrticle</strong> post content.</p>',
      userId: mockUserId,
    };
  });

  test('should return 400 with proper error message if required field is missing', async () => {
    delete validPost.title;

    const res = await request(app)
      .post('/api/v1/post/create-post')
      .send(validPost)
      .expect(httpStatus.BAD_REQUEST);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation Error');
    expect(Array.isArray(res.body.errorMessages)).toBe(true);
    expect(res.body.errorMessages[0]).toMatchObject({
      path: 'title',
      message: expect.any(String),
    });
  });

  test('should return 400 if tags is not an array', async () => {
    validPost.tags = 'not-an-array' as unknown as string[];

    const res = await request(app)
      .post('/api/v1/post/create-post')
      .send(validPost)
      .expect(httpStatus.BAD_REQUEST);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation Error');
    expect(res.body.errorMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'tags',
          message: expect.any(String),
        }),
      ])
    );
  });

  test('should return 400 if userId is invalid or non-existent', async () => {
    validPost.userId = 'invalid-user-id';

    const res = await request(app)
      .post('/api/v1/post/create-post')
      .send(validPost)
      .expect(httpStatus.BAD_REQUEST);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/User not found|Invalid/i);
  });

  test('should return 400 if tags is empty', async () => {
    validPost.tags = [];

    const res = await request(app)
      .post('/api/v1/post/create-post')
      .send(validPost)
      .expect(httpStatus.BAD_REQUEST);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation Error');
    expect(res.body.errorMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'tags',
          message: expect.any(String),
        }),
      ])
    );
  });

  test('should return 201 and create post if valid', async () => {
    const res = await request(app)
      .post('/api/v1/post/create-post')
      .send(validPost)
      .expect(httpStatus.CREATED);

    const post = res.body.data;

    expect(res.body.success).toBe(true);
    expect(post).toEqual({
      id: expect.any(String),
      title: validPost.title,
      shortDescp: validPost.shortDescp,
      tags: validPost.tags,
      content: validPost.content,
      viewCount: 0,
      userId: mockUserId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    await prisma.post.delete({ where: { id: post.id } });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: mockUserId } }).catch(() => null);
    await prisma.$disconnect();
  });
});
