import { GptSummarizer } from "@/lib/ai/summarizer";
import { getValidAccessToken } from "@/lib/auth/token-manager";
import { extractBody } from "@/lib/gmail/extractBody";
import { fetchMessage } from "@/lib/gmail/fetchMessage";
import { supabase } from "@/lib/supabase";
import { getUserCategories } from "@/lib/supabase/supabase";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = body.message;
  const { emailAddress: email, historyId: newHistoryId } = JSON.parse(
    Buffer.from(message.data, "base64").toString("utf-8")
  );
  console.log("Gmail Pushed\n");
  const { data, error } = await supabase
    .from("users")
    .select("id, access_token, refresh_token, token_expiresAt, last_historyId")
    .eq("email", email)
    .single();

  if (!data) {
    console.log("No user data found with the given mail");
    return NextResponse.json({
      message: "No user data found with the given mail",
    });
  }
  //expired token handling
  const access_token = await getValidAccessToken({ ...data, email });
  if (!access_token) {
    console.log("Could not get valid access token");
    return new Response("Unauthorized", { status: 401 });
  }
  const last_historyId = data?.last_historyId;
  const historyResponse = await axios.get(
    `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${last_historyId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const historyData = historyResponse.data;

  const newMessageIds = new Set<string>();
  if (!historyData.history) {
    console.log("No new messages found.");
    return new Response("No new messages", { status: 200 });
  }
  for (const h of historyData.history) {
    if (h.messagesAdded) {
      for (const m of h.messagesAdded) {
        newMessageIds.add(m.message.id);
      }
    }
  }
  for (const messageId of newMessageIds) {
    try {
      const message = await fetchMessage(messageId, access_token);
      if (!message.labelIds?.includes("INBOX")) continue;
      const extracted_body = extractBody(message);
      //summarize and store in db
      const userCategories = await getUserCategories(email);
      try {
        const { summary, category } = await GptSummarizer({
          emailBody: extracted_body,
          categories: userCategories,
        });
        if (!summary?.trim()) {
          console.warn(
            `Empty summary for message ${messageId}, skipping insert`
          );
          continue;
        }
        const emailPayload = {
          user_id: data.id,
          message_id: messageId,
          summary: summary,
          category: category,
          is_read: false,
        };
        try {
          const { error } = await supabase
            .from("user-mails")
            .insert(emailPayload);

          if (error) {
            console.log(
              "Supabase error when storing the summarized text:",
              error.message
            );
          }
        } catch (insertErr) {
          console.error("Insert failed:", insertErr);
        }
      } catch (error) {
        console.error(`Error processing message ${messageId}:`, error);
      }
    } catch (error) {
      console.error("GPT API Error summarizing the email", error);
    }
  }
  //If Success Update histroy Id. Yet to impl, summarizer
  const latestHistoryId = historyData.history.at(-1)?.id ?? newHistoryId;
  try {
    if (newMessageIds.size > 0) {
      const { error: updateHistoryIdError } = await supabase
        .from("users")
        .update({ last_historyId: latestHistoryId })
        .eq("email", email);

      if (updateHistoryIdError) {
        console.error("Failed to update last_historyId:", updateHistoryIdError);
      }
    }
  } catch (error) {
    console.log("Error in Updating history Id", error);
  }
  return new Response("OK"); //sample respose, ig goes to google, check if needed
}

export async function GET() {
  console.log("GET Route");
  return new Response("OK");
}
