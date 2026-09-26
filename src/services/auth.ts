import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { createNotification } from "../services/notifications";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

/* ----------------------------------
   NEW USER NOTIFICATION
---------------------------------- */

const createNewUserNotification = async (
  name: string | null,
  email: string | null,
) => {
  await createNotification({
    title: "New User",
    message: `${name || email || "A new user"} created a new account.`,
    type: "new_user",
    priority: "low",
  });
};

/* ----------------------------------
   EMAIL SIGNUP
---------------------------------- */

export const signUp = async (name: string, email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(result.user, {
    displayName: name,
  });

  // Automatically create notification
  await createNewUserNotification(name, result.user.email);

  return result.user;
};

/* ----------------------------------
   EMAIL LOGIN
---------------------------------- */

export const signIn = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);

  return result.user;
};

/* ----------------------------------
   GOOGLE
---------------------------------- */

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  const additionalUserInfo = getAdditionalUserInfo(result);

  if (additionalUserInfo?.isNewUser) {
    await createNewUserNotification(result.user.displayName, result.user.email);
  }

  return result.user;
};

/* ----------------------------------
   FACEBOOK
---------------------------------- */

export const facebookLogin = async () => {
  const result = await signInWithPopup(auth, facebookProvider);

  const additionalUserInfo = getAdditionalUserInfo(result);

  if (additionalUserInfo?.isNewUser) {
    await createNewUserNotification(result.user.displayName, result.user.email);
  }

  return result.user;
};

/* ----------------------------------
   GITHUB
---------------------------------- */

export const githubLogin = async () => {
  const result = await signInWithPopup(auth, githubProvider);

  const additionalUserInfo = getAdditionalUserInfo(result);

  if (additionalUserInfo?.isNewUser) {
    await createNewUserNotification(result.user.displayName, result.user.email);
  }

  return result.user;
};

/* ----------------------------------
   LOGOUT
---------------------------------- */

export const logout = async () => {
  await signOut(auth);
};
