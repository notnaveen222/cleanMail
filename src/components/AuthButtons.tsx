"use client";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "@/lib/actions/auth";

export function AuthButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/auth")}
      className="px-3 py-2 border-2 hover:border-white transition-all duration-200 ease-in-out border-shad-border rounded-xl cursor-pointer"
    >
      Get Started
    </button>
  );
}

export function LogOutButton() {
  return (
    <div
      onClick={() => LogOut()}
      className="gray-white-border rounded-lg px-3 py-2 text-white cursor-pointer "
    >
      Logout
    </div>
  );
}

export function LogInButton() {
  return (
    <div
      onClick={() => LogIn()}
      className="gray-white-border rounded-lg px-3 py-2 text-white cursor-pointer "
    >
      Login with Google
    </div>
  );
}
