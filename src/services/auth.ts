import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Email Signup
export const signUp = async (
  name: string,
  email: string,
  password: string
) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(result.user, {
    displayName: name,
  });

  return result.user;
};

// Email Login
export const signIn = async (
  email: string,
  password: string
) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

// Google
export const googleLogin = async () => {
  const result = await signInWithPopup(
    auth,
    googleProvider
  );

  return result.user;
};

// Facebook
export const facebookLogin = async () => {
  const result = await signInWithPopup(
    auth,
    facebookProvider
  );

  return result.user;
};

// GitHub
export const githubLogin = async () => {
  const result = await signInWithPopup(
    auth,
    githubProvider
  );

  return result.user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};