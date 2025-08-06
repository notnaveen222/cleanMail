"use client";
import { createContext, useContext, useState } from "react";

type InboxContextType = {
  selectedCategory: string | null;
  setSelectedCategory: (val: string | null) => void;
  selectedEmail: string | null;
  setSelectedEmail: (val: string | null) => void;
};
export const InboxContext = createContext<InboxContextType | null>(null);

export const InboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  return (
    <InboxContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedEmail,
        setSelectedEmail,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
};

export const useInbox = () => {
  const context = useContext(InboxContext);
  if (!context) throw new Error("useInbox must be used within InboxProvider");
  return context;
};
