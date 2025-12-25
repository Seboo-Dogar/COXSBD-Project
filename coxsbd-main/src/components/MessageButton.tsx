"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  read: boolean;
}

const URL = "http://localhost:1337"; // Your backend URL

export default function MessageButton() {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Header dropdown
  const [chatOpen, setChatOpen] = useState(false); // Bottom-right chat
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io(URL);

    fetch("/messages")
      .then((res) => res.json())
      .then(setMessages);

    socketRef.current.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.off("receiveMessage");
      socketRef.current?.disconnect();
    };
  }, []);

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      {/* _____Header Dropdown Button_____ */}
      <div className="relative flex flex-col items-center mr-5">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative text-slate-700 hover:text-red-600"
        >
          <MessageCircle size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Label under the icon */}
        <span className="text-xs text-slate-700 mt-1">Messages</span>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border border-slate-200 rounded-lg overflow-hidden z-50">
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-200">
              <h3 className="font-semibold text-slate-700">Messages</h3>
              <button
                onClick={() => setDropdownOpen(false)}
                className="text-slate-400 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-slate-400 p-4">No messages</p>
              ) : (
                messages.map((msg) => (
                  <Link
                    key={msg.id}
                    href={`/chat/${msg.sender}`}
                    className={`block px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                      !msg.read ? "bg-red-50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {msg.sender}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {msg.text}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="text-center p-2 border-t border-slate-200">
              <Link
                href="/chat"
                className="text-red-600 text-sm hover:underline"
              >
                See all messages
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* _____Floating Bottom-Right Chat_____ */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-red-700 transition"
        >
          <MessageCircle size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-white shadow-xl border border-slate-200 rounded-lg flex flex-col z-50">
          {/* Chat Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-slate-200">
            <h3 className="font-semibold text-slate-700">Messages</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-2">
            {messages.length === 0 ? (
              <p className="text-center text-slate-400 p-4">No messages</p>
            ) : (
              messages.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/chat/${msg.sender}`}
                  className={`block px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                    !msg.read ? "bg-red-50" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-slate-700">
                    {msg.sender}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{msg.text}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </Link>
              ))
            )}
          </div>

          {/* Footer / See All Messages */}
          <div className="text-center p-2 border-t border-slate-200">
            <Link href="/chat" className="text-red-600 text-sm hover:underline">
              See all messages
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
