"use client"; // if you're using App Router
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Menu,
  MessageCircle,
  ShoppingCart,
  CircleUser,
} from "lucide-react";

const BottomNavbar = ({
  handleCategoryClick,
}: {
  handleCategoryClick?: (tab: string) => void;
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("Home");

  const navigate = (tab: string, path: string) => {
    setActiveTab(tab);
    if (handleCategoryClick && tab === "Offers") {
      handleCategoryClick(tab);
    }
    router.push(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white h-16 w-full flex justify-around items-center shadow-lg border-t border-slate-200 z-10 md:hidden">
      <button
        onClick={() => navigate("Home", "/")}
        className={`flex flex-col items-center p-2 ${activeTab === "Home" ? "text-red-600" : "text-slate-600"}`}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button
        onClick={() => navigate("Offers", "/offers")}
        className={`flex flex-col items-center p-2 ${activeTab === "Offers" ? "text-red-600" : "text-slate-600"}`}
      >
        <Menu size={20} />
        <span className="text-xs mt-1">Offers</span>
      </button>
      <button
        onClick={() => navigate("Chat", "/chat")}
        className={`flex flex-col items-center p-2 ${activeTab === "Chat" ? "text-red-600" : "text-slate-600"}`}
      >
        <MessageCircle size={20} />
        <span className="text-xs mt-1">Chat</span>
      </button>
      <button
        onClick={() => navigate("Cart", "/cart")}
        className={`flex flex-col items-center p-2 ${activeTab === "Cart" ? "text-red-600" : "text-slate-600"}`}
      >
        <ShoppingCart size={20} />
        <span className="text-xs mt-1">Cart</span>
      </button>
      <button
        onClick={() => navigate("Account", "/account")}
        className={`flex flex-col items-center p-2 ${activeTab === "Account" ? "text-red-600" : "text-slate-600"}`}
      >
        <CircleUser size={20} />
        <span className="text-xs mt-1">Account</span>
      </button>
    </nav>
  );
};

export default BottomNavbar;
