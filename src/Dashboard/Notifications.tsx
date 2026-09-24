import {
  Bell,
  Check,
  CheckCheck,
  Package,
  CreditCard,
  UserPlus,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type NotificationType = "order" | "payment" | "user" | "stock" | "system";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "A new order #NOV-1024 has been placed.",
    time: "2 minutes ago",
    type: "order",
    read: false,
  },
  {
    id: "2",
    title: "Payment Successful",
    message: "Payment for order #NOV-1023 has been completed.",
    time: "18 minutes ago",
    type: "payment",
    read: false,
  },
  {
    id: "3",
    title: "New User Registered",
    message: "A new customer has created an account.",
    time: "1 hour ago",
    type: "user",
    read: true,
  },
  {
    id: "4",
    title: "Low Stock Alert",
    message: "Nike Air Max 270 is running low. Only 3 items left.",
    time: "2 hours ago",
    type: "stock",
    read: false,
  },
  {
    id: "5",
    title: "New Order Received",
    message: "A new order #NOV-1022 has been placed.",
    time: "4 hours ago",
    type: "order",
    read: true,
  },
  {
    id: "6",
    title: "System Update",
    message: "Your dashboard data has been synchronized successfully.",
    time: "Yesterday",
    type: "system",
    read: true,
  },
];

const notificationConfig = {
  order: {
    icon: Package,
    className:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  payment: {
    icon: CreditCard,
    className:
      "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  },
  user: {
    icon: UserPlus,
    className:
      "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  },
  stock: {
    icon: AlertTriangle,
    className:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  },
  system: {
    icon: Bell,
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  },
};

const Notifications = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-base-200/40 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>

                <p className="text-sm text-base-content/60">
                  Stay updated with everything happening in Novara.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="btn btn-outline btn-sm gap-2"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        </div>

        {/* Notification Card */}
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-base-300 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`btn btn-sm ${
                  filter === "all" ? "btn-primary" : "btn-ghost"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("unread")}
                className={`btn btn-sm ${
                  filter === "unread" ? "btn-primary" : "btn-ghost"
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="badge badge-sm">{unreadCount}</span>
                )}
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="btn btn-ghost btn-sm gap-2 text-error"
              >
                <Trash2 size={16} />
                Clear all
              </button>
            )}
          </div>

          {/* Notifications */}
          <div>
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
                  <Bell size={28} className="text-base-content/40" />
                </div>

                <h3 className="text-lg font-semibold">No notifications</h3>

                <p className="mt-1 max-w-sm text-sm text-base-content/50">
                  You're all caught up. New notifications will appear here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const config = notificationConfig[notification.type];

                const Icon = config.icon;

                return (
                  <div
                    key={notification.id}
                    className={`group flex gap-4 border-b border-base-200 px-5 py-5 transition last:border-b-0 hover:bg-base-200/40 ${
                      !notification.read ? "bg-primary/3" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-semibold ${
                              !notification.read
                                ? "text-base-content"
                                : "text-base-content/80"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>

                        <span className="text-xs text-base-content/40">
                          {notification.time}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-base-content/60">
                        {notification.message}
                      </p>

                      <div className="mt-3 flex items-center gap-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            <Check size={14} />
                            Mark as read
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-base-content/40 opacity-0 transition hover:text-error group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
