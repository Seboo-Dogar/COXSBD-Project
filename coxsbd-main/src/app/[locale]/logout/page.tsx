"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosConfig from "@/utils/axiosConfig";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await axiosConfig().post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      // Clear cookies always
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("userId");
      Cookies.remove("userRole");
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Logout
    </button>
  );
}
