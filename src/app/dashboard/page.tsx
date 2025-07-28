import { LogOutButton } from "@/components/AuthButtons";
import { auth } from "@/auth";
export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="h-screen text-center text-white flex-col  w-screen flex justify-center items-center">
      <div>UserName:{session?.user?.name}</div>
      <LogOutButton />
    </div>
  );

  return <div className="text-center">You are not logged in.</div>;
}
