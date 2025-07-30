import NextAuth, { JWT } from "next-auth";
import Google from "next-auth/providers/google";
import { supabase } from "./lib/supabase";
import { handleUserLogin } from "./lib/auth/user-login-actions";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
          ].join(" "),
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.expiresAt =
          Math.floor(Date.now() / 1000) + (account.expires_in ?? 3600);
        await handleUserLogin({ account, profile });
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
