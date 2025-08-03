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

export async function getUserEmails(userId: string) {
  const { data, error } = await supabase
    .from("user-mails")
    .select("message_id, summary, category, created_at, is_read")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching emails:", error);
    return [];
  }

  return data;
}

export async function getEmailCounts(email: string) {
  const userId = getUserID(email);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data: allEmails } = await supabase
    .from("user-mails")
    .select("category, created_at")
    .eq("user_id", userId);

  const total = allEmails?.length ?? 0;

  const categoryMap: Record<string, number> = {};
  let todayCount = 0;

  for (const email of allEmails || []) {
    categoryMap[email.category] = (categoryMap[email.category] || 0) + 1;
    if (new Date(email.created_at) >= new Date(todayISO)) {
      todayCount++;
    }
  }

  return {
    total,
    today: todayCount,
    byCategory: categoryMap,
  };
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

export async function getUserCategories(email: string): Promise<string[]> {
  const userID = await getUserID(email);
  try {
    const { data, error } = await supabase
      .from("user-categories")
      .select("name")
      .eq("user_id", userID);
    if (error) {
      console.error("Supabase Error:", error.message);
      return [];
    }

    return data?.map((item) => item.name) || [];
  } catch (err) {
    console.error("Unexpected Error Fetching User Categories:", err);
    return [];
  }
}
