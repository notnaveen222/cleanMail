import { GptSummarizer } from "@/lib/ai/summarizer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const emailBody = body.emailBody;
  const summarizedText = await GptSummarizer({ emailBody });
  console.log(summarizedText);
  return NextResponse.json({ message: "OK" });
}
