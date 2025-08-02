import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { getUserID } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserID(session.user.email);
  const { data, error } = await supabase
    .from("user-categories")
    .select("id,name")
    .eq("user_id", userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data }, { status: 200 });
}
