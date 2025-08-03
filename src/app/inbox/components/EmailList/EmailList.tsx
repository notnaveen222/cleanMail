import { auth } from "@/auth";
import { getUserID, getUserEmails } from "@/lib/supabase/supabase";
import EmailListClient from "./EmailListClient";

export default async function EmailList() {
  const session = await auth();
  if (!session?.user?.email) return <div>Login to view emails</div>;

  const userId = await getUserID(session.user.email);
  const emails = await getUserEmails(userId);

  return <EmailListClient emails={emails} />;
}
