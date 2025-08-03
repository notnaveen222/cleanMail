import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export type Email = {
  message_id: string;
  summary: string;
  category: string;
  created_at: string;
  is_read: boolean;
};

export default function useEmail(userId: string) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user-mails")
        .select("message_id, summary, category, created_at,is_read")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        setError(error);
      } else {
        setEmails(data as Email[]);
      }

      setIsLoading(false);
    };
    fetchEmails();
  }, [userId]);

  return { emails, isLoading, error };
}
