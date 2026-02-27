"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/app/components/DashboardLayout";
import { User, Briefcase, UserPlus, Video } from "lucide-react";
import { fetchStatisticsSummary, type StatisticsSummary } from "@/lib/api";

export default function StatsPage() {
  const [statistics, setStatistics] = useState<StatisticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatistics() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchStatisticsSummary();
        setStatistics(data);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError("Failed to load statistics");
        toast.error("Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    }

    loadStatistics();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !statistics) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">
              {error || "Statistics not found"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const maxCategoryValue = Math.max(
    ...statistics.businessesByCategory.map((c) => c.count),
    1 // Prevent division by zero
  );

  const summaryItems = [
    {
      label: "Users",
      value: statistics.totals.users,
      icon: User,
    },
    {
      label: "Businesses",
      value: statistics.totals.businesses,
      icon: Briefcase,
    },
    {
      label: "New Users",
      value: statistics.totals.newUsers,
      icon: UserPlus,
    },
    {
      label: "Reels",
      value: statistics.totals.reels,
      icon: Video,
    },
  ];
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
              {statistics.businessesByCategory.length > 0 ? (
                statistics.businessesByCategory.map((category) => (
                  <div key={category.categoryId}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">{category.title}</span>
                      <span className="text-blue-900 font-medium">
                        {category.count}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{
                          width: `${(category.count / maxCategoryValue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No category data available
                </p>
              )}
            </div>
          </div>

          {/* Right summary cards */}
          <div className="flex flex-col gap-6">
            {summaryItems.map((item) => {
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
