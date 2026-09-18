import { useMemo, useState } from "react";
import { Search, ShoppingBag, CreditCard, Clock, XCircle } from "lucide-react";
import type { Order } from "../types/CustomarOrders";
import OrderTable from "../DashboardComponents/OrderTable";
import OrderDetailsModal from "../DashboardComponents/OrderDetailsModal";


const initialOrders: Order[] = [
  {
    id: "law3yq",
    amount: 12005,
    createdAt: {
      toDate: () => new Date("2026-09-16T11:58:51+06:00"),
    } as Order["createdAt"],
    currency: "usd",
    displayName: "Mehedi Hasan Topu",
    email: "topu9872@gmail.com",
    paymentStatus: "paid",
    phoneNumber: "",
    userId: "tcRi6RMEnmTPWAMiG5bwI94MeH72",
    products: [
      {
        category: "living-room",
        color: "Brown",
        description: "Premium luxury wooden sofa for modern living room.",
        id: "6a15d50058a47c461cf60979",
        image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
        material: "Teak Wood",
        name: "Luxury Wooden Sofa",
        price: "1200",
        quantity: 10,
        rating: "4.8",
        stock: 10,
        sessionId: "cs_test_example",
      },
    ],
  },
];

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(createdAt: Order["createdAt"]) {
  return createdAt.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Orders() {
  const [orders] = useState<Order[]>(initialOrders);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "paid" | "pending" | "failed"
  >("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.displayName.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [orders, search, paymentFilter]);

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === "pending",
  ).length;

  const failedOrders = orders.filter(
    (order) => order.paymentStatus === "failed",
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      iconClass: "bg-slate-100 text-slate-700",
    },
    {
      title: "Paid Orders",
      value: paidOrders,
      icon: CreditCard,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "Failed Orders",
      value: failedOrders,
      icon: XCircle,
      iconClass: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Orders
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and monitor customer orders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              All Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "order" : "orders"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search orders..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 sm:w-64"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(
                  event.target.value as "all" | "paid" | "pending" | "failed",
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <OrderTable
          orders={filteredOrders}
          onView={(order) => setSelectedOrder(order)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
