import { Request, Response } from "express";
import * as authService from "../services/auth.service";

// Define the custom interface that req.user is expected to have.
// This locally fixes the TS2339 error until the environment type loading is resolved.
interface AuthUser {
  id: string;
  refreshToken?: string;
}

export const registerLocal = async (req: Request, res: Response) => {
  try {
    const tokens = await authService.registerLocal(req.body);
    res.status(201).json(tokens);
  } catch (err) { 
    if (err instanceof Error) {
      res.status(403).json({ message: err.message });
    } else {
      res.status(403).json({ message: "Something went wrong" });
    }
  }
};

export const loginLocal = async (req: Request, res: Response) => {
  try {
    const tokens = await authService.loginLocal(req.body);
    res.status(200).json(tokens);
  } catch (err) {
    if (err instanceof Error) {
      res.status(403).json({ message: err.message });
    } else {
      res.status(403).json({ message: "Something went wrong" });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    // FIX: Type assertion to allow access to 'id'
    await authService.logout({ id: (req.user as AuthUser).id }); 
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(403).json({ message: err.message });
    } else {
      res.status(403).json({ message: "Something went wrong" });
    }
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // FIX: Type assertion to allow access to 'id' and 'refreshToken'
    const user = req.user as AuthUser; 

    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const tokens = await authService.refreshToken({
      id: user.id, // Now safe to access
      refreshToken: user.refreshToken, // Now safe to access
    });

    res.status(201).json(tokens);
  } catch (err) {
    if (err instanceof Error) {
      res.status(403).json({ message: err.message });
    } else {
      res.status(403).json({ message: "Something went wrong" });
    }
  }
};