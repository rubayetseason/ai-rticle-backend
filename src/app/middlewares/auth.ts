import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authorization token missing'
      );
    }

    const decoded = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }

    // attach decoded user to request object
    req.user = decoded;

    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Token is invalid or expired'));
  }
};

export default auth;
