import { auth } from "@/auth";
import Sidebar from "@/app/inbox/components/Sidebar";
import { getEmailCounts, getUserByMail } from "@/lib/supabase/supabase";

export default async function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user?.email
    ? await getUserByMail(session.user.email)
    : "";
  const emailCounts = session?.user?.email
    ? await getEmailCounts(session?.user?.email)
    : null;
  if (user) {
    return (
      <div className="flex w-full ">
        <Sidebar user={user} emailCounts={emailCounts} />
        <div className="grow">{children}</div>
      </div>
    );
  }
  //If not user handle, tho middleware does it
}
