"use server";
import "dotenv/config";
import OpenAI from "openai";
import { gptRateLimiter, retryWithBackoff } from "@/lib/utils/rate-limiter";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function GptSummarizer({
  emailBody,
  categories,
}: {
  emailBody: string;
  categories: string[];
}) {
  return retryWithBackoff(async () => {
    // Wait for rate limiter before making request
    await gptRateLimiter.waitForNextRequest();
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You're an AI that reads emails and returns a JSON with: 1) a short one-line summary-keep it as short and clear as possible while preserving the most important info, and 2) a matching category from the list or null.",
        },
        {
          role: "user",
          content: `Read this email and return:

{
  "summary": "<1-line summary>",
  "category": "<best match from [${categories.join(", ")}] or null>"
}

Email:
${emailBody}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200, // Limit token usage
    });

    const rawResponse = response.choices[0].message.content ?? "";
    const cleanedResponse = rawResponse
      .trim()
      .replace(/^```json\s*|\s*```$/g, "");
    let parsed: { summary: string; category: string | null } = {
      summary: "",
      category: null,
    };

    try {
      if (cleanedResponse) {
        parsed = JSON.parse(cleanedResponse);
      } else {
        console.error("No Response Content from GPT API");
        parsed = { summary: "", category: null };
      }
    } catch (err) {
      console.error("Failed to parse GPT response as JSON:", cleanedResponse);
    }
    return parsed;
  }, 3, 1000); // 3 retries, 1 second base delay
}
