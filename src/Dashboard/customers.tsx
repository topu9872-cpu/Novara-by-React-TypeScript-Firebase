import { useMemo, useState } from "react";
import {
  Eye,
  Search,
  Mail,
  Phone,
  X,
  ShoppingBag,
  DollarSign,
  CalendarDays,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  joined: string;
};

const initialCustomers: Customer[] = [
  {
    id: "CUS-001",
    name: "Mehedi Hasan Topu",
    email: "topu9872@gmail.com",
    phone: "+880 1712-345678",
    avatar: "https://i.pravatar.cc/150?img=11",
    totalOrders: 12,
    totalSpent: 1200,
    joined: "16 Sep 2026",
  },
  {
    id: "CUS-002",
    name: "Rahim Ahmed",
    email: "rahim@gmail.com",
    phone: "+880 1811-222333",
    avatar: "https://i.pravatar.cc/150?img=12",
    totalOrders: 8,
    totalSpent: 780,
    joined: "10 Sep 2026",
  },
  {
    id: "CUS-003",
    name: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    phone: "+880 1911-999888",
    avatar: "https://i.pravatar.cc/150?img=5",
    totalOrders: 5,
    totalSpent: 430,
    joined: "02 Sep 2026",
  },
];

const Customers = () => {
  const [customers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query),
    );
  }, [customers, search]);

  const stats = useMemo(() => {
    const totalRevenue = customers.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0,
    );

    const totalOrders = customers.reduce(
      (sum, customer) => sum + customer.totalOrders,
      0,
    );

    return {
      customers: customers.length,
      revenue: totalRevenue,
      avgOrders: customers.length
        ? (totalOrders / customers.length).toFixed(1)
        : "0",
    };
  }, [customers]);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your customers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Customers</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.customers}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Revenue</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ${stats.revenue}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Avg Orders</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.avgOrders}
            </p>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">All Customers</h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredCustomers.length} customers found
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-200">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Orders
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Spent
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Joined
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />

                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {customer.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={14} className="text-slate-400" />
                            {customer.email}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Phone size={13} className="text-slate-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {customer.totalOrders}
                        </span>
                      </td>

                      {/* Spent */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          ${customer.totalSpent}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {customer.joined}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-green-900 hover:text-white"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No customers found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try searching with another name or email.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    {/* Customer Details Modal */}
{selectedCustomer && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={() => setSelectedCustomer(null)}
  >
    <div
      className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Customer Details
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            {selectedCustomer.id}
          </p>
        </div>

        <button
          onClick={() => setSelectedCustomer(null)}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      </div>

      {/* Customer */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <img
            src={selectedCustomer.avatar}
            alt={selectedCustomer.name}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {selectedCustomer.name}
            </h3>

            <p className="truncate text-xs text-slate-500">
              {selectedCustomer.email}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-slate-400" />
              <span className="text-xs text-slate-500">Email</span>
            </div>

            <span className="max-w-48 truncate text-xs font-medium text-slate-700">
              {selectedCustomer.email}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-slate-400" />
              <span className="text-xs text-slate-500">Phone</span>
            </div>

            <span className="text-xs font-medium text-slate-700">
              {selectedCustomer.phone}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <ShoppingBag
                size={15}
                className="text-slate-400"
              />

              <span className="text-xs text-slate-500">
                Orders
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {selectedCustomer.totalOrders}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <DollarSign
                size={15}
                className="text-slate-400"
              />

              <span className="text-xs text-slate-500">
                Spent
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              ${selectedCustomer.totalSpent}
            </p>
          </div>
        </div>

        {/* Joined */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={15}
              className="text-slate-400"
            />

            <span className="text-xs text-slate-500">
              Joined
            </span>
          </div>

          <span className="text-xs font-medium text-slate-700">
            {selectedCustomer.joined}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-5 py-3">
        <button
          onClick={() => setSelectedCustomer(null)}
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

export default Customers;
