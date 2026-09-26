import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export type UserNotificationType =
  | "order_placed"
  | "payment_received";

export interface UserNotificationItem {
  id: string;
  email: string;
  title: string;
  message: string;
  type: UserNotificationType;
  read: boolean;
  createdAt?: {
    toDate: () => Date;
  };
}

/* =========================================
   CREATE USER NOTIFICATION
========================================= */
export const createUserNotification = async ({
  userId,
  title,
  message,
  type,
}: {
  userId: string;
  title: string;
  message: string;
  type: UserNotificationType;
}) => {
  try {
    if (!userId) {
      console.error("❌ User ID not found");
      return;
    }

    const user = auth.currentUser;

    await addDoc(collection(db, "userNotifications"), {
      userId,
      email: user?.email || "",
      title,
      message,
      type,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Create user notification error:", error);
  }
};

/* =========================================
   LISTEN TO CURRENT USER NOTIFICATIONS
========================================= */

export const listenUserNotifications = (
  callback: (notifications: UserNotificationItem[]) => void,
) => {
  const user = auth.currentUser;

  if (!user?.email) {
    callback([]);
    return () => {};
  }

  const notificationsQuery = query(
    collection(db, "userNotifications"),
    where("email", "==", user.email),
  );

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const notifications = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .sort((a: any, b: any) => {
          const aTime =
            a.createdAt?.toDate?.()?.getTime() || 0;

          const bTime =
            b.createdAt?.toDate?.()?.getTime() || 0;

          return bTime - aTime;
        }) as UserNotificationItem[];

      callback(notifications);
    },
    (error) => {
      console.error(
        "❌ Notification listener error:",
        error,
      );
    },
  );
};

/* =========================================
   MARK ALL AS READ
========================================= */

export const markAllUserNotificationsAsRead = async (
  notifications: UserNotificationItem[],
) => {
  try {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read,
    );

    if (unreadNotifications.length === 0) return;

    const batch = writeBatch(db);

    unreadNotifications.forEach((notification) => {
      batch.update(
        doc(
          db,
          "userNotifications",
          notification.id,
        ),
        {
          read: true,
        },
      );
    });

    await batch.commit();
  } catch (error) {
    console.error(
      "Mark all user notifications as read error:",
      error,
    );
  }
};