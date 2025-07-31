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

const testEmailBody =
  "Chennai Career Development Centre via CSE (Spl. in Cyber Physical Systems) 2023 Group, Chennai Campus ccbps23@vitstudent.ac.in sent an email on Wed, Jul 30, 6:00 PM to multiple recipients (ccbc23 groups, VITCC, PAT) reminding VITians to join an exclusive online webinar on 30th July 2025 at 7:00 PM to get expert insights on cracking the GRE confidently, covering GRE structure, preparation strategies, resources, time management, live Q&A, and success stories, hosted by T.I.M.E. with expert faculty, comprehensive materials, mock tests, and personalized feedback; register at www.t4e.info/VITGRE";

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
  const handleGPTTest = async () => {
    const response = await axios.post("http://localhost:3000/api/ai-actions", {
      emailBody: testEmailBody,
    });
  };
  return (
    <div className="h-screen text-center text-white flex-col  w-screen flex justify-center items-center">
      {isLoading ? (
        <div>Loading...</div>
      ) : userDetails ? (
        <div className="text-white">UserName: {userDetails.name}</div>
      ) : (
        <div>Failed to load user</div>
      )}
      <button onClick={() => handleGPTTest()}>Trigger Gpt</button>
      <LogOutButton />
      <SetWatchButton />
    </div>
  );
}
