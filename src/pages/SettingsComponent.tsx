import React, { useState, useEffect } from "react";
import { type User, signOut, onAuthStateChanged } from "firebase/auth";
import {
  User as UserIcon,
  Bell,
  LogOut,
  ChevronRight,
  KeyRound,
  Package,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { auth } from "../firebase/firebase";
import { PasswordResetModal } from "./PasswordResetModal";

interface Props {
  currentUser?: User | null;
  onOpenEditProfile?: () => void;
  onClose?: () => void;
}

export const SettingsComponent: React.FC<Props> = ({
  currentUser: propUser,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(
    propUser || auth.currentUser,
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  useEffect(() => {
    if (!propUser) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    }
  }, [propUser]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900">
          Account & Settings
        </h2>
        <p className="text-xs text-neutral-500">
          Manage your orders, payment methods, security, and preferences.
        </p>
      </div>

      {/* Profile Shortcut Card */}
      <NavLink
        to={"/profile"}
        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-neutral-100 shadow-xs hover:border-emerald-600/30 cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserIcon size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-800 group-hover:text-emerald-700 transition-colors">
              {currentUser?.displayName || "My Profile"}
            </p>
            <p className="text-xs text-neutral-500">
              {currentUser?.email || "Update personal details"}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-neutral-400 group-hover:translate-x-0.5 transition-transform"
        />
      </NavLink>

      {/* Shopping & Orders Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          Shopping & Activity
        </h3>

        <div className="bg-white border border-neutral-100 rounded-2xl shadow-xs divide-y divide-neutral-100">
          <div
            onClick={() => navigate("/orders")}
            className="flex items-center justify-between p-4 hover:bg-neutral-50/50 cursor-pointer transition-colors first:rounded-t-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                <Package size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  My Orders
                </p>
                <p className="text-xs text-neutral-500">
                  Track, return, or buy things again
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-neutral-400" />
          </div>

          <div
            onClick={() => navigate("/addresses")}
            className="flex items-center justify-between p-4 hover:bg-neutral-50/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Shipping Addresses
                </p>
                <p className="text-xs text-neutral-500">
                  Manage delivery locations
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          Security & Login
        </h3>

        <div className="bg-white border border-neutral-100 rounded-2xl shadow-xs p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <KeyRound size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Password Reset
              </p>
              <p className="text-xs text-neutral-500">
                Send a link to update password
              </p>
            </div>
          </div>
        
        <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>


      <PasswordResetModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentUser={currentUser}
      />
     
     

    <div/>
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          Preferences
        </h3>

        <div className="bg-white border border-neutral-100 rounded-2xl shadow-xs divide-y divide-neutral-100">
          {/* Email Notification Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Email Alerts
                </p>
                <p className="text-xs text-neutral-500">
                  Order updates and promotional offers
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={() => setEmailNotif(!emailNotif)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* SMS Notification Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  SMS Tracking Alerts
                </p>
                <p className="text-xs text-neutral-500">
                  Get text messages when out for delivery
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotif}
                onChange={() => setSmsNotif(!smsNotif)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Support & Legal Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          Support
        </h3>

        <div
          className="bg-white border border-neutral-100 rounded-2xl shadow-xs p-4 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition-colors"
          onClick={() => navigate("/support")}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Help Center & FAQ
              </p>
              <p className="text-xs text-neutral-500">
                Contact customer support or read guides
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </div>
      </div>

      {/* Session / Logout Section */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition-colors shadow-xs"
        >
          <LogOut size={16} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
};
