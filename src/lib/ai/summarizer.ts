"use server";
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function GptSummarizer({ emailBody }: { emailBody: string }) {
  const response = await client.chat.completions.create({
    model: "gpt-4o", // or gpt-4o-mini
    messages: [
      {
        role: "system",
        content:
          "You are an expert email summarizer. Your job is to extract the key point of an email and rewrite it as a single short sentence.",
      },
      {
        role: "user",
        content: `Summarize the following email in one line, keeping it as short and clear as possible while preserving the most important information.\n\nEmail:\n${emailBody}`,
      },
    ],
    temperature: 0.3,
  });
  return response.choices[0].message.content;
}
