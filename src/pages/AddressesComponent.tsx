import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  Check,
  Home,
  Briefcase,
  X,
  Loader2,
  Phone as PhoneIcon,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: "Home" | "Work" | "Other";
}

export const AddressesComponent: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      fullName: "Alex Johnson",
      phone: "+1 (555) 234-5678",
      street: "123 Maple Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      isDefault: true,
      type: "Home",
    },
    {
      id: "addr-2",
      fullName: "Alex Johnson",
      phone: "+1 (555) 987-6543",
      street: "456 Corporate Blvd, Suite 900",
      city: "New York",
      state: "NY",
      zipCode: "10022",
      country: "United States",
      isDefault: false,
      type: "Work",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states for new address
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, ] = useState("United States");
  const [type, setType] = useState<"Home" | "Work" | "Other">("Home");

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
    toast.success("Default shipping address updated");
  };

  const handleDelete = (id: string) => {
    const target = addresses.find((a) => a.id === id);
    if (target?.isDefault && addresses.length > 1) {
      toast.error(
        "Please set another address as default before deleting this one.",
      );
      return;
    }
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success("Address deleted successfully");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !zipCode || !phone) {
      return toast.error("Please fill in all required address fields");
    }

    setSaving(true);
    setTimeout(() => {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: addresses.length === 0, // Make default if it's the first one
        type,
      };

      setAddresses([...addresses, newAddress]);
      toast.success("New address added successfully!");
      setSaving(false);
      setIsAdding(false);

      // Reset form
      setFullName("");
      setPhone("");
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
    }, 500);
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
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {/* Add Address Form Modal/Card */}
      {isAdding && (
        <form
          onSubmit={handleAddAddress}
          className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-800">
              Add New Shipping Address
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

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
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
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

          <div className="flex items-center justify-between pt-2">
            {/* Address Type Selector */}
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
                onClick={() => setIsAdding(false)}
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
                Save Address
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Addresses List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`relative bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
              addr.isDefault
                ? "border-emerald-600 ring-1 ring-emerald-600/20"
                : "border-neutral-100 hover:border-neutral-200"
            }`}
          >
            {/* Top Tag & Delete */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-700">
                {addr.type === "Home" && <Home size={12} />}
                {addr.type === "Work" && <Briefcase size={12} />}
                {addr.type === "Other" && <MapPin size={12} />}
                {addr.type}
              </span>

              <button
                onClick={() => handleDelete(addr.id)}
                className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                title="Delete address"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Address Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <UserIcon size={14} className="text-neutral-400 shrink-0" />
                {addr.fullName}
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {addr.street}, {addr.city}, {addr.state} {addr.zipCode},{" "}
                {addr.country}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                <PhoneIcon size={13} className="text-neutral-400 shrink-0" />
                {addr.phone}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              {addr.isDefault ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <Check size={14} /> Default Address
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-semibold text-neutral-600 hover:text-emerald-700 transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
