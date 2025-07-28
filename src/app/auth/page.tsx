import { LogInButton } from "@/components/AuthButtons";

export default function AuthPage() {
  return (
    <div className="text-white h-screen flex justify-center items-center">
      <div className="bg-dark-gray rounded-lg text-white px-3  py-5">
        <div className="text-center mb-5">Authorization</div>
        <LogInButton />
      </div>
    </div>
  );
}
