import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Eye, Search, X, XCircle, Loader2, Package } from "lucide-react";
import { getAllOrders } from "../services/AdminDashboard";

type PaymentStatus = "Paid" | "Pending" | "Failed";

type Product = {
  category: string;
  color: string;
  description: string;
  id: string;
  image: string;
  material: string;
  name: string;
  price: number;
  quantity: number;
  rating: number;
  stock: number;
};

type Payment = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
  products: Product[];
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Fetch and map payments from API when search or status filter changes
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const rawData = await getAllOrders(search, statusFilter);
        
        // Map database document structure to frontend Payment type
        const formattedData: Payment[] = (rawData || []).map((item: any) => {
          const rawStatus = item.paymentStatus?.toLowerCase();
          let status: PaymentStatus = "Pending";
          if (rawStatus === "paid") status = "Paid";
          else if (rawStatus === "failed") status = "Failed";

          // Format Firestore Timestamp or fallback string
          let dateString = "N/A";
          if (item.createdAt?.seconds) {
            dateString = new Date(item.createdAt.seconds * 1000).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
          } else if (typeof item.createdAt === "string") {
            dateString = item.createdAt;
          }

          return {
            id: item.id || item.sessionId?.slice(0, 10) || "PAY-XXX",
            customer: item.displayName || "Unknown Customer",
            email: item.email || "No email",
            // If your amount is stored in cents (e.g. 8005), divide by 100. 
            // If it's already a regular dollar value, keep it as item.amount
            amount: item.amount ? item.amount / 100 : 0, 
            method: item.sessionId ? "Stripe" : "Card",
            status: status,
            date: dateString,
            products: item.products || [],
          };
        });

        setPayments(formattedData);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError("Failed to load payment history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // Dynamic metrics calculation
  const stats = useMemo(() => {
    const paid = payments.filter((payment) => payment.status === "Paid");
    const pending = payments.filter((payment) => payment.status === "Pending");
    const failed = payments.filter((payment) => payment.status === "Failed");

    return {
      total: payments.length,
      successful: paid.length,
      pending: pending.length,
      failed: failed.length,
      revenue: paid.reduce((sum, payment) => sum + payment.amount, 0),
    };
  }, [payments]);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Payments
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage customer payments and orders.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Total Payments</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Successful</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.successful}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ${stats.revenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Payment History</h2>
              <p className="mt-1 text-xs text-slate-500">
                {payments.length} payments found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search payments..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-md">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Payment ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Method
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex justify-center items-center gap-2 text-slate-500 text-sm">
                        <Loader2 className="animate-spin" size={20} />
                        Loading payments...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-red-500 text-sm">
                      {error}
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900 truncate max-w-30">
                          {payment.id}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {payment.customer}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {payment.email}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          ${payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {payment.status === "Paid" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 size={13} />
                            Paid
                          </span>
                        )}
                        {payment.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <Clock3 size={13} />
                            Pending
                          </span>
                        )}
                        {payment.status === "Failed" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            <XCircle size={13} />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {payment.date}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-emerald-800 hover:text-white"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No payments found
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Try another search query or payment status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Payment & Order Details
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  ID: {selectedPayment.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5 overflow-y-auto">
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  ${selectedPayment.amount.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="text-slate-500 block mb-0.5">Customer</span>
                  <span className="font-medium text-slate-700">{selectedPayment.customer}</span>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="text-slate-500 block mb-0.5">Email</span>
                  <span className="font-medium text-slate-700 truncate block">{selectedPayment.email}</span>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="text-slate-500 block mb-0.5">Method</span>
                  <span className="font-medium text-slate-700">{selectedPayment.method}</span>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="text-slate-500 block mb-0.5">Status</span>
                  <span className="font-medium text-slate-700">{selectedPayment.status}</span>
                </div>
              </div>

              {/* Products Section */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Package size={14} /> Purchased Products ({selectedPayment.products.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedPayment.products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md border" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-[11px] text-slate-500">Qty: {product.quantity} • Color: {product.color}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-900">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 py-3 mt-auto bg-white">
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full rounded-lg bg-emerald-800 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;