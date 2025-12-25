"use client";

import { useState } from "react";
import ChatList from "@/components/ChatList";
import { useRouter } from "next/navigation";

const chats = [
  { id: 1, name: "Alice", lastMessage: "Hello!" },
  { id: 2, name: "Bob", lastMessage: "Hey!" },
  { id: 3, name: "Charlie", lastMessage: "Good morning!" },
];

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(chats[0].id);
  const router = useRouter();

  const handleSelectChat = (id: number) => {
    setSelectedChatId(id);
    router.push(`/chat/${id}`);
  };

  return (
    <div className="flex h-screen">
      <ChatList
        chats={chats}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
      />
      <div className="flex-1 flex items-center justify-center text-gray-400">
        {selectedChatId ? `Open chat with id ${selectedChatId}` : "Select a chat"}
      </div>
    </div>
  );
}
