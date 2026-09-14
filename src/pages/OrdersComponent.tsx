import React, { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  RotateCcw,
  Search,
  Trash2,
  X,
  CalendarDays,
  Mail,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";

import { getUserOrders } from "../services/productService";
import type { Orders } from "../types/Orders";

export const OrdersComponent: React.FC = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Details modal
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

  // Delete state
  const [deleteOrder, setDeleteOrder] = useState<Orders | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getUserOrders();

        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);

        toast.error("Failed to load orders");

        setOrders([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // STATUS BADGE
  // =========================
  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} />
            Paid
          </span>
        );

      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} />
            Delivered
          </span>
        );

      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck size={13} />
            Shipped
          </span>
        );

      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={13} />
            Processing
          </span>
        );

      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle size={13} />
            Cancelled
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-50 text-neutral-700 border border-neutral-200">
            <Clock size={13} />
            {status}
          </span>
        );
    }
  };

  // =========================
  // DELETE ORDER
  // =========================
  const handleDeleteOrder = async () => {
    if (!deleteOrder?.id) {
      toast.error("Order ID not found");
      return;
    }

    try {
      setDeleting(true);

      const db = getFirestore();

      await deleteDoc(doc(db, "orders", deleteOrder.id));

      // Remove immediately from UI
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== deleteOrder.id),
      );

      // Close modal
      setDeleteOrder(null);

      // Close details if same order
      if (selectedOrder?.id === deleteOrder.id) {
        setSelectedOrder(null);
      }

      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Delete order error:", error);

      toast.error("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "all" ||
      order.paymentStatus?.toLowerCase() === filter.toLowerCase();

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      order.displayName?.toLowerCase().includes(search) ||
      order.email?.toLowerCase().includes(search) ||
      order.products?.some((item) => item.name?.toLowerCase().includes(search));

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-12">
        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <ShoppingBag size={21} className="text-emerald-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900">My Orders</h2>

              <p className="text-sm text-neutral-500 mt-0.5">
                Track and manage your orders.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            SEARCH + FILTER
        ========================= */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-neutral-200
                  bg-neutral-50
                  text-sm
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-100
                "
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {[
                "all",
                "paid",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`
                    px-3.5
                    py-2.5
                    rounded-xl
                    text-xs
                    font-semibold
                    capitalize
                    whitespace-nowrap
                    transition
                    ${
                      filter === tab
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================
            ORDER COUNT
        ========================= */}
        {!loading && (
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm text-neutral-500">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "order" : "orders"} found
            </p>

            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center">
              <Clock size={23} className="text-neutral-500 animate-spin" />
            </div>

            <h3 className="mt-4 font-bold text-neutral-900">Loading Orders</h3>

            <p className="text-sm text-neutral-500 mt-1">
              Please wait while we load your orders.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* =========================
                ORDERS
            ========================= */}
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const firstProduct = order.products?.[0];

                const sessionId =
                  firstProduct?.sessionId || order.id || `ORDER-${index + 1}`;

                return (
                  <div
                    key={order.id || sessionId}
                    className="
                      bg-white
                      rounded-2xl
                      border
                      border-neutral-200
                      overflow-hidden
                      shadow-sm
                      hover:shadow-md
                      transition-shadow
                    "
                  >
                    {/* =========================
                        ORDER HEADER
                    ========================= */}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                            <Package size={20} className="text-neutral-600" />
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-wide font-semibold text-neutral-400">
                              Order ID
                            </p>

                            <h3 className="font-bold text-sm text-neutral-900">
                              #{sessionId.slice(0, 12)}
                            </h3>

                            <p className="text-xs text-neutral-500 mt-0.5">
                              {order.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-left sm:text-right">
                            <p className="text-[11px] uppercase tracking-wide font-semibold text-neutral-400">
                              Total
                            </p>

                            <p className="font-bold text-base text-neutral-900">
                              {order.currency?.toUpperCase()} {order.amount}
                            </p>
                          </div>

                          {getStatusBadge(order.paymentStatus)}
                        </div>
                      </div>

                      {/* =========================
                          PRODUCTS
                      ========================= */}
                      <div className="mt-5 pt-5 border-t border-neutral-100">
                        <div className="space-y-3">
                          {order.products?.map((item) => (
                            <div
                              key={item.id}
                              className="
                                flex
                                items-center
                                justify-between
                                gap-3
                                p-3
                                rounded-xl
                                bg-neutral-50
                                border
                                border-neutral-100
                              "
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="
                                    w-14
                                    h-14
                                    rounded-xl
                                    object-cover
                                    border
                                    border-neutral-200
                                    shrink-0
                                  "
                                />

                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-neutral-900 truncate">
                                    {item.name}
                                  </p>

                                  <p className="text-xs text-neutral-500 mt-1">
                                    {item.category || "Product"}
                                  </p>

                                  <p className="text-xs text-neutral-500 mt-0.5">
                                    ${item.price} × {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <p className="font-semibold text-sm text-neutral-800 shrink-0">
                                $
                                {(
                                  Number(item.price) * Number(item.quantity)
                                ).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* =========================
                        FOOTER ACTIONS
                    ========================= */}
                    <div
                      className="
                      px-5
                      sm:px-6
                      py-3
                      bg-neutral-50
                      border-t
                      border-neutral-100
                      flex
                      flex-wrap
                      justify-end
                      gap-2
                    "
                    >
                      {/* Delete */}
                      <button
                        onClick={() => setDeleteOrder(order)}
                        className="
                          px-3.5
                          py-2
                          rounded-xl
                          bg-white
                          border
                          border-red-200
                          text-red-600
                          text-sm
                          font-medium
                          hover:bg-red-50
                          transition
                          flex
                          items-center
                          gap-1.5
                        "
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                      {/* Buy Again */}
                      {order.paymentStatus?.toLowerCase() === "delivered" && (
                        <button
                          onClick={() =>
                            toast.success("Added to cart successfully")
                          }
                          className="
                            px-3.5
                            py-2
                            rounded-xl
                            bg-white
                            border
                            border-neutral-200
                            text-neutral-700
                            text-sm
                            font-medium
                            hover:bg-neutral-100
                            transition
                            flex
                            items-center
                            gap-1.5
                          "
                        >
                          <RotateCcw size={14} />
                          Buy Again
                        </button>
                      )}

                      {/* View Details */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="
                          px-4
                          py-2
                          rounded-xl
                          bg-emerald-600
                          text-white
                          text-sm
                          font-semibold
                          hover:bg-emerald-700
                          transition
                          shadow-sm
                          flex
                          items-center
                          gap-1.5
                        "
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              /* =========================
                 EMPTY
              ========================= */
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center">
                  <Package size={28} className="text-neutral-400" />
                </div>

                <h3 className="mt-5 font-bold text-neutral-900">
                  No Orders Found
                </h3>

                <p className="text-sm text-neutral-500 mt-1">
                  Try another search or filter.
                </p>

                {(searchQuery || filter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                    className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Clear search & filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================================================
          ORDER DETAILS MODAL
      ================================================== */}
      {selectedOrder && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-3xl
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 px-5 sm:px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Order Details
                </p>

                <h2 className="font-bold text-lg text-neutral-900 mt-1">
                  #
                  {(
                    selectedOrder.products?.[0]?.sessionId ||
                    selectedOrder.id ||
                    "ORDER"
                  ).slice(0, 14)}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-neutral-100
                  hover:bg-neutral-200
                  flex
                  items-center
                  justify-center
                  transition
                "
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div>
                  <p className="text-xs text-neutral-500">Payment Status</p>

                  <div className="mt-2">
                    {getStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-neutral-500">Total</p>

                  <p className="text-lg font-bold text-neutral-900 mt-1">
                    {selectedOrder.currency?.toUpperCase()}{" "}
                    {selectedOrder.amount}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="font-bold text-sm text-neutral-900 mb-3">
                  Customer Information
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <Mail size={16} className="text-neutral-500" />

                    <div>
                      <p className="text-[11px] text-neutral-400">Email</p>

                      <p className="text-sm font-medium text-neutral-800">
                        {selectedOrder.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <CalendarDays size={16} className="text-neutral-500" />

                    <div>
                      <p className="text-[11px] text-neutral-400">Order ID</p>

                      <p className="text-sm font-medium text-neutral-800 break-all">
                        {selectedOrder.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-bold text-sm text-neutral-900 mb-3">
                  Products
                </h3>

                <div className="space-y-3">
                  {selectedOrder.products?.map((item) => (
                    <div
                      key={item.id}
                      className="
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        border
                        border-neutral-200
                      "
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.name}
                        </p>

                        <p className="text-xs text-neutral-500 mt-1">
                          {item.category || "Product"}
                        </p>

                        <p className="text-xs text-neutral-500">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-sm">
                        $
                        {(Number(item.price) * Number(item.quantity)).toFixed(
                          2,
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-bold text-sm text-neutral-900 mb-3">
                  Payment
                </h3>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                      <CreditCard size={17} className="text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs text-neutral-500">Payment</p>

                      <p className="font-semibold text-sm">
                        {selectedOrder.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <p className="font-bold">
                    {selectedOrder.currency?.toUpperCase()}{" "}
                    {selectedOrder.amount}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-4 border-t border-neutral-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  bg-neutral-100
                  text-neutral-700
                  text-sm
                  font-semibold
                  hover:bg-neutral-200
                "
              >
                Close
              </button>

              <button
                onClick={() => {
                  setDeleteOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  bg-red-600
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-red-700
                  flex
                  items-center
                  gap-1.5
                "
              >
                <Trash2 size={14} />
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}
      {deleteOrder && (
        <div
          className="
            fixed
            inset-0
            z-[60]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <Trash2 size={22} className="text-red-600" />
            </div>

            <h2 className="text-lg font-bold text-neutral-900 mt-5">
              Delete this order?
            </h2>

            <p className="text-sm text-neutral-500 mt-2 leading-6">
              This order will be permanently removed from your order history.
              This action cannot be undone.
            </p>

            <div className="flex gap-2 mt-6">
              <button
                disabled={deleting}
                onClick={() => setDeleteOrder(null)}
                className="
                  flex-1
                  px-4
                  py-2.5
                  rounded-xl
                  bg-neutral-100
                  text-neutral-700
                  text-sm
                  font-semibold
                  hover:bg-neutral-200
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={handleDeleteOrder}
                className="
                  flex-1
                  px-4
                  py-2.5
                  rounded-xl
                  bg-red-600
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-red-700
                  disabled:opacity-50
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {deleting ? (
                  <>
                    <Clock size={15} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
