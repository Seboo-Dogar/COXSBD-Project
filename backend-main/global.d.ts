// coxsbd-project\coxsbd-backend\global.d.ts

import { Request } from 'express';

// 1. Augment the Express namespace (defines the properties on req.user)
declare global {
  namespace Express {
    interface User {
      id: string; 
      refreshToken?: string; 
    }
  }
}

// 2. Augment the Request interface in express-serve-static-core (tells Request what req.user is)
declare module "express-serve-static-core" {
  interface Request {
    user?: Express.User;
  }
}