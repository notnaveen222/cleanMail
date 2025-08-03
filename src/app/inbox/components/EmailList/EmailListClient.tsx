"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useEmailDashboard } from "@/hooks/useEmailDashboard";
import Accordion from "../Accordion";
import { SeenIcon2 } from "@/components/icons";

type Email = {
  message_id: string;
  summary: string;
  category: string;
  created_at: string;
  is_read: boolean;
};

export default function EmailList({ emails }: { emails: Email[] }) {
  const { todayCount, readCount, unreadCount, isLoading, error } =
    useEmailDashboard();

  return (
    <div className="col-span-1 border-r border-r-shad-sidebar-border">
      <div className="border-b border-b-shad-sidebar-border px-3 py-2">
        <Accordion />
      </div>

      {/* Stats Section */}

      {/* Email List */}
      <div className="px-3 py-2">
        {emails.map((email) => (
          <div
            key={email.message_id}
            className="hover:bg-shad-gray-bg/10 py-1 px-2 transition-all duration-300 ease-in-out rounded-lg cursor-pointer"
          >
            <div className="mb-1">
              {email.category != null ? (
                <span className="inline mr-2 text-sm border-brand-blue bg-brand-blue/40 leading-8 text-white border rounded-xl w-fit h-fit px-2">
                  {email.category}
                </span>
              ) : (
                <span
                  className={`inline mr-2 text-sm border-subtitle bg-shad-sidebar-border/40 leading-8 border rounded-xl w-fit h-fit px-2 ${
                    email.is_read ? "text-white/50" : "text-white"
                  }`}
                >
                  Uncategorized
                </span>
              )}

              {email.summary}

              <div className="text-right w-full flex justify-end gap-x-2 items-center mt-1">
                <div className="hover:text-white text-white/50 transition-all duration-200 ease-in-out">
                  <SeenIcon2 />
                </div>
                <div className="text-sm text-subtitle">
                  {dayjs(email.created_at).format("DD MMM YYYY, hh:mm A")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
