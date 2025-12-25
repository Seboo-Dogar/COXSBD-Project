import { Request, Response } from "express";
import messageService from "../services/message.service";

export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, text } = req.body;
  const message = await messageService.createMessage(senderId, receiverId, text);
  res.json(message);
};

export const getMessages = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.params;
  const messages = await messageService.getMessages(String(senderId), String(receiverId));
  res.json(messages);
};
