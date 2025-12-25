import { Router } from "express";
import { createCategory, getCategories } from "../controllers/category.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);

export default router;