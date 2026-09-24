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
  getAllOrders,
  getMonthlyOrderCount,
} from "../services/AdminDashboard";

import { getProducts } from "../services/productService";
import type { Product } from "../types/Product";
import type { Order } from "../types/CustomarOrders";

type ChartData = {
  month: string;
  views: number;
};

const Dashboard = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [previousMonthViews, setPreviousMonthViews] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const [product, setproduct] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [orderPercentage, setOrderPercentage] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [products, orders] = await Promise.all([
          getProducts(),
          getAllOrders(),
        ]);

        setproduct(products);
        setOrders(orders);

        await trackUniqueView();

        // Orders percentage
        const now = new Date();

        const startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);

        const startNext = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const startPrevious = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );

        const [current, previous] = await Promise.all([
          getMonthlyOrderCount(startCurrent, startNext),
          getMonthlyOrderCount(startPrevious, startCurrent),
        ]);

        setOrderPercentage(
          previous === 0
            ? current > 0
              ? 100
              : 0
            : Math.round(((current - previous) / previous) * 100),
        );

        // Views
        const months = getLastSixMonths();

        const monthlyData = await Promise.all(
          months.map(async (month) => ({
            month: month.name,
            views: await getMonthlyUniqueViews(month.key),
          })),
        );

        setChartData(monthlyData);

        const currentMonth = getMonthKey();
        const currentViews = await getMonthlyUniqueViews(currentMonth);

        setTotalViews(currentViews);

        const previousDate = new Date();
        previousDate.setMonth(previousDate.getMonth() - 1);

        const previousMonth = getMonthKey(previousDate);

        const previousViews = await getMonthlyUniqueViews(previousMonth);

        setPreviousMonthViews(previousViews);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const outOfStock = product?.filter((item) => Number(item.stock) === 0).length ?? 0;

  const percentage =
    previousMonthViews === 0
      ? totalViews > 0
        ? 100
        : 0
      : Math.round(
          ((totalViews - previousMonthViews) / previousMonthViews) * 100,
        );

  const percentageText =
    percentage > 0
      ? `+${percentage}% from last month`
      : `${percentage}% from last month`;

  const orderPercentageText =
    orderPercentage > 0
      ? `+${orderPercentage}% from last month`
      : `${orderPercentage}% from last month`;

  const totalRevenue =
    orders?.reduce(
      (total, order) =>
        total +
        order.products.reduce(
          (sum, product) => sum + Number(product.price) * product.quantity,
          0,
        ),
      0,
    ) ?? 0;

  const getRevenue = (data: Order[]) =>
    data.reduce(
      (sum, o) =>
        sum + o.products.reduce((s, p) => s + Number(p.price) * p.quantity, 0),
      0,
    );

  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1);

  const currentRevenue = getRevenue(
    orders?.filter((o) => {
      const d = o.createdAt.toDate();
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    }) ?? [],
  );

  const previousRevenue = getRevenue(
    orders?.filter((o) => {
      const d = o.createdAt.toDate();
      return (
        d.getFullYear() === previous.getFullYear() &&
        d.getMonth() === previous.getMonth()
      );
    }) ?? [],
  );

  const revenueChange = previousRevenue
    ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: loading ? "..." : `$${totalRevenue.toLocaleString()}`,
            sub: loading
              ? "Loading..."
              : `${revenueChange >= 0 ? "+" : ""}${revenueChange}% from last month`,
          },
          {
            title: "Total Orders",
            value: loading ? "..." : (orders?.length ?? 0),
            sub: loading ? "Loading..." : orderPercentageText,
          },
          {
            title: "Total Products",
            value: loading ? "..." : (product?.length ?? 0),
            sub: loading ? "Loading..." : `${outOfStock} out of stock`,
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

            <p className="mt-1 text-sm text-green-700">{card.sub}</p>
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

          <div className="flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-sm bg-green-700" />
            <span className="text-muted-foreground">Unique Views</span>
          </div>
        </div>

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
