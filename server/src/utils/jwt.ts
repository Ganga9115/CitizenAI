import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
  fullName: string;
  departmentId?: string | null;
}

export const generateToken = (
  payload: TokenPayload
): string => {

  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN as SignOptions['expiresIn']
  };

  return jwt.sign(
    payload,
    ENV.JWT_SECRET,
    options
  );
};

export const verifyToken = (
  token: string
): TokenPayload => {

  return jwt.verify(
    token,
    ENV.JWT_SECRET
  ) as TokenPayload;
};