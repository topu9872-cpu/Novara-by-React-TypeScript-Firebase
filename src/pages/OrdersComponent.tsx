import React, { useState } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  
  Eye, 
  RotateCcw,
  Search
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
}

export const OrdersComponent: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock orders data (Replace with Firestore fetch when ready)
  const [orders] = useState<Order[]>([
    {
      id: "ORD-94821",
      date: "Aug 24, 2026",
      total: 145.50,
      status: "Delivered",
      items: [
        { id: "1", name: "Wireless Noise-Canceling Headphones", quantity: 1, price: 120.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=60" },
        { id: "2", name: "USB-C Fast Charging Cable", quantity: 1, price: 25.50, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&auto=format&fit=crop&q=60" }
      ]
    },
    {
      id: "ORD-93502",
      date: "Aug 20, 2026",
      total: 89.99,
      status: "Shipped",
      items: [
        { id: "3", name: "Smart Fitness Activity Tracker", quantity: 1, price: 89.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60" }
      ]
    },
    {
      id: "ORD-92114",
      date: "Aug 15, 2026",
      total: 210.00,
      status: "Processing",
      items: [
        { id: "4", name: "Ergonomic Office Desk Organizer", quantity: 2, price: 105.00, image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=100&auto=format&fit=crop&q=60" }
      ]
    },
    {
      id: "ORD-89012",
      date: "Jul 30, 2026",
      total: 45.00,
      status: "Cancelled",
      items: [
        { id: "5", name: "Minimalist Ceramic Coffee Mug", quantity: 1, price: 45.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=60" }
      ]
    }
  ]);

  // Status Badge Styling Helper
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} /> Delivered
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck size={13} /> Shipped
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={13} /> Processing
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle size={13} /> Cancelled
          </span>
        );
    }
  };

  // Filter and Search logic
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900">My Orders</h2>
        <p className="text-xs text-neutral-500">Track current shipments and view past order history.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID or item..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all shadow-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["all", "processing", "shipped", "delivered", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filter === tab 
                  ? "bg-emerald-600 text-white shadow-xs" 
                  : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white border border-neutral-100 rounded-2xl shadow-xs p-4 sm:p-5 transition-all hover:border-neutral-200 space-y-4"
            >
              {/* Order Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{order.id}</span>
                    <span className="text-xs text-neutral-400">•</span>
                    <span className="text-xs text-neutral-500">{order.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-neutral-900">${order.total.toFixed(2)}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-100 shrink-0 bg-neutral-50"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-neutral-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
                {order.status === "Delivered" && (
                  <button 
                    onClick={() => toast.success(`Added items from ${order.id} to cart!`)}
                    className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw size={14} /> Buy Again
                  </button>
                )}
                <button 
                  onClick={() => toast.info(`Viewing details for ${order.id}`)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Eye size={14} /> View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-100 p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800">No orders found</p>
              <p className="text-xs text-neutral-500 mt-0.5">Try changing your filters or search term.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};