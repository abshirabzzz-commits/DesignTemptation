import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, ExternalLink, Navigation } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BRAND } from "@/data/content";
import { ProjectEnquiryForm } from "@/components/ProjectEnquiryForm";

export const metadata: Metadata = {
  title: "Contact Atelier",
  description:
    "Contact DESIGN TEMPTATION atelier in Bengaluru for residential, commercial, and architectural commissions. Located at 101, Halasahalli Rd, Kavery Nagar, Bengaluru.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Atelier | DESIGN TEMPTATION",
    description:
      "Commence a project dialogue for residential and commercial commissions. Atelier located in Bengaluru, Karnataka, India.",
    url: "/contact",
    images: [
      {
        url: "/images/studio/studio-atelier.jpg",
        width: 1600,
        height: 900,
        alt: "DESIGN TEMPTATION Studio Atelier in Bengaluru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Atelier | DESIGN TEMPTATION",
    description:
      "Commence a project dialogue for residential and commercial commissions. Atelier located in Bengaluru, Karnataka, India.",
    images: ["/images/studio/studio-atelier.jpg"],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 space-y-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C877E] hover:text-[#171615] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          <div className="border-b border-[#ECE7DF] pb-8 space-y-3">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#8C877E] font-medium">
              Commence A Dialogue
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#171615] font-light">
              CONTACT THE ATELIER
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-[#5A5752] font-light leading-relaxed">
              We welcome enquiries for residential, commercial, and architectural commissions across
              Bengaluru and pan-India. Share your project brief below to initiate dialogue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left: Atelier Official Location & Information */}
            <div className="lg:col-span-5 space-y-8">
              {/* Studio Brand & Official Address */}
              <div className="space-y-4 p-6 bg-white border border-[#ECE7DF]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C877E]">
                  <MapPin className="w-4 h-4 stroke-[1.5] text-[#171615]" />
                  <span>Official Atelier Location</span>
                </div>

                <div className="space-y-1">
                  <h2 className="font-sans text-sm font-semibold tracking-[0.16em] uppercase text-[#171615]">
                    {BRAND.name}
                  </h2>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-[#8C877E]">
                    {BRAND.tagline}
                  </p>
                </div>

                <address className="not-italic text-sm text-[#32302D] font-light leading-relaxed border-t border-[#ECE7DF] pt-3 space-y-0.5">
                  <p className="font-normal text-[#171615]">101, Halasahalli Rd,</p>
                  <p>Kavery Nagar,</p>
                  <p>Bengaluru,</p>
                  <p>Karnataka 560087,</p>
                  <p>India</p>
                </address>

                {/* Google Maps Actions */}
                <div className="pt-3 border-t border-[#ECE7DF] flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={BRAND.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary group !px-4 !text-[11px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View on Google Maps</span>
                  </a>
                  <a
                    href={BRAND.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary group !px-4 !text-[11px]"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>

              {/* Direct Inquiries */}
              <div className="space-y-4 p-6 bg-white border border-[#ECE7DF]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C877E]">
                    <Mail className="w-4 h-4 stroke-[1.5]" />
                    <span>Direct Inquiries</span>
                  </div>
                  <p className="text-sm text-[#171615]">
                    <a href={`mailto:${BRAND.email}`} className="editorial-link">
                      {BRAND.email}
                    </a>
                  </p>
                </div>

                <div className="space-y-2 border-t border-[#ECE7DF] pt-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C877E]">
                    <Phone className="w-4 h-4 stroke-[1.5]" />
                    <span>Telephone & WhatsApp</span>
                  </div>
                  <p className="text-sm text-[#5A5752]">{BRAND.phone}</p>
                </div>
              </div>

              {/* Consultation Note */}
              <div className="p-6 bg-[#F4F1EA] border border-[#ECE7DF] space-y-3">
                <h3 className="font-serif text-lg text-[#171615]">Commissioning Notes</h3>
                <p className="text-xs text-[#5A5752] font-light leading-relaxed">
                  We undertake comprehensive architectural, interior, and turnkey residential
                  projects. For immediate consultation, feel free to submit the project brief or reach
                  out directly.
                </p>
              </div>
            </div>

            {/* Right: Functional Project Enquiry Form */}
            <div className="lg:col-span-7">
              <ProjectEnquiryForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
