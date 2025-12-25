import { Router } from "express";
import { getMerchantUsers } from "../controllers/user.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();

// GET /api/users/merchants - Get all users with MERCHANT role
router.get(
  "/merchants",
  accessTokenMiddleware,
  isAdmin,
  getMerchantUsers
);

export default router;

