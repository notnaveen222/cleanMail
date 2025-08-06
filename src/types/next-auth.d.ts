// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId?: string; // 👈 Your custom field
    };
    accessToken?: string;
    userId?: string;
  }

  interface JWT {
    userId?: string;
    accessToken?: string;
  }
}
