"use client";
import { LogIn } from "@/lib/actions/auth";

export default function LoginButton() {
  return (
    <div
      onClick={() => LogIn()}
      className="gray-white-border rounded-lg px-3 py-2 text-white cursor-pointer "
    >
      Login with Google
    </div>
  );
}
