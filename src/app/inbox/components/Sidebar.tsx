import { MailIcon } from "@/components/icons";
import { truncate } from "@/lib/utils/textTruncate";
import Image from "next/image";
import { HiDotsHorizontal } from "react-icons/hi";
import SidebarMenu from "./SidebarMenu";
import CategoriesMenu from "./CategoriesMenu";

interface User {
  name: string;
  email: string;
  avatar_url: string;
}

export default function Sidebar({ user }: { user: User }) {
  return (
    <div className="text-white border-r w-full overflow-hidden max-w-56 min-h-screen border-r-shad-sidebar-border">
      <div className="flex flex-col py-5 pb-7 px-3 gap-2 border-b border-b-shad-sidebar-border">
        <div className="pt-1.5 flex justify-between">
          <Image
            src={user.avatar_url}
            alt="user avatar"
            width={35}
            height={35}
            className="rounded-lg"
          ></Image>
          <div className="flex w-fit hover:bg-shad-gray-bg/10 rounded-lg transition-all duration-300 ease-in-out h-fit px-1">
            <HiDotsHorizontal className=" text-white self-start cursor-pointer text-2xl" />
          </div>
        </div>
        <div className="flex flex-col truncate">
          <div>{truncate({ text: user.name, length: 13 })}</div>
          <div className="text-subtitle text-sm">{user.email}</div>
        </div>
      </div>
      <div className="px-1 py-5">
        <SidebarMenu />
        <CategoriesMenu />
      </div>
    </div>
  );
}
