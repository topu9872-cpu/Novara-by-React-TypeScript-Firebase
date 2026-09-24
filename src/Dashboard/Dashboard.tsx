"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getLastSixMonths,
  getMonthlyUniqueViews,
  getMonthKey,
  trackUniqueView,
} from "../services/AdminDashboard";

type ChartData = {
  month: string;
  views: number;
};

const Dashboard = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [previousMonthViews, setPreviousMonthViews] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // Track current visitor
        await trackUniqueView();

        const months = getLastSixMonths();

        // Get real Firebase data for every month
        const monthlyData = await Promise.all(
          months.map(async (month) => {
            const views = await getMonthlyUniqueViews(month.key);

            return {
              month: month.name,
              views,
            };
          }),
        );

        setChartData(monthlyData);

        // Current month
        const currentMonth = getMonthKey();

        const currentViews = await getMonthlyUniqueViews(currentMonth);

        setTotalViews(currentViews);

        // Previous month
        const previousDate = new Date();

        previousDate.setMonth(previousDate.getMonth() - 1);

        const previousMonth = getMonthKey(previousDate);

        const previousViews = await getMonthlyUniqueViews(previousMonth);

        setPreviousMonthViews(previousViews);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Calculate percentage change
  const monthlyPercentage =
    previousMonthViews === 0
      ? totalViews > 0
        ? 100
        : 0
      : Math.round(
          ((totalViews - previousMonthViews) / previousMonthViews) * 100,
        );

  const percentageText =
    monthlyPercentage > 0
      ? `+${monthlyPercentage}% from last month`
      : monthlyPercentage < 0
        ? `${monthlyPercentage}% from last month`
        : "No change from last month";

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: "$24,560",
            sub: "+12.5% from last month",
          },
          {
            title: "Total Orders",
            value: "1,248",
            sub: "+8.2% from last month",
          },
          {
            title: "Total Products",
            value: "356",
            sub: "24 out of stock",
            muted: true,
          },
          {
            title: "Monthly Unique Views",
            value: loading ? "..." : totalViews.toLocaleString(),
            sub: loading ? "Loading..." : percentageText,
          },
        ].map((card, i) => (
          <div key={i} className="rounded-xl card bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{card.title}</p>

            <h3 className="mt-2 text-2xl font-bold">{card.value}</h3>

            <p
              className={`mt-1 text-sm ${
                card.muted ? "text-muted-foreground" : "text-green-700"
              }`}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Traffic Overview */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Traffic Overview</h2>

            <p className="text-sm text-muted-foreground">
              Monthly unique visitors
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-sm bg-green-700" />

            <span className="text-muted-foreground">Unique Views</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading traffic data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />

                <Tooltip />

                <Bar
                  dataKey="views"
                  name="Unique Views"
                  fill="#15803d"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
