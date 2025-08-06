"use client";

import { useRef, useState } from "react";

export default function AddCategory({
  onAdd,
}: {
  onAdd: (name: string) => void;
}) {
  const [newCategory, setNewCategory] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleAddCategory = async () => {
    if (newCategory == "") {
      inputRef.current?.focus();
      return;
    }
    await onAdd(newCategory.trim());
    setNewCategory("");
  };
  return (
    <div className="flex justify-between px-1 pl-2">
      <input
        className="border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none  w-[80%] placeholder:text-subtitle-gray text-white"
        placeholder="Categories"
        maxLength={15}
        ref={inputRef}
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button
        className="text-base h-fit cursor-pointer hover:bg-shad-gray-bg/10 px-1 transition-all duration-300 ease-in-out rounded-sm"
        onClick={handleAddCategory}
      >
        +
      </button>
    </div>
  );
}
