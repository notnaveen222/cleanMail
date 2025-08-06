import { auth } from "@/auth";
import { getValidAccessTokenByEmail } from "@/lib/auth/token-manager";
import { getUserID } from "@/lib/supabase/supabase";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ message_id: string }> }
) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return new Response("Unauthorized", { status: 401 });
  }
  const access_token = await getValidAccessTokenByEmail(email);
  const { message_id } = await params;
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message_id}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!res.ok) {
    return new Response("Failed to fetch email", { status: 500 });
  }

  const message = await res.json();
  return Response.json({ message });
}
