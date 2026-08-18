import {
  Response,
  NextFunction
} from 'express';

import {
  AuthenticatedRequest
} from './auth.middleware';

import {
  verifyToken
} from '../utils/jwt';

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {

  const authHeader =
    req.headers.authorization;

  // --------------------------------------------------------
  // No token
  // --------------------------------------------------------

  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ')
  ) {
    next();
    return;
  }

  const token =
    authHeader.substring(7);

  try {

    const payload =
      verifyToken(token);

    req.user = payload;

  } catch (error) {

    // Invalid token should not make public chatbot fail.
    // Treat the user as unauthenticated.
    console.warn(
      '[OptionalAuth] Invalid token supplied.'
    );
  }

  next();
};