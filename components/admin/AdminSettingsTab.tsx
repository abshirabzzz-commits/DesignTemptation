"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Globe,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";
import { SiteSettingsData } from "@/types";
import { apiGetSiteSettings, apiUpdateSiteSettings } from "@/lib/api";

interface AdminSettingsTabProps {
  onNotification: (type: "success" | "error", message: string) => void;
}

export function AdminSettingsTab({ onNotification }: AdminSettingsTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [studioName, setStudioName] = useState("DESIGN TEMPTATION");
  const [tagline, setTagline] = useState("INTERIORS & ARCHITECTURE");
  const [email, setEmail] = useState("enquiries@designtemptation.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [addressLine1, setAddressLine1] = useState("101, Halasahalli Rd, Kavery Nagar");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("560087");
  const [country, setCountry] = useState("India");
  const [heroHeading, setHeroHeading] = useState("SPATIAL POETRY IN FORM & LIGHT");
  const [heroSubheading, setHeroSubheading] = useState(
    "An interior architecture and design atelier in Bengaluru creating quiet, contemplative sanctuaries of monumental tactility, natural light, and bespoke joinery."
  );
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/designtemptation");
  const [mapsUrl, setMapsUrl] = useState("https://maps.app.goo.gl/JMVT86tY1W3Zc6e79?g_st=iw");

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const res: any = await apiGetSiteSettings();
      setIsLoading(false);
      const d = res?.data || res;
      if (d) {
        if (d.studio_name) setStudioName(d.studio_name);
        if (d.tagline) setTagline(d.tagline);
        if (d.email) setEmail(d.email);
        if (d.phone) setPhone(d.phone);
        if (d.address_line1) setAddressLine1(d.address_line1);
        if (d.city) setCity(d.city);
        if (d.state) setState(d.state);
        if (d.postal_code) setPostalCode(d.postal_code);
        if (d.country) setCountry(d.country);
        if (d.hero_heading) setHeroHeading(d.hero_heading);
        if (d.hero_subheading) setHeroSubheading(d.hero_subheading);
        if (d.instagram_url) setInstagramUrl(d.instagram_url);
        if (d.maps_url) setMapsUrl(d.maps_url);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      studio_name: studioName.trim(),
      tagline: tagline.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address_line1: addressLine1.trim(),
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
      country: country.trim(),
      hero_heading: heroHeading.trim(),
      hero_subheading: heroSubheading.trim(),
      instagram_url: instagramUrl.trim(),
      maps_url: mapsUrl.trim(),
    };

    const res = await apiUpdateSiteSettings(payload);
    setIsSaving(false);

    if (res.success) {
      onNotification("success", "Studio brand coordinates and website settings saved.");
    } else {
      onNotification("error", res.message || "Failed to update studio settings.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#171615] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-[#8C877E]">
          Loading studio settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-[#ECE7DF] pb-5">
        <h2 className="font-serif text-2xl text-[#171615] font-light">
          Studio Identity &amp; Website Settings
        </h2>
        <p className="text-xs text-[#5A5752] font-light">
          Manage brand copy, homepage hero headlines, contact coordinates, and social media channels.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECTION 1: HOMEPAGE HERO CONTENT */}
        <div className="bg-white border border-[#ECE7DF] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ECE7DF] pb-3">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <h3 className="font-serif text-lg text-[#171615] font-light">
              Homepage Hero Curation
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Hero Headline *
              </label>
              <input
                type="text"
                required
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="SPATIAL POETRY IN FORM & LIGHT"
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none focus:border-[#171615] font-serif uppercase tracking-wider"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Hero Narrative Narrative *
              </label>
              <textarea
                rows={3}
                required
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                placeholder="An interior architecture and design atelier in Bengaluru creating quiet, contemplative sanctuaries..."
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] p-3 text-xs focus:outline-none focus:border-[#171615] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: STUDIO BRAND IDENTITY */}
        <div className="bg-white border border-[#ECE7DF] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ECE7DF] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#8C877E]" />
            <h3 className="font-serif text-lg text-[#171615] font-light">
              Official Brand Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Studio Name *
              </label>
              <input
                type="text"
                required
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none focus:border-[#171615]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Tagline *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none focus:border-[#171615]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CONTACT & PHYSICAL LOCATION */}
        <div className="bg-white border border-[#ECE7DF] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ECE7DF] pb-3">
            <MapPin className="w-4 h-4 text-[#8C877E]" />
            <h3 className="font-serif text-lg text-[#171615] font-light">
              Contact &amp; Atelier Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Inquiry Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none focus:border-[#171615]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none focus:border-[#171615]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
              Studio Street Address
            </label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none focus:border-[#171615]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                PIN Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SOCIAL CHANNELS & MAPS */}
        <div className="bg-white border border-[#ECE7DF] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ECE7DF] pb-3">
            <Globe className="w-4 h-4 text-[#8C877E]" />
            <h3 className="font-serif text-lg text-[#171615] font-light">
              Digital Channels &amp; Map Coordinates
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Instagram Profile Link
              </label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/designtemptation"
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                Google Maps Atelier Destination URL
              </label>
              <input
                type="text"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full bg-[#FAF8F5] border border-[#ECE7DF] px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#171615] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#32302D] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Atelier Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
