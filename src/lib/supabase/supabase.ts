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
