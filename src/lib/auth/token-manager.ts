import axios from "axios";
import { supabase } from "../supabase";

export function isTokenExpired(expiresAt: number): boolean {
  if (!expiresAt) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= expiresAt;
}

export async function refreshAccessToken(refresh_token: string) {
  if (!refresh_token) {
    throw new Error("Refresh token is required but not provided");
  }

  try {
    const res = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return {
      access_token: res.data.access_token,
      expires_in: res.data.expires_in,
      refresh_token: res.data.refresh_token ?? null,
    };
  } catch (error: any) {
    console.error(
      "Failed to refresh access token:",
      error.response?.data || error.message
    );
    throw new Error(
      `Token refresh failed: ${error.response?.data?.error || error.message}`
    );
  }
}

export async function updateTokenInSupabase(
  email: string,
  refreshed_token: {
    access_token: string;
    expires_in: number;
    refresh_token: string | null;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from("users")
    .update({
      access_token: refreshed_token.access_token,
      token_expiresAt:
        Math.floor(Date.now() / 1000) + (refreshed_token.expires_in ?? 3600),
      ...(refreshed_token.refresh_token && {
        refresh_token: refreshed_token.refresh_token,
      }),
    })
    .eq("email", email);
  if (error) {
    console.error("Error updating token in Supabase:", error.message);
    return false;
  }

  return true;
}

export async function getValidAccessToken({
  access_token,
  refresh_token,
  token_expiresAt,
  last_historyId,
  email,
}: {
  access_token: string;
  refresh_token: string;
  token_expiresAt: number;
  last_historyId: string;
  email: string;
}): Promise<string | null> {
  if (!isTokenExpired(token_expiresAt)) {
    return access_token;
  }

  // Validate refresh token exists
  if (!refresh_token) {
    console.error("No refresh token available for user:", email);
    return null;
  }

  try {
    const refreshed_token = await refreshAccessToken(refresh_token);
    const updateToken = await updateTokenInSupabase(email, refreshed_token);
    if (!updateToken) return null;
    return refreshed_token.access_token;
  } catch (error) {
    console.error("Failed to refresh token for user:", email, error);
    return null;
  }
}
