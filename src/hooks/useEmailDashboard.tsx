import { useEffect, useState } from "react";

type EmailStats = {
  total_count: number;
  read_count: number;
  unread_count: number;
  today_count: number;
  category_counts: { category: string; count: number }[];
};

export function useEmailDashboard() {
  const [data, setData] = useState<EmailStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/email-stats");
        if (!res.ok) throw new Error("Failed to fetch email dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    totalCount: data?.total_count ?? 0,
    readCount: data?.read_count ?? 0,
    unreadCount: data?.unread_count ?? 0,
    todayCount: data?.today_count ?? 0,
    categoryCounts: data?.category_counts ?? [],
    isLoading,
    error,
  };
}
