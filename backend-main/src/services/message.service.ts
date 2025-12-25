import prisma from "../utils/prisma";

const createMessage = async (senderId: string, receiverId: string, text: string) => {
  return await prisma.message.create({
    data: { senderId, receiverId, text },
  });
};

const getMessages = async (senderId: string, receiverId: string) => {
  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
};

export default { createMessage, getMessages };
