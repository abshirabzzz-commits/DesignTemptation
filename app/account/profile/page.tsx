"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { User, Phone, MapPin, Mail, CheckCircle2, AlertCircle, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, openAuthModal, updateProfile, logout } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      if (user.profile) {
        setPhone(user.profile.phone || "");
        setAddress(user.profile.delivery_address || "");
        if (user.profile.city) setCity(user.profile.city);
        if (user.profile.state) setState(user.profile.state);
        if (user.profile.postal_code) setPostalCode(user.profile.postal_code);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone,
      delivery_address: address,
      city,
      state,
      postal_code: postalCode,
    };

    const res = await updateProfile(payload);
    setIsSaving(false);

    if (res.success) {
      setSuccessMessage("Your profile information has been safely updated.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(res.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 space-y-8">
          {/* Header Title */}
          <div className="space-y-2 border-b border-[#ECE7DF] pb-6">
            <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-[#8C877E] font-medium">
              Account Management
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171615] font-light">
              Profile &amp; Settings
            </h1>
          </div>

          {!isAuthenticated ? (
            <div className="p-12 text-center border border-[#ECE7DF] bg-white space-y-4">
              <User className="w-8 h-8 text-[#8C877E] mx-auto stroke-[1.2]" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#171615]">Sign in to manage your profile</h2>
                <p className="text-xs text-[#5A5752] font-light">
                  Update your contact details and default white-glove delivery address.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="btn-primary !h-11 text-xs font-semibold tracking-[0.16em] uppercase px-8"
              >
                Sign In / Register
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#ECE7DF] p-7 sm:p-8 space-y-6">
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email (Read-only identifier) */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8C877E]">Verified Account Email</p>
                  <p className="font-medium text-[#171615]">{user?.email}</p>
                </div>
                <Mail className="w-4 h-4 text-[#8C877E]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2.5 text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2.5 text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2.5 pl-9 text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                    />
                    <Phone className="w-4 h-4 text-[#8C877E] absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#ECE7DF]">
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#171615]">
                    Default Delivery Address
                  </p>
                  <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                    Street Address &amp; Suite / Villa
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Penthouse 14B, Kingfisher Towers"
                    className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2.5 text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs text-[#171615]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs text-[#171615]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs text-[#171615]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary !h-11 text-xs font-semibold tracking-[0.16em] uppercase px-8"
                  >
                    {isSaving ? "Saving Preferences..." : "Save Profile"}
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 tracking-wider uppercase font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
