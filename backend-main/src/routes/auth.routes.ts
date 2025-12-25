import { Router } from "express";
import {
  registerLocal,
  loginLocal,
  logout,
  refreshToken,
} from "../controllers/auth.controller";
import {
  accessTokenMiddleware,
  refreshTokenMiddleware,
} from "../middlewares/accessToken.middleware";

const router = Router();

router.post("/local/register", registerLocal);
router.post("/local/login", loginLocal);
router.post("/logout", accessTokenMiddleware, logout);
router.post("/refresh", refreshTokenMiddleware, refreshToken);

export default router;
