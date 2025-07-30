import { auth } from "@/auth";
import { updateHistoryId } from "@/lib/supabase/supabase";
import axios from "axios";
import { NextResponse } from "next/server";

// useless route, implemented in handleUserLogin, so remove whole file and remove setWatchTriggerButton asw

export async function POST() {
  const session = await auth();
  if (!session || !session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const access_token = session.accessToken;
  try {
    const res = await axios.post(
      "https://gmail.googleapis.com/gmail/v1/users/me/watch",
      {
        labelIds: ["INBOX"],
        topicName: "projects/cleanmail-467115/topics/gmail-mail-received",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = res.data;
    const userMail = session.user?.email;
    if (!userMail) {
      return NextResponse.json(
        { error: "Email not found in session" },
        { status: 400 }
      );
    }
    const historyId = data.historyId;
    await updateHistoryId({ email: userMail, historyId });
    return NextResponse.json({ message: "Successfully set watch", data: data });
  } catch (error: any) {
    console.log("Error setting watch");
    return NextResponse.json(
      {
        error: "Failed to set up Gmail watch",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
