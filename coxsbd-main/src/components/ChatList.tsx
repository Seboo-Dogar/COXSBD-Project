"use client";

import React from "react";

interface ChatListProps {
  chats: { id: number; name: string; lastMessage: string }[];
  onSelectChat: (id: number) => void;
  selectedChatId: number | null;
}

export default function ChatList({ chats, onSelectChat, selectedChatId }: ChatListProps) {
  return (
    <div className="w-1/4 border-r border-gray-200 h-full overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`p-4 cursor-pointer hover:bg-gray-100 ${
            selectedChatId === chat.id ? "bg-gray-200" : ""
          }`}
        >
          <h3 className="font-semibold">{chat.name}</h3>
          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}
