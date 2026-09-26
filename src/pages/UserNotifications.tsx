import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

import {
  listenUserNotifications,
  markAllUserNotificationsAsRead,
  type UserNotificationItem,
} from "../services/userNotifications";

import { auth } from "../firebase/firebase";

const formatNotificationTime = (timestamp?: { toDate: () => Date }) => {
  if (!timestamp) return "Just now";

  const date = timestamp.toDate();
  const now = new Date();

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Just now";

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }

  if (diff < 604800) {
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return date.toLocaleDateString();
};

const UserNotifications = () => {
  const [notifications, setNotifications] = useState<UserNotificationItem[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeNotifications: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Remove previous notification listener
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
        unsubscribeNotifications = null;
      }

      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      console.log("👤 Current user:", user.email);

      // Start Firestore listener
      unsubscribeNotifications = listenUserNotifications((data) => {
        setNotifications(data);
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }

      unsubscribeAuth();
    };
  }, []);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleMarkAllNotificationsRead = async () => {
    await markAllUserNotificationsAsRead(notifications);
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Bell className="h-5 w-5 text-emerald-700" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  Notifications
                </h1>

                <p className="mt-0.5 text-xs text-neutral-500">
                  Stay updated with your orders and payments.
                </p>
              </div>
            </div>
          </div>

          {!loading && unreadNotifications > 0 && (
            <button
              type="button"
              onClick={handleMarkAllNotificationsRead}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-neutral-100 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold text-neutral-900">
              {loading ? "—" : notifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Unread
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-700">
              {loading ? "—" : unreadNotifications}
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-emerald-600" />

              <p className="mt-4 text-xs text-neutral-400">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            /* Empty */
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                <Bell className="h-6 w-6 text-neutral-400" />
              </div>

              <h2 className="text-sm font-bold text-neutral-700">
                No notifications yet
              </h2>

              <p className="mt-1 text-xs text-neutral-400">
                We'll notify you when there is something important.
              </p>
            </div>
          ) : (
            /* Notification List */
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`w-full border-b border-neutral-100 p-5 text-left transition-colors last:border-b-0 hover:bg-emerald-50/40 ${
                  notification.read ? "bg-white" : "bg-emerald-50/30"
                }`}
              >
                <div className="flex gap-4">
                  {/* Status */}
                  <div className="pt-1.5">
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${
                        notification.read ? "bg-neutral-200" : "bg-emerald-500"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={`text-sm ${
                          notification.read
                            ? "font-semibold text-neutral-700"
                            : "font-bold text-neutral-900"
                        }`}
                      >
                        {notification.title}
                      </h3>

                      {!notification.read && (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-[10px] text-neutral-400">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
