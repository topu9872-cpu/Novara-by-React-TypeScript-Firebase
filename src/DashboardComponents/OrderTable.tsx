import { Eye, Package } from "lucide-react";
import type { Order } from "../types/CustomarOrders";

type OrderTableProps = {
  orders: Order[];
  onView: (order: Order) => void;
  formatCurrency: (amount: number, currency: string) => string;
  formatDate: (createdAt: Order["createdAt"]) => string;
};

const OrderTable = ({
  orders,
  onView,
  formatCurrency,
  formatDate,
}: OrderTableProps) => {
  const getPaymentStatusClass = (status: Order["paymentStatus"]) => {
    if (status === "paid") {
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    }

    if (status === "pending") {
      return "border-amber-100 bg-amber-50 text-amber-700";
    }

    return "border-red-100 bg-red-50 text-red-700";
  };

  const getPaymentDotClass = (status: Order["paymentStatus"]) => {
    if (status === "paid") {
      return "bg-emerald-500";
    }

    if (status === "pending") {
      return "bg-amber-500";
    }

    return "bg-red-500";
  };

  if (orders.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center px-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Package size={24} className="text-slate-400" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No orders found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Try changing your search or payment filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-225">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Order
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Products
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Payment
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const totalQuantity = order.products.reduce(
              (total, product) => total + Number(product.quantity),
              0,
            );

            const firstProduct = order.products[0];

            const initials =
              order.displayName
                ?.split(" ")
                .map((name: string) => name[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U";

            return (
              <tr key={order.id} className="transition hover:bg-slate-50/60">
                {/* Order */}
                <td className="px-5 py-4">
                  <div>
                    <p className="font-mono text-sm font-medium text-slate-900">
                      #{order.id.slice(0, 8)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">{order.id.slice(8,20)}</p>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {order.displayName || "Unknown Customer"}
                      </p>

                      <p className="mt-0.5 max-w-48 truncate text-xs text-slate-500">
                        {order.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Products */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {firstProduct?.image ? (
                      <img
                        src={firstProduct.image}
                        alt={firstProduct.name || "Product"}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <Package size={17} className="text-slate-400" />
                      </div>
                    )}

                    <div>
                      <p className="max-w-45 truncate text-sm font-medium text-slate-800">
                        {firstProduct?.name || "No product"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {order.products.length}{" "}
                        {order.products.length === 1 ? "product" : "products"} ·{" "}
                        {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(order.amount, order.currency)}
                  </p>
                </td>

                {/* Payment */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getPaymentStatusClass(
                      order.paymentStatus,
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getPaymentDotClass(
                        order.paymentStatus,
                      )}`}
                    />

                    {order.paymentStatus}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700">
                    {formatDate(order.createdAt)}
                  </p>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
