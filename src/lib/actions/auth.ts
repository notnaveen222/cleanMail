"use server";

import { signIn, signOut } from "@/auth";

export const LogIn = async () => {
  return await signIn("google", { redirectTo: "/dashboard" });
};

export const LogOut = async () => {
  return await signOut({ redirectTo: "/auth" });
};
