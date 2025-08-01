import { createServerClient } from "@supabase/ssr";
import EmailList from "./components/EmailList";
import { cookies } from "next/headers";
import Sidebar from "@/components/Inbox/Sidebar";

export default async function Inbox() {
  return (
    <div>
      <Sidebar />
    </div>
  );
}
