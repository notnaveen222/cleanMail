import EmailDetail from "./components/EmailDetail";
import EmailList from "./components/EmailList";

export default async function Inbox() {
  return (
    <div className="text-white h-full flex flex-col">
      <div className="w-full border-b px-3 py-2 border-b-shad-sidebar-border">
        <div className="flex items-end gap-x-2">
          <div className="text-2xl p-0">cleanMail</div>
          <div className="text-subtitle text-sm relative -top-[1.6px] ">
            Inbox
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-3 h-full">
        <EmailList />
        <EmailDetail />
      </div>
    </div>
  );
}
