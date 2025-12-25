import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controller";

const router = Router();

router.post("/", sendMessage);
router.get("/:senderId/:receiverId", getMessages);

export default router;
