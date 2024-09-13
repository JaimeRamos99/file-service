import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  console.error('Error:', err.message);
  console.error(err.stack);

  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorResponse = {
    error: true,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
}
