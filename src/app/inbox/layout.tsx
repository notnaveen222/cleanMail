import { auth } from "@/auth";
import Sidebar from "@/app/inbox/components/Sidebar";
import { getUserByMail } from "@/lib/supabase/supabase";

export default async function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user?.email
    ? await getUserByMail(session.user.email)
    : "";
  if (user) {
    return (
      <div className="flex w-full ">
        <Sidebar user={user} />
        <div className="grow">{children}</div>
      </div>
    );
  }
  //If not user handle, tho middleware does it
}
