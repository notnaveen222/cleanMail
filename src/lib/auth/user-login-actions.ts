import { Account, Profile } from "next-auth";
import { supabase } from "../supabase";
import axios from "axios";
import { updateHistoryId } from "../supabase/supabase";

export async function handleUserLogin({
  account,
  profile,
}: {
  account: Account;
  profile: Profile | undefined;
}) {
  if (!profile?.email) {
    console.error("Missing user email in profile.");
    return;
  }

  const access_token = account.access_token;
  const email = profile.email;
  if (!access_token) {
    console.error("Missing Access Token");
    return;
  }
  //do encrypting for refresh Token

  const userpayload = {
    name: profile.name,
    email: profile.email,
    avatar_url: profile.picture,
    google_id: profile.sub,
    last_historyId: "init",
    ...(account.refresh_token && { refresh_token: account.refresh_token }),
    access_token: access_token,
    token_expiresAt:
      Math.floor(Date.now() / 1000) + (account.expires_in ?? 3600),
  };

  //User Details
  try {
    const { error } = await supabase
      .from("users")
      .upsert([userpayload], { onConflict: "email" });

    if (error) {
      console.error("Supabase upsert error:", error.message);
    }
  } catch (err) {
    console.error("Error during Supabase upsert:", err);
  }

  //Hitting Gmail Watch API, if only firstTime
  const { data: existingUserData } = await supabase
    .from("users")
    .select("email,last_historyId")
    .eq("email", email)
    .single();
  if (existingUserData?.last_historyId != "init") {
    console.log("Watch Already Set, Returning");
    return;
  }
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

    const historyId = res.data.historyId;

    await updateHistoryId({ email, historyId });
    console.log("History ID updated");
  } catch (error: any) {
    console.error(
      "Error setting up Gmail Watch API:",
      error.response?.data || error.message
    );
  }
}
