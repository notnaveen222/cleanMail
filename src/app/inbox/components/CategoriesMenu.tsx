"use client";
import { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEmailDashboard } from "@/hooks/useEmailDashboard";
import { useInbox } from "@/context/InboxContext";
import { MailIcon } from "@/components/icons";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { categoryCounts, totalCount } = useEmailDashboard();
  const { setSelectedCategory } = useInbox();
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories"); // you'll need to build this
      setCategories(res.data.categories);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleAddCategory = async (name: string) => {
    try {
      const res = await axios.post("/api/categories/add", { name });
      if (res.status === 200) {
        fetchCategories();
      }
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="px-2 mb-7">
          <Skeleton className="h-6" baseColor="#202020" highlightColor="#444" />
        </div>
      ) : (
        <div>
          <div
            className="flex justify-between items-center cursor-pointer hover:bg-shad-gray-bg/10 py-1.5 px-2 mb-5 transition-all duration-300 ease-in-out rounded-lg"
            onClick={() => setSelectedCategory(null)}
          >
            <div className="flex gap-x-2">
              <MailIcon />
              <span className="">All Emails</span>
            </div>
            <div className="bg-brand-blue text-sm font-semibold rounded-md  px-1.5 ">
              {totalCount}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-3 justify-between text-subtitle-gray text-sm">
        <AddCategory onAdd={handleAddCategory} />
        <div className="flex flex-col">
          {isLoading ? (
            <div className="px-2 flex flex-col gap-y-2">
              <Skeleton
                className="h-6"
                baseColor="#202020"
                highlightColor="#444"
              />
              <Skeleton
                className="h-6"
                baseColor="#202020"
                highlightColor="#444"
              />
            </div>
          ) : categories.length != 0 ? (
            <div>
              {categories.map((cat, index) => (
                <div
                  className="text-white flex justify-between items-center cursor-pointer hover:bg-shad-gray-bg/10 py-1.5 px-2 mb-0.5 transition-all duration-300 ease-in-out rounded-lg"
                  key={index}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                  }}
                >
                  <div className="">{cat.name}</div>
                  <div className="flex gap-x-1">
                    <div className="bg-brand-blue font-semibold text-sm rounded-md px-1.5">
                      {categoryCounts.find((c) => c.category === cat.name)
                        ?.count ?? 0}
                    </div>
                  </div>
                </div>
              ))}

              {/* Move this outside the loop */}
              <div
                className="text-white flex justify-between items-center cursor-pointer hover:bg-shad-gray-bg/10 py-1.5 px-2 mb-0.5 transition-all duration-300 ease-in-out rounded-lg"
                onClick={() => setSelectedCategory("Uncategorized")}
              >
                <div>Others</div>
                <div className="bg-brand-blue font-semibold text-sm rounded-md px-1.5">
                  {categoryCounts.find((c) => c.category === null)?.count ?? 0}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm">No Categories.</div>
          )}
        </div>
      </div>
    </div>
  );
}
