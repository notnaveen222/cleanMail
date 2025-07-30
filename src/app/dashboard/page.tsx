"use client";
import { LogOutButton } from "@/components/AuthButtons";
import { auth } from "@/auth";
import SetWatchButton from "@/components/SetWatchTrigger";
import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  name: string;
  email: string;
  avatar_url: string;
};

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    async function fetchUserDate() {
      const response = await axios.get("/api/user");
      setUserDetails(response.data.data);
      setIsLoading(false);
    }
    fetchUserDate();
  }, []);
  return (
    <div className="h-screen text-center text-white flex-col  w-screen flex justify-center items-center">
      {isLoading ? (
        <div>Loading...</div>
      ) : userDetails ? (
        <div className="text-white">UserName: {userDetails.name}</div>
      ) : (
        <div>Failed to load user</div>
      )}

      <LogOutButton />
      <SetWatchButton />
    </div>
  );
}
