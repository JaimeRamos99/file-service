import { Request, Response, NextFunction } from 'express';

export function wrapAsyncController(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
