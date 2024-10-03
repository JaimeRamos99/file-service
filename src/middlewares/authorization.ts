import { NextFunction, Request, Response } from 'express';
import { env, Logger, sendResponse } from '../utils';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  email: string;
}

export function checkAuthToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return sendResponse(res, StatusCodes.NOT_FOUND, 'No authorization token found');
  }

  const bearerToken = authHeader.split(' ');
  if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'No valid Bearer Token');
  }

  const token = bearerToken[1];
  if (!token) {
    return sendResponse(res, StatusCodes.NOT_FOUND, 'No Bearer Token found');
  }

  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      Logger.error('Invalid or expired token', err);
      return sendResponse(res, StatusCodes.FORBIDDEN, 'Invalid or expired token');
    }
    const user = decoded as UserPayload;

    res.locals.user = user;

    next();
  });
}
