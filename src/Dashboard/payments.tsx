import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Eye, Search, X, XCircle } from "lucide-react";

type PaymentStatus = "Paid" | "Pending" | "Failed";

type Payment = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
};

const initialPayments: Payment[] = [
  {
    id: "PAY-001",
    customer: "Mehedi Hasan Topu",
    email: "topu9872@gmail.com",
    amount: 1200,
    method: "Stripe",
    status: "Paid",
    date: "16 Sep 2026",
  },
  {
    id: "PAY-002",
    customer: "Rahim Ahmed",
    email: "rahim@gmail.com",
    amount: 780,
    method: "Stripe",
    status: "Paid",
    date: "15 Sep 2026",
  },
  {
    id: "PAY-003",
    customer: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    amount: 430,
    method: "Stripe",
    status: "Pending",
    date: "14 Sep 2026",
  },
  {
    id: "PAY-004",
    customer: "Tanvir Hasan",
    email: "tanvir@gmail.com",
    amount: 250,
    method: "Stripe",
    status: "Failed",
    date: "13 Sep 2026",
  },
];

const Payments = () => {
  const [payments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

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
            Monitor and manage customer payments.
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
              ${stats.revenue}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Payment History</h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredPayments.length} payments found
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

              {/* Status */}
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
                    Payment
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
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      {/* Payment */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {payment.id}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {payment.customer}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {payment.email}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          ${payment.amount}
                        </span>
                      </td>

                      {/* Method */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {payment.method}
                        </span>
                      </td>

                      {/* Status */}
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

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {payment.date}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-green-800 hover:text-white"
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
                        Try another search or payment status.
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
            className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Payment Details
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  {selectedPayment.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">Payment Amount</p>

                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  ${selectedPayment.amount}
                </p>
              </div>

              <div className="flex justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="text-xs text-slate-500">Customer</span>

                <span className="text-xs font-medium text-slate-700">
                  {selectedPayment.customer}
                </span>
              </div>

              <div className="flex justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="text-xs text-slate-500">Method</span>

                <span className="text-xs font-medium text-slate-700">
                  {selectedPayment.method}
                </span>
              </div>

              <div className="flex justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="text-xs text-slate-500">Status</span>

                <span className="text-xs font-medium text-slate-700">
                  {selectedPayment.status}
                </span>
              </div>

              <div className="flex justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="text-xs text-slate-500">Date</span>

                <span className="text-xs font-medium text-slate-700">
                  {selectedPayment.date}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 py-3">
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full rounded-lg bg-green-800 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
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
