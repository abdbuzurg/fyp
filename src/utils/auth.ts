import User from '../entities/User';
import { sign } from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id },
    ACCESS_TOKEN!,
    { expiresIn: "999d" }
  )
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id },
    REFRESH_TOKEN!,
    { expiresIn:"999d" }
  ) 
};