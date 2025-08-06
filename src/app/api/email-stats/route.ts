import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { getUserID } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  console.log(session.user.userId);
  const userId = session.user.userId;
  if (!userId) {
    return NextResponse.json(
      { message: "User not found in database" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase.rpc("get_email_dashboard", {
    uid: userId,
  });

  if (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Error fetching stats", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
