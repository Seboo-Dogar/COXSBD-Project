"use client";
import React, { useState } from "react";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeChat = () => setIsOpen(false);
  const openChat = () => setIsOpen(true);

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-4 right-4 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        >
          💬
        </button>
      )}

      {/* Chat box */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-white shadow-xl border border-slate-200 rounded-lg flex flex-col z-50">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-2 border-b border-slate-200">
            <h3 className="font-semibold text-slate-700">Messages</h3>
            <button onClick={closeChat}>X</button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* map your messages here */}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-slate-200">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
