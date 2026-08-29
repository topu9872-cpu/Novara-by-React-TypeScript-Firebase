import React, { useState } from "react";

import { updateProfile, type User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import {
  Camera,
  Save,
  X,
  User as UserIcon,
  Mail,
  Phone as PhoneIcon,
  MapPin,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  photoURL: string;
}

interface Props {
  currentUser: User;
  profile: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileEditForm: React.FC<Props> = ({
  currentUser,
  profile,
  onClose,
  onSuccess,
}) => {
  // ==========================================
  // HELPERS
  // ==========================================

  const cleanValue = (value: string) => {
    if (!value || value === "Not Provided") {
      return "";
    }

    return value;
  };

  // ==========================================
  // STATES
  // ==========================================

  const [name, setName] = useState(cleanValue(profile.name));

  const [phone, setPhone] = useState(cleanValue(profile.phone));

  const [location, setLocation] = useState(cleanValue(profile.location));

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [preview, setPreview] = useState(profile.photoURL || "");

  const [saving, setSaving] = useState(false);

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImageFile(file);

    const imagePreview = URL.createObjectURL(file);

    setPreview(imagePreview);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setSaving(true);

      // ========================================
      // CURRENT PHOTO
      // ========================================

      let photoURL = profile.photoURL || currentUser.photoURL || "";

      // ========================================
      // CLOUDINARY IMAGE UPLOAD
      // ========================================

      if (imageFile) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();

        formData.append("file", imageFile);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error?.message || "Cloudinary upload failed");
        }

        photoURL = data.secure_url;
      }
      // ========================================
      // FIREBASE AUTH PROFILE
      // ========================================

      await updateProfile(currentUser, {
        displayName: name.trim(),
        photoURL: photoURL || null,
      });

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          uid: currentUser.uid,
          name: name.trim(),
          email: currentUser.email || "",
          phone: phone.trim(),
          location: location.trim(),
          photoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success("Profile updated successfully!");

      onSuccess();
    } catch (error: any) {
      console.error("Error:", error);

      console.error("Message:", error?.message);

      toast.error(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ======================================
          AVATAR
      ======================================= */}

      <div className="flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-emerald-50 shadow-md bg-neutral-100 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={40} className="text-neutral-400" />
            )}
          </div>

          <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <Camera size={16} />

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>
        </div>

        <p className="text-xs font-medium text-neutral-500 mt-2.5">
          Tap icon to change photo
        </p>
      </div>

      {/* ======================================
          INPUTS
      ======================================= */}

      <div className="space-y-4">
        {/* NAME */}

        <div>
          <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
            Full Name
          </label>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <UserIcon size={18} />
            </span>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* EMAIL */}

        <div>
          <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
            Email Address
            <span className="text-neutral-400 font-normal lowercase">
              {" "}
              (cannot be changed)
            </span>
          </label>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Mail size={18} />
            </span>

            <input
              type="email"
              value={currentUser.email || "Not Provided"}
              disabled
              className="w-full pl-10 pr-4 py-3 bg-neutral-100/70 border border-neutral-200 rounded-xl text-neutral-500 text-sm cursor-not-allowed select-none"
            />
          </div>
        </div>

        {/* PHONE */}

        <div>
          <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
            Phone Number
          </label>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <PhoneIcon size={18} />
            </span>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* LOCATION */}

        <div>
          <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
            Location
          </label>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <MapPin size={18} />
            </span>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              placeholder="Enter your location"
            />
          </div>
        </div>
      </div>

      {/* ======================================
          BUTTONS
      ======================================= */}

      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-5 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <X size={16} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-xl font-medium text-sm shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};
