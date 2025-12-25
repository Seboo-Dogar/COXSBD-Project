import { Router } from "express";
import { createProduct, getProducts } from "../controllers/product.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
const multer = require("multer");
const { diskStorage } = require("multer");
const { extname } = require("path");

const router = Router();

// Configure multer for file uploads
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single('image'), createProduct);
router.get("/", getProducts);

export default router;