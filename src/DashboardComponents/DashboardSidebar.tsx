import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  Store,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";

const DashboardSidebar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/dashboard/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      label: "Customers",
      path: "/dashboard/customers",
      icon: Users,
    },
    {
      label: "Payments",
      path: "/dashboard/payments",
      icon: CreditCard,
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-sm font-bold text-white">
            N
          </div>

          <div>
            <p className="text-sm font-bold text-neutral-950">Novara</p>
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">
              Admin
            </p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-neutral-100 px-5">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-sm font-bold text-white">
              N
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight text-neutral-950">
                Novara
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                Admin
              </p>
            </div>
          </NavLink>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
            Management
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:scale-102 ${
                      isActive
                        ? "bg-green-800 text-white"
                        : "text-neutral-500 hover:bg-green-100 hover:text-neutral-950"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Store */}
          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              Store
            </p>

            <NavLink
              to="/shop"
              onClick={() => setOpen(false)}
              className="flex items-center hover:scale-102 hover:bg-green-100 gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 transition  hover:text-neutral-950"
            >
              <Store size={18} strokeWidth={1.8} />
              <span>View Store</span>
            </NavLink>

            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className="mt-1 hover:scale-102 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 transition hover:bg-green-100 hover:text-neutral-950"
            >
              <Settings size={18} strokeWidth={1.8} />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
