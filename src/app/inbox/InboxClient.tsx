"use client";
import { useState } from "react";
import EmailDetail from "./components/EmailDetail";
import EmailListClient from "./components/EmailList/EmailListClient";

export default function InboxClient({ emails }: { emails: any }) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  return (
    <>
      <div className="w-full border-b px-3 py-2 border-b-shad-sidebar-border">
        <div className="flex items-end gap-x-2">
          <div className="text-2xl p-0">cleanMail</div>
          <div className="text-subtitle text-sm relative -top-[1.6px] ">
            Inbox
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-3 h-full">
        <EmailListClient emails={emails} />
        <EmailDetail />
      </div>
    </>
  );
}
