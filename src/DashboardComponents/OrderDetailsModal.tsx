
import {
  X,
  Package,
  User,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import type { Order } from "../types/CustomarOrders";

type OrderDetailsModalProps = {
  order: Order;
  onClose: () => void;
  formatCurrency: (amount: number, currency: string) => string;
  formatDate: (createdAt: Order["createdAt"]) => string;
};

const OrderDetailsModal = ({
  order,
  onClose,
  formatCurrency,
  formatDate,
}: OrderDetailsModalProps) => {
  const getPaymentStatusClass = (status: Order["paymentStatus"]) => {
    if (status === "paid") {
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    }

    if (status === "pending") {
      return "border-amber-100 bg-amber-50 text-amber-700";
    }

    return "border-red-100 bg-red-50 text-red-700";
  };

  const totalQuantity = order.products.reduce(
    (total, product) => total + Number(product.quantity),
    0,
  );

  const userId = order.products[0].userId!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Order Details
            </h2>

            <p className="mt-1 font-mono text-xs text-slate-400">
              #{order.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Payment */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <CreditCard size={16} />

                <span className="text-xs font-medium">Payment</span>
              </div>

              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClass(
                  order.paymentStatus,
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>

            {/* Items */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Package size={16} />

                <span className="text-xs font-medium">Items</span>
              </div>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {totalQuantity}
              </p>
            </div>

            {/* Date */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays size={16} />

                <span className="text-xs font-medium">Order Date</span>
              </div>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer */}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <User size={17} className="text-slate-500" />

              <h3 className="text-sm font-semibold text-slate-900">
                Customer Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <p className="text-xs text-slate-400">Name</p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {order.displayName || "Unknown Customer"}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-slate-400">Email</p>

                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {order.email || "No email"}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs text-slate-400">Phone</p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {order.phoneNumber || "Not provided"}
                </p>
              </div>

              {/* User ID */}
              <div>
                <p className="text-xs text-slate-400">User ID</p>

                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                  {userId || "Not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Ordered Products
              </h3>

              <span className="text-xs text-slate-500">
                {order.products.length}{" "}
                {order.products.length === 1 ? "product" : "products"}
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="divide-y divide-slate-200">
                {order.products.map((product) => {
                  const productTotal =
                    Number(product.price) * Number(product.quantity);

                  return (
                    <div
                      key={`${product.id}-${product.sessionId}`}
                      className="flex gap-4 p-4"
                    >
                      {/* Image */}
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <Package size={20} className="text-slate-400" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">
                              {product.name}
                            </h4>

                            <p className="mt-1 text-xs text-slate-500">
                              {product.material} · {product.color}
                            </p>
                          </div>

                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(
                              productTotal,
                              order.currency,
                            )}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            Qty: {product.quantity}
                          </span>

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            Price:{" "}
                            {formatCurrency(
                              Number(product.price),
                              order.currency,
                            )}
                          </span>

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            Rating: {product.rating}
                          </span>

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs capitalize text-slate-600">
                            {product.category.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-6 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Payment Status</p>

                <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
                  {order.paymentStatus}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">Total Amount</p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatCurrency(order.amount, order.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
