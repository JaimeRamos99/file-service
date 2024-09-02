import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: CustomError, req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message);
  console.error(err.stack);

  const statusCode = err.status || 500;
  const errorResponse = {
    error: true,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
}
