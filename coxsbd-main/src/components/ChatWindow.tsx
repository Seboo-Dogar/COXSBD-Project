"use client";

import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function ChatWindow({ messages, onSendMessage }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-3/4 h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <MessageInput onSend={onSendMessage} />
      </div>
    </div>
  );
}
