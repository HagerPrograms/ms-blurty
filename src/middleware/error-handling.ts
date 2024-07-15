import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validation';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({error: err});
  }

  res.status(500).json({
    message: 'An unexpected error occurred',
  });
};

export default errorHandler;