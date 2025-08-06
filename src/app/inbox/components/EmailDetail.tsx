"use client";

import { useInbox } from "@/context/InboxContext";

export default function EmailDetail() {
  const { selectedEmail } = useInbox();
  // const fetchEmailContent = async () => {
  //   setIsLoading(true);
  //   if (selectedMessageID == null) {
  //     return;
  //   }
  //   const res = await fetch(`/api/email/${selectedMessageID}`);
  //   const data = await res.json();
  //   setSelectedMailContent(data.message);
  //   setIsLoading(false);
  // };

  return (
    <div className="col-span-2 h-full w-full flex justify-center items-center">
      {selectedEmail ? selectedEmail : "Nothing Seleceted"}
    </div>
  );
}
