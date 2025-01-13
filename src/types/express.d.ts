import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        id?: number;
        ip?: string;
        role: "USER" | "ADMIN" | "UNAUTHORIZED";
      }
    }
  }
}
