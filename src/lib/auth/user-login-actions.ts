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
  let userId;
  if (!profile?.email) {
    console.error("Missing user email in profile.");
    return;
  }
  const email = profile.email;
  //decrypt and store access & refresh token
  const access_token = account.access_token;
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, last_historyId")
    .eq("email", email)
    .maybeSingle();
  const userpayload = {
    name: profile.name,
    email: profile.email,
    avatar_url: profile.picture,
    google_id: profile.sub,
    last_historyId: existingUser ? existingUser.last_historyId : "init",
    refresh_token: account.refresh_token,
    access_token: access_token,
    token_expiresAt:
      Math.floor(Date.now() / 1000) + (account.expires_in ?? 3600),
  };

  //Storing User Details
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert([userpayload], { onConflict: "email" })
      .select("id")
      .single();
    userId = data?.id;
    if (error) {
      console.error("Supabase upsert error:", error.message);
    }
  } catch (err) {
    console.error("Error during Supabase upsert:", err);
  }

  if (!existingUser) {
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
  return userId;
}
