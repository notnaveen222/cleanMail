"use client";
export default function SetWatchButton() {
  return (
    <button
      onClick={async () => {
        const res = await fetch("/api/set-watch", {
          method: "POST",
        });
      }}
      className="gray-white-border rounded-lg px-2 py-1 mt-5 cursor-pointer"
    >
      Set Watch
    </button>
  );
}
