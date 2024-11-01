import { Response } from 'express';

export function sendResponse(
  res: Response,
  statusCode: number,
  message: string,
  data: object | null = null,
  error: boolean = false,
) {
  return res.status(statusCode).send({
    error,
    message,
    data,
  });
}
