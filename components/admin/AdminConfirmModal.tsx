"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete Record",
  isConfirming = false,
  onConfirm,
  onCancel,
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl text-[#171615] font-light">{title}</h3>
            <p className="text-xs text-[#5A5752] font-light leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECE7DF]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 border border-[#ECE7DF] bg-white text-xs uppercase tracking-wider text-[#5A5752] hover:text-[#171615] hover:bg-[#FAF8F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-red-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-800 transition-colors disabled:opacity-50"
          >
            {isConfirming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
