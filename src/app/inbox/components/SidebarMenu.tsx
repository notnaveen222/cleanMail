"use client";
import { useEmailDashboard } from "@/hooks/useEmailDashboard";
import { MailIcon } from "../../../components/icons";

export default function SidebarMenu({}) {
  const { totalCount } = useEmailDashboard();
  return (
    <div className="flex justify-between items-center cursor-pointer hover:bg-shad-gray-bg/10 py-1.5 px-2 mb-5 transition-all duration-300 ease-in-out rounded-lg">
      <div className="flex gap-x-2">
        <MailIcon />
        <span className="">All Emails</span>
      </div>
      <div className="bg-brand-blue text-sm font-semibold rounded-md  px-1.5 ">
        {totalCount}
      </div>
    </div>
  );
}
