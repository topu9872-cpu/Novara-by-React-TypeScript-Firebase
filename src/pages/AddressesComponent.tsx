import React, { useEffect, useState } from "react";
import {
  MapPin,
  Trash2,
  Check,
  Home,
  Briefcase,
  X,
  Loader2,
  Phone as PhoneIcon,
  User as UserIcon,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteAddress,
  getAddress,
  saveAddress,
} from "../services/productService";
import type { Address } from "../types/Address";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export const AddressesComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState<"Home" | "Work" | "Other">("Home");

  // --------------------------------
  // Listen for Firebase Auth changes
  // --------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setAddress(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchAddress = async () => {
      try {
        setLoading(true);

        const data = await getAddress(user.uid);

        setAddress(data);
      } catch (error) {
        console.error("Fetch address error:", error);
        toast.error("Failed to load address");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [user?.uid]);

  // --------------------------------
  // Reset form
  // --------------------------------
  const resetForm = () => {
    setFullName("");
    setPhone("");
    setStreet("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("");
    setType("Home");
  };

  // --------------------------------
  // Open Add Form
  // --------------------------------
  const handleOpenAdd = () => {
    resetForm();
    setIsEditing(false);
    setIsAdding(true);
  };

  // --------------------------------
  // Open Edit Form
  // --------------------------------
  const handleEdit = () => {
    if (!address) return;

    setFullName(address.fullName);
    setPhone(address.phone);
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setZipCode(address.zipCode);
    setCountry(address.country);
    setType(address.type);

    setIsEditing(true);
    setIsAdding(true);
  };

  // --------------------------------
  // Save / Update Address
  // --------------------------------
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      return toast.error("User not authenticated");
    }

    if (!fullName || !street || !city || !zipCode || !phone) {
      return toast.error("Please fill in all required address fields");
    }

    setSaving(true);

    try {
      const addressData: Address = {
        id: address?.id ?? `addr-${Date.now()}`,
        uid: user.uid,
        email: user.email ?? undefined,
        displayName: user.displayName ?? undefined,

        fullName,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: true,

        type,

        // Keep original createdAt when editing
        createdAt: address?.createdAt ?? Date.now(),
      };

      await saveAddress(addressData);

      setAddress(addressData);

      toast.success(
        isEditing
          ? "Address updated successfully!"
          : "Address saved successfully!",
      );

      setIsAdding(false);
      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error("Save address error:", error);
      toast.error(
        isEditing ? "Failed to update address" : "Failed to save address",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await deleteAddress(user.uid);

      setAddress(null);

      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Shipping Addresses
          </h2>

          <p className="text-xs text-neutral-500">
            Manage where your packages are delivered.
          </p>
        </div>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form
          onSubmit={handleAddAddress}
          className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          {/* Form Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-800">
              {isEditing ? "Edit Shipping Address" : "Add New Shipping Address"}
            </h3>

            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(false);
                resetForm();
              }}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
                Full Name
              </label>

              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Receiver name"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
                Phone Number
              </label>

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXXXXXXXX"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Country + Street */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
                Country
              </label>

              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoComplete="country-name"
                placeholder="Enter country"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
                Street Address
              </label>

              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House/Apartment, Street name"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* City + State + Zip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
                City
              </label>

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
                State / Province
              </label>

              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold tracking-wider text-neutral-600 uppercase mb-1">
                Zip / Postal Code
              </label>

              <input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Zip code"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Type + Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {(["Home", "Work", "Other"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    type === t
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}

                {isEditing ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={20} className="animate-spin text-emerald-600" />
        </div>
      ) : address ? (
        <div className="flex justify-center">
          <div className="relative w-full max-w-sm text-left bg-white border border-emerald-600 ring-1 ring-emerald-600/20 rounded-2xl p-5 shadow-xs space-y-3">
            {/* Top */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-700">
                {address.type === "Home" && <Home size={12} />}
                {address.type === "Work" && <Briefcase size={12} />}
                {address.type === "Other" && <MapPin size={12} />}

                {address.type}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleEdit}
                  className="text-neutral-400 hover:text-emerald-600 transition-colors p-1"
                  title="Edit address"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={handleDelete}
                  className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                  title="Delete address"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <UserIcon size={14} className="text-neutral-400 shrink-0" />
                {address.fullName}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {address.street}, {address.city}, {address.state}{" "}
                {address.zipCode}, {address.country}
              </p>

              <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                <PhoneIcon size={13} className="text-neutral-400 shrink-0" />
                {address.phone}
              </div>
            </div>

            {/* Created At */}
            <p className="text-[11px] text-neutral-400">
              Added on {new Date(address.createdAt).toLocaleDateString()}
            </p>

            {/* Default */}
            <div className="pt-3 border-t border-neutral-100">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <Check size={14} />
                Default Address
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-white border border-neutral-100 rounded-2xl">
          <MapPin size={20} className="text-neutral-400 mb-3" />

          <h3 className="text-sm font-bold text-neutral-800">
            No Shipping Address
          </h3>

          <p className="text-xs text-neutral-500 mt-1">
            You haven't added a shipping address yet.
          </p>

          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
          >
            Add Address
          </button>
        </div>
      )}
    </div>
  );
};
