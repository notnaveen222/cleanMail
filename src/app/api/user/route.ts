import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userMail = session?.user?.email;
  const userDetails = await supabase
    .from("users")
    .select("name,email,avatar_url")
    .eq("email", userMail)
    .single();

  return NextResponse.json(userDetails);
}
