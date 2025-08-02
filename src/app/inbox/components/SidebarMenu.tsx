import { MailIcon } from "../../../components/icons";

export default function SidebarMenu({}) {
  return (
    <div className="flex justify-between items-center cursor-pointer hover:bg-shad-gray-bg/10 py-1.5 px-2 mb-5 transition-all duration-300 ease-in-out rounded-lg">
      <div className="flex gap-x-2">
        <MailIcon />
        <span className="">All Emails</span>
      </div>
      <div className="bg-shad-gray-bg/20 text-[13px] rounded-md  px-1.5 ">
        10
      </div>
    </div>
  );
}
