// "use client";
// import { useEffect, useState } from "react";
// import socket from "../utils/socket";

// interface Message {
//   senderId: number;
//   receiverId: number;
//   text: string;
// }

// export default function ChatBox({ senderId, receiverId }: { senderId: number; receiverId: number }) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     // Fetch old messages
//     fetch(`http://localhost:1337/api/messages/${senderId}/${receiverId}`)
//       .then((res) => res.json())
//       .then((data) => setMessages(data));

//     // Listen new messages
//     socket.on("receiveMessage", (msg: Message) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [senderId, receiverId]);

//   const sendMessage = async () => {
//     const msg: Message = { senderId, receiverId, text: input };
//     await fetch("http://localhost:1337/api/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(msg),
//     });
//     socket.emit("sendMessage", msg);
//     setInput("");
//   };

//   return (
//     <div className="p-4 border rounded-lg w-96">
//       <div className="h-64 overflow-y-auto border p-2">
//         {messages.map((m, i) => (
//           <div key={i} className={`my-1 ${m.senderId === senderId ? "text-right" : "text-left"}`}>
//             <span className="bg-blue-200 px-2 py-1 rounded">{m.text}</span>
//           </div>
//         ))}
//       </div>
//       <div className="flex mt-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border p-2 rounded-l"
//           placeholder="Type message..."
//         />
//         <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
