import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export type NotificationType =
  | "new_order"
  | "payment_received"
  | "low_stock"
  | "out_of_stock"
  | "new_user";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: "high" | "medium" | "low";
  read: boolean;
  createdAt?: {
    toDate: () => Date;
  };
}

export const createNotification = async ({
  title,
  message,
  type,
  priority,
}: {
  title: string;
  message: string;
  type: NotificationType;
  priority: "high" | "medium" | "low";
}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      title,
      message,
      type,
      priority,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Create notification error:", error);
  }
};

export const listenNotifications = (
  callback: (notifications: NotificationItem[]) => void,
) => {
  const notificationsQuery = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const notifications = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as NotificationItem[];

      callback(notifications);
    },
    (error) => {
      console.error("Notification listener error:", error);
    },
  );
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    throw error;
  }
};
