"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link as LinkIcon, Check } from "lucide-react";
import { apiUploadImage } from "@/lib/api";

interface AdminImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export function AdminImageUpload({
  value,
  onChange,
  label = "Image",
  helperText = "Upload JPEG, PNG, WEBP, or AVIF (max 10MB) or enter URL",
}: AdminImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    const res = await apiUploadImage(file);
    setIsUploading(false);

    if (res.success && res.url) {
      onChange(res.url);
      setUrlInput(res.url);
    } else {
      setError(res.message || "Upload failed. Please try again or specify an image URL.");
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#5A5752] font-medium">
          {label}
        </label>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8C877E]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`cursor-pointer hover:text-[#171615] ${mode === "upload" ? "text-[#171615] font-semibold underline" : ""}`}
          >
            File Upload
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`cursor-pointer hover:text-[#171615] ${mode === "url" ? "text-[#171615] font-semibold underline" : ""}`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-[#ECE7DF] hover:border-[#171615] bg-[#FAF8F5]/60 hover:bg-white p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[100px]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs text-[#5A5752]">
                <Loader2 className="w-4 h-4 animate-spin text-[#171615]" />
                <span>Uploading image to media storage...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-5 h-5 mx-auto text-[#8C877E] stroke-[1.5]" />
                <p className="text-xs text-[#171615] font-medium">Click or drag image file here</p>
                <p className="text-[10px] text-[#8C877E]">{helperText}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. /images/projects/project-01.jpg or https://..."
              className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
            />
            <LinkIcon className="w-3.5 h-3.5 text-[#8C877E] absolute right-3 top-2.5 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-[#171615] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider hover:bg-[#32302D]"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && <p className="text-[11px] text-red-600 font-light">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-white border border-[#ECE7DF]">
          <div className="relative w-12 h-12 bg-[#ECE7DF] shrink-0 overflow-hidden">
            <Image
              src={value}
              alt=""
              fill
              unoptimized
              className="object-cover"
              onError={() => setError("Image preview failed to load.")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono text-[#171615] truncate">{value}</p>
            <p className="text-[10px] text-emerald-700">Image selected</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
            }}
            className="text-[#8C877E] hover:text-red-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
