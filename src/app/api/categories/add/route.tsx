import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { getUserByMail, getUserID } from "@/lib/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const categoryName = body.name;
    if (!session?.user?.email) {
      return NextResponse.json({ message: "unauthorzied" });
    }
    const userId = await getUserID(session?.user?.email);
    const categoryPayload = {
      user_id: userId,
      name: categoryName,
    };
    const { error } = await supabase
      .from("user-categories")
      .insert(categoryPayload);
    if (error) {
      {
        console.error("Error adding category to supabase", error);
      }
    }
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error adding category", error);
  }
}
