import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // 1. Check if user exists (set by accessTokenMiddleware)
    const user = req.user as { id: string; role: string } | undefined;

    if (!user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    // 2. Log for debugging (Check your backend terminal)
    console.log("Checking Admin for:", user);

    // 3. Case-sensitive check against your Prisma Enum 'ADMIN'
    if (user.role === 'ADMIN') {
        next();
    } else {
        console.log(`Access Denied: User role is ${user.role}`);
        return res.status(403).json({ message: "Access denied: Admin privileges required" });
    }
};