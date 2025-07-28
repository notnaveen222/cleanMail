import { AuthButton } from "@/components/AuthButtons";

export default function Home() {
  return (
    <div className="text-white">
      <div className="flex w-full px-10 py-3 justify-between">
        <div>cleanMail</div>
        <AuthButton />
      </div>
    </div>
  );
}
