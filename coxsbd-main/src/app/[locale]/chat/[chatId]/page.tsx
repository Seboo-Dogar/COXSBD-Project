"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import socket from "@/utils/socket";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Fetch old messages
    fetch(`http://localhost:1337/messages/${chatId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // Listen to new messages
    socket.on("receiveMessage", (msg: Message) => {
      if (msg.sender === chatId || msg.sender === "me") {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const handleSendMessage = (content: string) => {
    const msg: Message = {
      id: Date.now(),
      sender: "me",
      content,
      timestamp: new Date().toISOString(),
    };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="flex flex-1">
      <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}
