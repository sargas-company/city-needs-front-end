"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { User, Briefcase, UserPlus, Video } from "lucide-react";

// Dummy data
const statsData = {
  categories: [
    { name: "Beauty", value: 320 },
    { name: "Food", value: 410 },
    { name: "Home Services", value: 190 },
    { name: "Auto Services", value: 260 },
    { name: "Pets", value: 260 },
    { name: "Farm", value: 260 },
  ],
  summary: [
    {
      label: "Users",
      value: 1234,
      icon: User,
    },
    {
      label: "Businesses",
      value: 2344,
      icon: Briefcase,
    },
    {
      label: "New Users",
      value: 248,
      icon: UserPlus,
    },
    {
      label: "Reels",
      value: 1122,
      icon: Video,
    },
  ],
};

const maxCategoryValue = Math.max(...statsData.categories.map((c) => c.value));

export default function StatsPage() {
  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Statistics</h1>
          <p className="text-sm text-gray-500">Key platform metrics</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Businesses by category */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Businesses by category
            </h2>

            <div className="space-y-5">
              {statsData.categories.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">{category.name}</span>
                    <span className="text-blue-900 font-medium">
                      {category.value}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{
                        width: `${(category.value / maxCategoryValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right summary cards */}
          <div className="flex flex-col gap-6">
            {statsData.summary.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-900" />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {item.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
