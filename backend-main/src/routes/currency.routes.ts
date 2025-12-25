import { Router } from "express";
import * as controller from "../controllers/currency.controller";

const router = Router();

router.post("/", controller.createCurrency);
router.get("/", controller.getCurrencies);
router.put("/:id", controller.updateCurrency);
router.delete("/:id", controller.deleteCurrency);
router.post("/convert", controller.convertCurrency);

export default router;
