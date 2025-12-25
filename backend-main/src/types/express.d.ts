// src/types/express.d.ts

// This extends the Express module's Request interface globally.
declare global {
  namespace Express {
    // Define the structure of the user object attached by accessTokenMiddleware
    interface Request {
      // NOTE: We assume your JWT payload includes the user's ID and ROLE.
      user?: {
        id: string; // From the token payload
        role?: 'ADMIN' | 'USER' | string; // Assuming standard roles, replace with your actual roles
      };
    }
  }
}

// Ensure this file is treated as a module
export {};