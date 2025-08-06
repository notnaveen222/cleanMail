import { GptSummarizer } from "@/lib/ai/summarizer";
import { getValidAccessToken } from "@/lib/auth/token-manager";
import { extractBody } from "@/lib/gmail/extractBody";
import { fetchMessage } from "@/lib/gmail/fetchMessage";
import { supabase } from "@/lib/supabase";
import { getUserCategories } from "@/lib/supabase/supabase";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Processing limits
const MAX_MESSAGES_PER_BATCH = 5; // Limit concurrent processing
const PROCESSING_DELAY = 200; // Delay between processing messages

// Wait function
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = body.message;
  const { emailAddress: email, historyId: newHistoryId } = JSON.parse(
    Buffer.from(message.data, "base64").toString("utf-8")
  );
  console.log("Gmail Recieved\n");

  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, access_token, refresh_token, token_expiresAt, last_historyId"
      )
      .eq("email", email)
      .single();

    if (!data) {
      console.log("No user data found with the given mail from pub/sup");
      return NextResponse.json({
        message: "No user data found with the given mail from pub/sup",
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

    // Limit the number of messages processed in one batch
    const messageIdsArray = Array.from(newMessageIds).slice(
      0,
      MAX_MESSAGES_PER_BATCH
    );
    console.log(
      `Processing ${messageIdsArray.length} messages out of ${newMessageIds.size} total`
    );

    // Process messages sequentially to avoid overwhelming the API
    for (let i = 0; i < messageIdsArray.length; i++) {
      const messageId = messageIdsArray[i];

      try {
        console.log(
          `Processing message ${i + 1}/${messageIdsArray.length}: ${messageId}`
        );

        const message = await fetchMessage(messageId, access_token);
        if (!message.labelIds?.includes("INBOX")) {
          console.log(`Message ${messageId} not in inbox, skipping`);
          continue;
        }

        const extracted_body = extractBody(message);

        //remove this check
        // Skip if body is too short or empty
        if (!extracted_body || extracted_body.trim().length < 10) {
          console.log(
            `Message ${messageId} has insufficient content, skipping`
          );
          continue;
        }

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
            } else {
              console.log(`Successfully processed message ${messageId}`);
            }
          } catch (insertErr) {
            console.error("Insert failed:", insertErr);
          }
        } catch (error) {
          console.error(`Error processing message ${messageId}:`, error);
          // Continue processing other messages even if one fails
        }

        // Add delay between processing messages to avoid rate limits
        if (i < messageIdsArray.length - 1) {
          await wait(PROCESSING_DELAY);
        }
      } catch (error) {
        console.error(`Error fetching message ${messageId}:`, error);
        // Continue with next message
      }
    }

    //If Success Update history Id
    const latestHistoryId = historyData.history.at(-1)?.id ?? newHistoryId;
    try {
      if (newMessageIds.size > 0) {
        const { error: updateHistoryIdError } = await supabase
          .from("users")
          .update({ last_historyId: latestHistoryId })
          .eq("email", email);

        if (updateHistoryIdError) {
          console.error(
            "Failed to update last_historyId:",
            updateHistoryIdError
          );
        }
      }
    } catch (error) {
      console.log("Error in Updating history Id", error);
    }

    return new Response("OK");
  } catch (error) {
    console.error("Push handler error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  console.log("GET Route");
  return new Response("OK");
}
