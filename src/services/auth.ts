import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

// Sign Up
export const signUp = async (name: string, email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await updateProfile(result.user, {
    displayName: name,
  });

  return result.user;
};

// Sign In
export const signIn = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);

  return result.user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};
