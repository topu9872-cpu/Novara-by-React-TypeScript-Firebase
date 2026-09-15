import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const layout = ({ children }: any) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setRole(userDoc.data()?.role || "");
      }
    });
    return unSubscribe;
  }, []);
  if (!role) return;

  return <div>{children}</div>;
};

export default layout;
