/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleClientError from '../../errors/handleClientError';
import handleValidationError from '../../errors/handleValidationError';
import handleZodError from '../../errors/handleZodError';
import { IGenericErrorMessage } from '../../interfaces/error';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === 'development'
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
    : console.log(`🐱‍🏍 globalErrorHandler ~~`, error);

  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;

    // Handle Foreign Key Constraint Violation
    if (
      error.code === 'P2003' &&
      error.meta?.constraint === 'Post_userId_fkey'
    ) {
      message = 'User not found';
      errorMessages = [
        {
          path: 'userId',
          message: 'User not found',
        },
      ];
    } else if (
      error.code === 'P2002' &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      error.meta?.target?.includes('email')
    ) {
      message = 'Email already exists';
      errorMessages = [
        {
          path: 'email',
          message: 'Email already exists',
        },
      ];
    } else if (
      error.code === 'P2002' &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      error.meta?.target?.includes('username')
    ) {
      message = 'Username already taken';
      errorMessages = [
        {
          path: 'username',
          message: 'Username already taken',
        },
      ];
    } else {
      message = simplifiedError.message;
      errorMessages = simplifiedError.errorMessages;
    }
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
