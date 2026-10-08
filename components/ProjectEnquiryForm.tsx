"use client";

import React, { useState, useSyncExternalStore, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Upload, X, Loader2, ArrowRight } from "lucide-react";

interface FormDataState {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  propertyType: string;
  projectLocation: string;
  projectArea: string;
  budgetRange: string;
  requirements: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  propertyType?: string;
  projectLocation?: string;
  requirements?: string;
  general?: string;
}

const PROJECT_TYPES = [
  "Interior Design",
  "Architecture",
  "Turnkey Execution",
  "Other",
];

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Office",
  "Shop",
  "Other",
];

const BUDGET_RANGES = [
  "Below ₹5 Lakhs",
  "₹5–10 Lakhs",
  "₹10–25 Lakhs",
  "₹25–50 Lakhs",
  "₹50 Lakhs+",
];

const emptySubscribe = () => () => {};

export function ProjectEnquiryForm() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [formData, setFormData] = useState<FormDataState>({
    fullName: "",
    email: "",
    phone: "",
    projectType: "",
    propertyType: "",
    projectLocation: "",
    projectArea: "",
    budgetRange: "",
    requirements: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear inline error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validExtensions.includes(file.type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
        setErrors((prev) => ({
          ...prev,
          general: "Please select an image in JPG, JPEG, PNG, or WEBP format.",
        }));
        return;
      }
      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone validation (suitable for Indian numbers: 10-15 digits)
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone / WhatsApp number is required.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      newErrors.phone = "Please enter a valid 10-digit phone or WhatsApp number.";
    }

    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type.";
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Please select a property type.";
    }

    if (!formData.projectLocation.trim()) {
      newErrors.projectLocation = "Project location is required.";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Please describe your project requirements.";
    } else if (formData.requirements.trim().length < 10) {
      newErrors.requirements = "Please provide at least 10 characters describing your project.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const data = new FormData();
      data.append("full_name", formData.fullName.trim());
      data.append("email", formData.email.trim());
      data.append("phone", formData.phone.trim());
      data.append("project_type", formData.projectType);
      data.append("property_type", formData.propertyType);
      data.append("project_location", formData.projectLocation.trim());
      if (formData.projectArea) {
        data.append("project_area", formData.projectArea.trim());
      }
      if (formData.budgetRange) {
        data.append("budget_range", formData.budgetRange);
      }
      data.append("requirements", formData.requirements.trim());

      if (selectedFile) {
        data.append("reference_images", selectedFile);
      }

      const res = await fetch("/api/enquiries", {
        method: "POST",
        body: data,
      });

      const result = await res.json().catch(() => null);

      if (res.ok && result?.success) {
        setIsSuccess(true);
      } else if (res.status === 400 && result?.errors) {
        // Map backend field errors to inline errors
        const backendErrors: FormErrors = {};
        if (result.errors.full_name) {
          backendErrors.fullName = Array.isArray(result.errors.full_name)
            ? result.errors.full_name[0]
            : result.errors.full_name;
        }
        if (result.errors.email) {
          backendErrors.email = Array.isArray(result.errors.email)
            ? result.errors.email[0]
            : result.errors.email;
        }
        if (result.errors.phone) {
          backendErrors.phone = Array.isArray(result.errors.phone)
            ? result.errors.phone[0]
            : result.errors.phone;
        }
        if (result.errors.project_type) {
          backendErrors.projectType = Array.isArray(result.errors.project_type)
            ? result.errors.project_type[0]
            : result.errors.project_type;
        }
        if (result.errors.property_type) {
          backendErrors.propertyType = Array.isArray(result.errors.property_type)
            ? result.errors.property_type[0]
            : result.errors.property_type;
        }
        if (result.errors.project_location) {
          backendErrors.projectLocation = Array.isArray(result.errors.project_location)
            ? result.errors.project_location[0]
            : result.errors.project_location;
        }
        if (result.errors.requirements) {
          backendErrors.requirements = Array.isArray(result.errors.requirements)
            ? result.errors.requirements[0]
            : result.errors.requirements;
        }
        if (result.errors.reference_images) {
          backendErrors.general = Array.isArray(result.errors.reference_images)
            ? result.errors.reference_images[0]
            : result.errors.reference_images;
        }

        if (Object.keys(backendErrors).length === 0) {
          backendErrors.general = "Something went wrong. Please try again.";
        }
        setErrors(backendErrors);
      } else {
        setErrors({
          general: "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setErrors({
        general: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      projectType: "",
      propertyType: "",
      projectLocation: "",
      projectArea: "",
      budgetRange: "",
      requirements: "",
    });
    setSelectedFile(null);
    setErrors({});
    setIsSuccess(false);
  };

  // SSR SKELETON (Prevents extension-induced hydration mismatch on input fields)
  if (!isMounted) {
    return (
      <div className="bg-white border border-[#ECE7DF] p-6 sm:p-10 space-y-8 animate-pulse" suppressHydrationWarning>
        <div className="space-y-2 border-b border-[#ECE7DF] pb-5">
          <div className="h-2.5 w-24 bg-[#ECE7DF]" />
          <div className="h-7 w-44 bg-[#ECE7DF]" />
          <div className="h-3.5 w-72 bg-[#ECE7DF]" />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-1.5" suppressHydrationWarning>
              <div className="h-3 w-20 bg-[#ECE7DF]" />
              <div className="w-full h-10 bg-[#FAF8F5] border border-[#ECE7DF]" />
            </div>
            <div className="space-y-1.5" suppressHydrationWarning>
              <div className="h-3 w-24 bg-[#ECE7DF]" />
              <div className="w-full h-10 bg-[#FAF8F5] border border-[#ECE7DF]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-1.5" suppressHydrationWarning>
              <div className="h-3 w-28 bg-[#ECE7DF]" />
              <div className="w-full h-10 bg-[#FAF8F5] border border-[#ECE7DF]" />
            </div>
            <div className="space-y-1.5" suppressHydrationWarning>
              <div className="h-3 w-24 bg-[#ECE7DF]" />
              <div className="w-full h-10 bg-[#FAF8F5] border border-[#ECE7DF]" />
            </div>
          </div>
          <div className="space-y-1.5" suppressHydrationWarning>
            <div className="h-3 w-32 bg-[#ECE7DF]" />
            <div className="w-full h-24 bg-[#FAF8F5] border border-[#ECE7DF]" />
          </div>
          <div className="pt-2">
            <div className="w-48 h-12 bg-[#171615]" />
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="bg-white border border-[#ECE7DF] p-8 sm:p-12 space-y-6 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-full bg-[#171615] text-[#FAF8F5] flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#8C877E] font-medium">
            Enquiry Received
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171615] font-light">
            Thank you for contacting DESIGN TEMPTATION.
          </h2>
        </div>

        <div className="text-sm sm:text-base text-[#5A5752] font-light leading-relaxed space-y-3 border-t border-[#ECE7DF] pt-5">
          <p>
            Your project enquiry has been received. Our team will review your requirements and get back to you.
          </p>
          <p className="text-xs text-[#8C877E]">
            A design director will review your architectural parameters and connect via phone or
            email within 1–2 business days.
          </p>
        </div>

        <div className="pt-4 border-t border-[#ECE7DF] flex flex-wrap gap-3 items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#171615] text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#32302D] transition-colors"
          >
            <span>BACK TO HOME</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#ECE7DF] text-[#171615] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#FAF8F5] transition-colors"
          >
            <span>Submit Another Enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#ECE7DF] p-6 sm:p-10 space-y-8" suppressHydrationWarning>
      {/* Form Header */}
      <div className="space-y-2 border-b border-[#ECE7DF] pb-5">
        <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.24em] uppercase text-[#8C877E] font-medium">
          <span>Project Brief</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#171615] font-light">
          Project Enquiry
        </h2>
        <p className="text-xs sm:text-sm text-[#5A5752] font-light leading-relaxed">
          Provide your project specifics below. Every submission is reviewed directly by our design
          partners.
        </p>
      </div>

      {/* General Error Banner */}
      {errors.general && (
        <div className="p-4 bg-[#FBF2F0] border border-[#E8C4BE] text-[#9A2D1F] text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6" suppressHydrationWarning>
        {/* ROW 1: Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Full Name */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="fullName"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Full Name <span className="text-[#9A2D1F]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Rahul Verma"
              className={`w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border text-base sm:text-sm text-[#171615] placeholder-[#A39E95] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] ${
                errors.fullName ? "border-[#9A2D1F]" : "border-[#ECE7DF]"
              }`}
            />
            {errors.fullName && (
              <p className="text-xs sm:text-[11px] text-[#9A2D1F] tracking-wide mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* 2. Email */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="email"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Email Address <span className="text-[#9A2D1F]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. rahul@example.com"
              className={`w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border text-base sm:text-sm text-[#171615] placeholder-[#A39E95] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] ${
                errors.email ? "border-[#9A2D1F]" : "border-[#ECE7DF]"
              }`}
            />
            {errors.email && (
              <p className="text-xs sm:text-[11px] text-[#9A2D1F] tracking-wide mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* ROW 2: Phone & Project Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* 3. Phone / WhatsApp */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="phone"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Phone / WhatsApp <span className="text-[#9A2D1F]">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              className={`w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border text-base sm:text-sm text-[#171615] placeholder-[#A39E95] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] ${
                errors.phone ? "border-[#9A2D1F]" : "border-[#ECE7DF]"
              }`}
            />
            {errors.phone && (
              <p className="text-xs sm:text-[11px] text-[#9A2D1F] tracking-wide mt-1">{errors.phone}</p>
            )}
          </div>

          {/* 6. Project Location */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="projectLocation"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Project Location <span className="text-[#9A2D1F]">*</span>
            </label>
            <input
              type="text"
              id="projectLocation"
              name="projectLocation"
              value={formData.projectLocation}
              onChange={handleInputChange}
              placeholder="e.g. Koramangala, Bengaluru"
              className={`w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border text-base sm:text-sm text-[#171615] placeholder-[#A39E95] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] ${
                errors.projectLocation ? "border-[#9A2D1F]" : "border-[#ECE7DF]"
              }`}
            />
            {errors.projectLocation && (
              <p className="text-xs sm:text-[11px] text-[#9A2D1F] tracking-wide mt-1">
                {errors.projectLocation}
              </p>
            )}
          </div>
        </div>

        {/* ROW 3: Project Type & Property Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* 4. Project Type */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="projectType"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Project Type <span className="text-[#9A2D1F]">*</span>
            </label>
            <div className="relative">
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className={`w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border text-base sm:text-sm text-[#171615] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] appearance-none ${
                  errors.projectType ? "border-[#9A2D1F]" : "border-[#ECE7DF]"
                }`}
              >
                <option value="">Select Project Scope</option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5A5752]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.projectType && (
              <p className="text-xs sm:text-[11px] text-[#9A2D1F] tracking-wide mt-1">{errors.projectType}</p>
            )}
          </div>

          {/* 5. Property Type */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="propertyType"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Property Type <span className="text-[#9A2D1F]">*</span>
            </label>
            <div className="relative">
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className={`w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border text-base sm:text-sm text-[#171615] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] appearance-none ${
                  errors.propertyType ? "border-[#9A2D1F]" : "border-[#ECE7DF]"
                }`}
              >
                <option value="">Select Property Typology</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5A5752]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.propertyType && (
              <p className="text-xs sm:text-[11px] text-[#9A2D1F] tracking-wide mt-1">
                {errors.propertyType}
              </p>
            )}
          </div>
        </div>

        {/* ROW 4: Approximate Area & Budget Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* 7. Approximate Project Area */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="projectArea"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Approx. Area (sq.ft) <span className="text-[#8C877E] font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              id="projectArea"
              name="projectArea"
              value={formData.projectArea}
              onChange={handleInputChange}
              min="100"
              step="50"
              placeholder="e.g. 2400"
              className="w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border border-[#ECE7DF] text-base sm:text-sm text-[#171615] placeholder-[#A39E95] transition-colors focus:bg-white focus:outline-none focus:border-[#171615]"
            />
          </div>

          {/* 8. Budget Range */}
          <div className="space-y-1.5" suppressHydrationWarning>
            <label
              htmlFor="budgetRange"
              className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
            >
              Budget Range <span className="text-[#8C877E] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                className="w-full px-3.5 py-3 sm:py-2.5 bg-[#FAF8F5] border border-[#ECE7DF] text-base sm:text-sm text-[#171615] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] appearance-none"
              >
                <option value="">Select Anticipated Investment</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5A5752]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Project Requirements */}
        <div className="space-y-1.5" suppressHydrationWarning>
          <label
            htmlFor="requirements"
            className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
          >
            Project Requirements <span className="text-[#9A2D1F]">*</span>
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows={4}
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Tell us briefly about your project, requirements, preferred style, timeline, etc."
            className={`w-full p-3.5 bg-[#FAF8F5] border text-base sm:text-sm text-[#171615] placeholder-[#A39E95] transition-colors focus:bg-white focus:outline-none focus:border-[#171615] resize-y ${
              errors.requirements ? "border-[#9A2D1F]" : "border-[#ECE7DF]"
            }`}
          />
          {errors.requirements && (
            <p className="text-xs sm:text-[11px] text-[#9A2D1F] tracking-wide mt-1">{errors.requirements}</p>
          )}
        </div>

        {/* 10. Reference Images (Optional) */}
        <div className="space-y-2" suppressHydrationWarning>
          <label
            htmlFor="referenceImages"
            className="block text-[13px] sm:text-xs font-sans uppercase tracking-[0.14em] sm:tracking-[0.15em] text-[#171615] font-semibold"
          >
            Reference Images <span className="text-[#8C877E] font-normal">(Optional)</span>
          </label>

          {!selectedFile ? (
            <div className="relative border border-dashed border-[#D2CCC2] p-5 sm:p-6 text-center bg-[#FAF8F5] hover:bg-[#F4F1EA] transition-colors cursor-pointer group">
              <input
                type="file"
                id="referenceImages"
                name="referenceImages"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                <Upload className="w-5 h-5 text-[#8C877E] group-hover:text-[#171615] transition-colors stroke-[1.5]" />
                <p className="text-xs text-[#171615] font-medium">
                  Upload architectural drawings, floor plans, or moodboard images
                </p>
                <p className="text-[11px] text-[#8C877E]">
                  Accepted formats: JPG, JPEG, PNG, WEBP (Max 15MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] border border-[#ECE7DF]">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 bg-[#ECE7DF] flex items-center justify-center flex-shrink-0 text-[10px] uppercase font-bold text-[#5A5752]">
                  IMG
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-[#171615] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-[#8C877E]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeSelectedFile}
                className="p-1.5 text-[#8C877E] hover:text-[#9A2D1F] transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full sm:w-auto !h-[48px] !min-h-[48px] !px-9 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SUBMITTING...</span>
              </>
            ) : (
              <>
                <span>SUBMIT ENQUIRY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
