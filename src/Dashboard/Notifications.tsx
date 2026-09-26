import { useEffect, useState } from "react";
import {
  Bell,
  CreditCard,
  Package,
  ShoppingBag,
  UserPlus,
  Clock,
} from "lucide-react";

import {
  listenNotifications,
  markNotificationAsRead,
  type NotificationItem,
} from "../services/notifications";

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     LISTEN TO NOTIFICATIONS
  ---------------------------------- */
  useEffect(() => {
    const unsubscribe = listenNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ----------------------------------
     UNREAD COUNT
  ---------------------------------- */
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ----------------------------------
     MARK SINGLE AS READ
  ---------------------------------- */
  const handleNotificationClick = async (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId);

    if (!notification || notification.read) return;

    try {
      // Update UI immediately
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, read: true } : item,
        ),
      );

      // Update Firestore
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  /* ----------------------------------
     ICON
  ---------------------------------- */
  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "new_order":
        return <ShoppingBag size={22} />;

      case "payment_received":
        return <CreditCard size={22} />;

      case "low_stock":
      case "out_of_stock":
        return <Package size={22} />;

      case "new_user":
        return <UserPlus size={22} />;

      default:
        return <Bell size={22} />;
    }
  };

  /* ----------------------------------
     TYPE COLOR
  ---------------------------------- */
  const getTypeStyle = (type: NotificationItem["type"], read: boolean) => {
    const styles = {
      new_order: read
        ? "border-green-500/30 hover:border-green-500/50"
        : "border-green-500/70 shadow-[0_0_0_1px_rgba(34,197,94,0.08)]",

      payment_received: read
        ? "border-blue-500/30 hover:border-blue-500/50"
        : "border-blue-500/70 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]",

      low_stock: read
        ? "border-amber-500/30 hover:border-amber-500/50"
        : "border-amber-500/70 shadow-[0_0_0_1px_rgba(245,158,11,0.08)]",

      out_of_stock: read
        ? "border-red-500/30 hover:border-red-500/50"
        : "border-red-500/70 shadow-[0_0_0_1px_rgba(239,68,68,0.08)]",

      new_user: read
        ? "border-purple-500/30 hover:border-purple-500/50"
        : "border-purple-500/70 shadow-[0_0_0_1px_rgba(168,85,247,0.08)]",
    };

    return styles[type];
  };

  /* ----------------------------------
     ICON COLOR
  ---------------------------------- */
  const getIconStyle = (type: NotificationItem["type"], read: boolean) => {
    const styles = {
      new_order: read
        ? "bg-green-500/5 text-green-600 border-green-500/20"
        : "bg-green-500/10 text-green-600 border-green-500/40",

      payment_received: read
        ? "bg-blue-500/5 text-blue-600 border-blue-500/20"
        : "bg-blue-500/10 text-blue-600 border-blue-500/40",

      low_stock: read
        ? "bg-amber-500/5 text-amber-600 border-amber-500/20"
        : "bg-amber-500/10 text-amber-600 border-amber-500/40",

      out_of_stock: read
        ? "bg-red-500/5 text-red-600 border-red-500/20"
        : "bg-red-500/10 text-red-600 border-red-500/40",

      new_user: read
        ? "bg-purple-500/5 text-purple-600 border-purple-500/20"
        : "bg-purple-500/10 text-purple-600 border-purple-500/40",
    };

    return styles[type];
  };

  /* ----------------------------------
     PRIORITY
  ---------------------------------- */
  const getPriorityStyle = (priority: NotificationItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20";

      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";

      case "low":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";

      default:
        return "bg-muted text-muted-foreground border-border/50";
    }
  };

  /* ----------------------------------
     RELATIVE TIME
  ---------------------------------- */
  const getRelativeTime = (createdAt?: { toDate?: () => Date } | any) => {
    if (!createdAt) return "Just now";

    const date =
      typeof createdAt.toDate === "function"
        ? createdAt.toDate()
        : new Date(createdAt);

    const diff = Date.now() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full rounded-xl bg-background shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center md:p-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Notifications
            </h1>

            {!loading && unreadCount > 0 && (
              <span className="flex h-6 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-semibold text-primary-foreground shadow-sm">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Review your latest store activity and alerts.
          </p>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div>
        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

            <p className="mt-4 text-sm text-muted-foreground">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          /* EMPTY */
          <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border/50 bg-muted/30 shadow-inner">
              <Bell size={32} className="text-muted-foreground/50" />
            </div>

            <h2 className="text-xl font-semibold text-foreground">
              No notifications yet
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              When there's activity in your store like a new order or a low
              stock alert, it will show up here.
            </p>
          </div>
        ) : (
          /* NOTIFICATION LIST */
          <div className="flex flex-col gap-3 p-4 md:p-6">
            {notifications.map((notification) => {
              const isUnread = !notification.read;

              return (
                <div
                  key={notification.id}
                  onMouseEnter={() => handleNotificationClick(notification.id)}
                  className={`group relative flex w-full cursor-pointer items-start gap-4 rounded-2xl border bg-background p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-6 ${getTypeStyle(
                    notification.type,
                    notification.read,
                  )} ${isUnread ? "bg-muted/10" : "opacity-90"}`}
                >
                  {/* UNREAD DOT */}
                  {isUnread && (
                    <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
                  )}

                  {/* ICON */}
                  <div
                    className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 group-hover:scale-105 ${getIconStyle(
                      notification.type,
                      notification.read,
                    )}`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  {/* CONTENT */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                      <h2
                        className={`text-base ${
                          isUnread
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground/80"
                        }`}
                      >
                        {notification.title}
                      </h2>

                      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Clock size={12} />

                        {getRelativeTime(notification.createdAt)}
                      </span>
                    </div>

                    <p
                      className={`max-w-4xl text-sm leading-relaxed ${
                        isUnread
                          ? "text-foreground/90"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.message}
                    </p>

                    {/* PRIORITY */}
                    <div className="mt-3 flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityStyle(
                          notification.priority,
                        )}`}
                      >
                        {notification.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
