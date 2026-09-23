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

const chartData = [
  { month: "January", desktop: 120, mobile: 80 },
  { month: "February", desktop: 250, mobile: 140 },
  { month: "March", desktop: 180, mobile: 110 },
  { month: "April", desktop: 90, mobile: 70 },
  { month: "May", desktop: 310, mobile: 190 },
  { month: "June", desktop: 240, mobile: 150 },
];

const Dashboard = () => {
  const [totalViews, setTotalViews] = useState(2845);
  const [hasViewedThisMonth, setHasViewedThisMonth] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const currentYearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

    const storedViewToken = localStorage.getItem("site_last_viewed_month");

    if (storedViewToken !== currentYearMonth) {
      setTotalViews((prev) => prev + 1);
      localStorage.setItem("site_last_viewed_month", currentYearMonth);
      setHasViewedThisMonth(true);
    } else {
      setHasViewedThisMonth(true);
    }
  }, []);

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
            value: totalViews.toLocaleString(),
            sub: hasViewedThisMonth
              ? "Counted for this month ✓"
              : "Updating...",
          },
        ].map((card, i) => (
          <div key={i} className="rounded-xl card bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <h3 className="mt-2 text-2xl font-bold">{card.value}</h3>
            <p
              className={`mt-1 text-sm ${card.muted ? "text-muted-foreground" : "text-green-700"}`}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Full-Width Overview Chart */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Traffic Overview</h2>
            <p className="text-sm text-muted-foreground">
              Desktop vs Mobile unique views (1 view per user / month limit)
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-green-700" />
              <span className="text-muted-foreground">Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-green-500" />
              <span className="text-muted-foreground">Orders</span>
            </div>
          </div>
        </div>

        {/* Full Width Container with explicit height */}
        <div className="h-80 w-full">
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
                dataKey="desktop"
                fill="#15803d" // green-700
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="mobile"
                fill="#22c55d" // green-500
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
