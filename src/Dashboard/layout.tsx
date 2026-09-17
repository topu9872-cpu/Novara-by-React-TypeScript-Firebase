import { Outlet } from "react-router";
import DashboardSidebar from "../DashboardComponents/DashboardSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50 mt-2">
      {/* Sidebar handles its own desktop layout and mobile toggle header */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;