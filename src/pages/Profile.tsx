import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  User as UserIcon,
  Mail,
  Shield,
  ArrowLeft,
  Phone,
  MapPin,
  Edit3,
} from "lucide-react";

import { onAuthStateChanged, type User } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { toast } from "sonner";

import { auth, db } from "../firebase/firebase";
import { ProfileEditForm } from "../Components/Profile/ProfileEditForm";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  photoURL: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  // ==========================================
  // LOAD PROFILE FROM FIRESTORE
  // ==========================================

  const loadProfile = async (user: User) => {
    setLoadingProfile(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      console.log("Current Firebase UID:", user.uid);

      if (snap.exists()) {
        const data = snap.data();

        console.log("Firestore profile data:", data);

        setProfile({
          name: data.name || user.displayName || "No Name",
          email: data.email || user.email || "",
          phone: data.phone || "Not Provided",
          location: data.location || "Not Provided",
          photoURL: data.photoURL || user.photoURL || "",
        });
      } else {
        console.log("No Firestore profile found at users/" + user.uid);

        // Firebase Auth fallback
        setProfile({
          name: user.displayName || "No Name",
          email: user.email || "",
          phone: "Not Provided",
          location: "Not Provided",
          photoURL: user.photoURL || "",
        });
      }
    } catch (error) {
      console.error("Failed to load Firestore profile:", error);

      toast.error("Failed to load profile");

      // Auth fallback
      setProfile({
        name: user.displayName || "No Name",
        email: user.email || "",
        phone: "Not Provided",
        location: "Not Provided",
        photoURL: user.photoURL || "",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // ==========================================
  // AUTH STATE
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Firebase Auth user:", user);

      try {
        setCurrentUser(user);

        if (user) {
          await loadProfile(user);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth/Profile error:", error);

        toast.error("Failed to load profile");
      } finally {
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ==========================================
  // PROFILE UPDATED
  // ==========================================

  const handleProfileUpdated = async () => {
    if (!currentUser) return;

    try {
      await currentUser.reload();

      await loadProfile(currentUser);

      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile refresh error:", error);

      toast.error("Failed to refresh profile");
    }
  };

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (loadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-neutral-400 font-medium text-sm">
          Loading profile...
        </p>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500 font-medium">
          Please log in to view your profile.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl font-semibold text-sm hover:bg-neutral-800 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ==========================================
  // PROFILE LOADING
  // ==========================================

  if (loadingProfile || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-neutral-400 font-medium text-sm">
          Loading profile...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-medium text-sm transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-2xl border border-neutral-200/80 shadow-2xs"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />

            <span>Back</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-800/20">
              N
            </div>

            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Novara
              <span className="text-emerald-800">.</span>
            </span>
          </div>
        </div>

        {/* ================= MAIN CARD ================= */}

        <div className="bg-white p-8 sm:p-10 rounded-4xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-8">
          {/* ================= USER HEADER ================= */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-100 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* AVATAR */}

              <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md overflow-hidden shrink-0">
                {profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <UserIcon size={40} />
                )}
              </div>

              {/* USER INFORMATION */}

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {profile.name}
                </h1>

                <p className="text-sm text-neutral-500 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail size={14} className="text-emerald-700" />

                  {profile.email || "No email available"}
                </p>

                <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full mt-2">
                  Verified Account
                </span>
              </div>
            </div>

            {/* EDIT BUTTON */}

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 size={16} />

                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* ================= EDIT / VIEW ================= */}

          {isEditing ? (
            <ProfileEditForm
              currentUser={currentUser}
              profile={profile}
              onClose={() => setIsEditing(false)}
              onSuccess={handleProfileUpdated}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NAME */}

              <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-1">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Full Name
                </span>

                <p className="text-sm font-semibold text-neutral-900">
                  {profile.name}
                </p>
              </div>

              {/* EMAIL */}

              <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-1">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Email Address
                </span>

                <p className="text-sm font-semibold text-neutral-900">
                  {profile.email || "Not Provided"}
                </p>
              </div>

              {/* PHONE */}

              <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-1">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Phone Number
                </span>

                <p className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <Phone size={14} className="text-neutral-400" />

                  {profile.phone}
                </p>
              </div>

              {/* LOCATION */}

              <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-1">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Location
                </span>

                <p className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <MapPin size={14} className="text-neutral-400" />

                  {profile.location}
                </p>
              </div>

              {/* SECURITY */}

              <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Account Security
                </span>

                <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Shield size={14} />
                  Firebase Auth Secured
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
