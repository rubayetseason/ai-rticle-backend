import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';

const createUser = async (data: User): Promise<User> => {
  //hashed the user password
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data,
  });
  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, 'This user is not found!');

  const isMatched = await bcrypt.compare(payload.password, user.password);
  if (!isMatched)
    throw new ApiError(httpStatus.FORBIDDEN, 'Password does not match');

  const jwtPayload = {
    userId: user.id,
    userEmail: user.email,
    userName: user.username,
  };

  const accessToken = createToken(jwtPayload, config.jwt.secret as Secret, {
    expiresIn: config.jwt.expires_in,
  });

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret as Secret,
    { expiresIn: config.jwt.refresh_expires_in }
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(
    token,
    config.jwt.refresh_secret as Secret
  ) as JwtPayload;
  const { userId } = decoded;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, 'This user is not found !');

  const accessToken = createToken(
    {
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
    },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.expires_in,
    }
  );

  return { accessToken };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  createUser,
};
