import { auth } from "@/auth";
import InboxClient from "./InboxClient";
import {
  getEmailCounts,
  getUserByMail,
  getUserEmails,
  getUserID,
} from "@/lib/supabase/supabase";
import Sidebar from "./components/Sidebar";
import { InboxProvider } from "@/context/InboxContext";

export default async function Inbox() {
  const session = await auth();
  if (!session?.user.email) return <div>Login </div>;
  const user = await getUserByMail(session.user.email);
  if (!user) return <div>User not found</div>;
  const userId = await getUserID(session.user.email);
  const emails = await getUserEmails(userId);
  return (
    <InboxProvider>
      <div className="text-white overflow-hidden h-screen w-full flex">
        <Sidebar user={user} />
        <div>
          <InboxClient emails={emails} />
        </div>
      </div>
    </InboxProvider>
  );
}
