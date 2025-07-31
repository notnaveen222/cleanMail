import { decrypt, encrypt } from "@/lib/utils/crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { method, token } = await request.json();

    if (method == "enc") {
      const encrypted_token = encrypt(token);
      return NextResponse.json({ encrypted_token: encrypted_token });
    } else if (method == "dec") {
      const decrypted_token = decrypt(token);
      return NextResponse.json({ decrypted_token: decrypted_token });
    } else {
      return NextResponse.json({
        error: "Invalid crypto method used.",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Crypt server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
