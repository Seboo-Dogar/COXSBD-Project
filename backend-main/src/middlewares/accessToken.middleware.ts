import { Request, Response, NextFunction } from "express";
// Use * as jwt to handle the library's export structure correctly in TS
import * as jwt from "jsonwebtoken"; 

// 1. Updated interface to include role
interface JwtUserPayload {
  id: string;
  role: string; 
}

// Access Token Middleware
export const accessTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  
  // Use the key directly from process.env to ensure it's loaded
  const secret = process.env.ACCESS_KEY;

  try {
    if (!secret) {
      throw new Error("ACCESS_KEY is not defined in .env");
    }

    // This now works because jwt is correctly imported
    const payload = jwt.verify(token, secret) as JwtUserPayload;
    
    if (!payload.id || !payload.role) {
      return res.status(403).json({ message: "Invalid token payload: Role missing" });
    }

    // Attach to req.user using type assertion to avoid Express TS errors
    (req as any).user = { 
        id: payload.id, 
        role: payload.role 
    };

    next();
  } catch (error: any) {
    // Log the specific error for debugging
    console.error("❌ JWT Access Error:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Refresh Token Middleware
export const refreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.refreshToken;
  const refreshSecret = process.env.REFRESH_KEY;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    if (!refreshSecret) {
      throw new Error("REFRESH_KEY is not defined in .env");
    }

    const payload = jwt.verify(refreshToken, refreshSecret) as JwtUserPayload;

    if (!payload.id || !payload.role) {
      return res.status(403).json({ message: "Invalid refresh token payload" });
    }

    (req as any).user = { 
      id: payload.id, 
      role: payload.role 
    };

    next();
  } catch (error: any) {
    console.error("❌ JWT Refresh Error:", error.message);
    return res.status(403).json({ message: "Expired or invalid refresh token" });
  }
};