import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: number;
        user_type: "USER" | "ADMIN" | "UNAUTHORIZED";
        user_status: string;
      };
    }
  }
}
