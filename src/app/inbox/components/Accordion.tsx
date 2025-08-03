"use client";
import { ArrowTrendingUp, ChevronDown } from "@/components/icons";
import { useState } from "react";

export default function Accordion() {
  const [expanded, setExpanded] = useState<boolean>(true);
  return (
    <div>
      <div className="flex justify-between transition-all duration-300 ease-in-out">
        <div className={`flex items-center gap-x-2 `}>
          <span className="">
            <ArrowTrendingUp />
          </span>
          <div>Today's Update</div>
        </div>
        <div
          className={`cursor-pointer ${
            expanded ? "rotate-x-180" : "rotate-x-0"
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown />
        </div>
      </div>
      <div
        className={`pl-8 mb-1 text-white/60 overflow-hidden ${
          expanded ? "max-h-40 opacity-100  mt-3" : "max-h-0 opacity-0 mt-0"
        } transition-all duration-300 ease-in-out`}
      >
        47 new emails
        <br />2 Unread - 4 Read
      </div>
    </div>
  );
}
