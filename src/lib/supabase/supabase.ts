import { supabase } from "../supabase";

export async function updateHistoryId({
  email,
  historyId,
}: {
  email: string;
  historyId: string;
}) {
  const { error } = await supabase
    .from("users")
    .update({ last_historyId: historyId })
    .eq("email", email);
  if (error) {
    throw new Error("Failed to update history ID: " + error.message);
  }
}

export async function getUserByMail(email: string) {
  const { data } = await supabase
    .from("users")
    .select("name,avatar_url,email")
    .eq("email", email)
    .single();
  return data;
}

export async function getUserID(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
  if (error || !data) {
    console.error("Error fetching user ID:", error?.message);
    return null;
  }

  return data.id;
}

export async function getUserCategoryDetails(email: string) {
  const userID = getUserID(email);
}
