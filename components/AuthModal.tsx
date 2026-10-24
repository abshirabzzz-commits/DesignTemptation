"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { X, Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { apiRequestPasswordReset, apiConfirmPasswordReset } from "@/lib/api";

export function AuthModal() {
  const { isAuthModalOpen, authModalTab, authModalMessage, closeAuthModal, login, register, loginWithGoogle } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Forgot password flow
  const [resetSent, setResetSent] = useState(false);
  const [resetUid, setResetUid] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authModalTab);
      setErrorMessage(null);
      setFieldErrors({});
      setSuccessMessage(null);
      setResetSent(false);
      setResetSuccess(false);
    }
  }, [isAuthModalOpen, authModalTab]);

  // Handle Google Identity Services script
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const scriptId = "google-jssdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleButton;
      document.body.appendChild(script);
    } else {
      initializeGoogleButton();
    }

    function initializeGoogleButton() {
      if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsSubmitting(true);
              setErrorMessage(null);
              const result = await loginWithGoogle(response.credential);
              setIsSubmitting(false);
              if (!result.success) {
                setErrorMessage(result.message || "Google sign-in could not be completed.");
              }
            }
          },
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = "";
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: tab === "signup" ? "signup_with" : "signin_with",
            shape: "rectangular",
          });
        }
      }
    }
  }, [isAuthModalOpen, tab, loginWithGoogle]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);

    if (tab === "signin") {
      const res = await login(email, password);
      setIsSubmitting(false);
      if (!res.success) {
        let msg = res.message || "Invalid email or password.";
        if (res.errors) {
          if (res.errors.non_field_errors?.[0]) {
            msg = res.errors.non_field_errors[0];
          } else if (res.errors.detail) {
            msg = res.errors.detail;
          } else if (res.errors.email?.[0]) {
            msg = res.errors.email[0];
          } else if (res.errors.password?.[0]) {
            msg = res.errors.password[0];
          }
          setFieldErrors(res.errors);
        }
        setErrorMessage(msg);
      }
    } else if (tab === "signup") {
      const res = await register(name, email, password, phone);
      setIsSubmitting(false);
      if (!res.success) {
        let msg = res.message || "Unable to create account. Please check the fields.";
        if (res.errors) {
          if (res.errors.email?.[0]) {
            msg = res.errors.email[0];
          } else if (res.errors.password?.[0]) {
            msg = res.errors.password[0];
          } else if (res.errors.name?.[0]) {
            msg = res.errors.name[0];
          } else if (res.errors.non_field_errors?.[0]) {
            msg = res.errors.non_field_errors[0];
          } else if (res.errors.detail) {
            msg = res.errors.detail;
          }
          setFieldErrors(res.errors);
        }
        setErrorMessage(msg);
      }
    } else if (tab === "forgot") {
      if (!resetSent) {
        const res = await apiRequestPasswordReset(email);
        setIsSubmitting(false);
        if (res.success) {
          setResetSent(true);
          setSuccessMessage(res.message || "Password reset instructions have been dispatched.");
        } else {
          setErrorMessage(res.message || "Failed to process reset request.");
        }
      } else {
        const res = await apiConfirmPasswordReset({
          uid: resetUid,
          token: resetToken,
          new_password: newPassword,
        });
        setIsSubmitting(false);
        if (res.success) {
          setResetSuccess(true);
          setSuccessMessage("Your password has been updated. You may now sign in.");
          setTimeout(() => setTab("signin"), 2000);
        } else {
          setErrorMessage(res.message || "Failed to reset password. Please check the token.");
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#ECE7DF] shadow-2xl p-7 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-[#8C877E] hover:text-[#171615] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171615]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#8C877E] font-medium">
            DESIGN TEMPTATION
          </p>
          <h2 id="auth-modal-title" className="font-serif text-2xl sm:text-3xl text-[#171615] font-light">
            {tab === "signin" && "Client Sign In"}
            {tab === "signup" && "Create Atelier Account"}
            {tab === "forgot" && "Account Recovery"}
          </h2>
          <p className="text-xs text-[#5A5752] font-light">
            {tab === "signin" && "Access your orders, bespoke cart, and saved wishlist."}
            {tab === "signup" && "Join our atelier to save private curation and track acquisitions."}
            {tab === "forgot" && "Enter your email to receive recovery instructions."}
          </p>
        </div>

        {/* Tab Switcher (When not in forgot password) */}
        {tab !== "forgot" && (
          <div className="flex border-b border-[#ECE7DF] text-xs uppercase tracking-[0.16em]">
            <button
              type="button"
              onClick={() => {
                setTab("signin");
                setErrorMessage(null);
                setFieldErrors({});
              }}
              className={`flex-1 py-2.5 text-center transition-colors font-medium border-b-2 ${
                tab === "signin"
                  ? "border-[#171615] text-[#171615]"
                  : "border-transparent text-[#8C877E] hover:text-[#171615]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setErrorMessage(null);
                setFieldErrors({});
              }}
              className={`flex-1 py-2.5 text-center transition-colors font-medium border-b-2 ${
                tab === "signup"
                  ? "border-[#171615] text-[#171615]"
                  : "border-transparent text-[#8C877E] hover:text-[#171615]"
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Informational Prompt Message */}
        {authModalMessage && (
          <div className="p-3 bg-[#FAF8F5] border border-[#ECE7DF] text-[#171615] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#8C877E] shrink-0" />
            <span className="font-medium text-[#171615]">{authModalMessage}</span>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google OAuth Button Container */}
        {tab !== "forgot" && (
          <div className="space-y-4">
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[40px]">
              {/* Fallback button when Google script isn't loaded */}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("Google Sign-in is available in production when NEXT_PUBLIC_GOOGLE_CLIENT_ID is configured.");
                }}
                className="w-full h-10 border border-[#ECE7DF] bg-white hover:bg-[#F3EFEA] text-[#171615] text-xs tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#ECE7DF] w-full" />
              <span className="bg-[#FAF8F5] px-3 text-[10px] uppercase tracking-widest text-[#8C877E]">
                or email
              </span>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Sethi"
                  className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2.5 pl-9 text-xs text-[#171615] focus:outline-none focus:border-[#171615] transition-colors"
                />
                <User className="w-4 h-4 text-[#8C877E] absolute left-3 top-3 stroke-[1.5]" />
              </div>
              {fieldErrors.name && (
                <p className="text-[10px] text-red-600">{fieldErrors.name[0]}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2.5 pl-9 text-xs text-[#171615] focus:outline-none focus:border-[#171615] transition-colors"
              />
              <Mail className="w-4 h-4 text-[#8C877E] absolute left-3 top-3 stroke-[1.5]" />
            </div>
            {fieldErrors.email && (
              <p className="text-[10px] text-red-600">{fieldErrors.email[0]}</p>
            )}
          </div>

          {tab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                Phone / WhatsApp (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2.5 pl-9 text-xs text-[#171615] focus:outline-none focus:border-[#171615] transition-colors"
                />
                <Phone className="w-4 h-4 text-[#8C877E] absolute left-3 top-3 stroke-[1.5]" />
              </div>
            </div>
          )}

          {tab !== "forgot" && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                  Password
                </label>
                {tab === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("forgot");
                      setErrorMessage(null);
                    }}
                    className="text-[10px] uppercase tracking-wider text-[#8C877E] hover:text-[#171615] transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2.5 pl-9 pr-9 text-xs text-[#171615] focus:outline-none focus:border-[#171615] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#8C877E] absolute left-3 top-3 stroke-[1.5]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#8C877E] hover:text-[#171615]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.5]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.5]" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-red-600">{fieldErrors.password[0]}</p>
              )}
            </div>
          )}

          {/* If resetting password with token */}
          {tab === "forgot" && resetSent && !resetSuccess && (
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                  Reset UID
                </label>
                <input
                  type="text"
                  required
                  value={resetUid}
                  onChange={(e) => setResetUid(e.target.value)}
                  placeholder="UID from reset link"
                  className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2.5 text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Security token"
                  className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2.5 text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#5A5752] font-medium block">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2.5 text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full !h-11 text-xs font-semibold tracking-[0.16em] uppercase disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <span>
                {tab === "signin" && "Sign In"}
                {tab === "signup" && "Create Account"}
                {tab === "forgot" && (!resetSent ? "Request Reset Link" : "Update Password")}
              </span>
            )}
          </button>
        </form>

        {/* Back to sign in if in forgot password */}
        {tab === "forgot" && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setTab("signin");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs uppercase tracking-wider text-[#8C877E] hover:text-[#171615] transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
