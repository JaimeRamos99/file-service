import { Request, Response, NextFunction } from 'express';

export function wrapAsyncController(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response>,
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Promise.resolve(fn(req, res, next));
    } catch (error) {
      next(error);
    }
  };
}
