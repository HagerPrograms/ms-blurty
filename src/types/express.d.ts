import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        role: "USER" | "ADMIN" | "UNAUTHORIZED";
      };
    }
  }
}
