"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Loader2,
  X,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { AdminServiceRecord } from "@/types";
import { AdminImageUpload } from "./AdminImageUpload";
import { AdminConfirmModal } from "./AdminConfirmModal";
import {
  apiCreateService,
  apiUpdateService,
  apiDeleteService,
} from "@/lib/api";

interface AdminServicesTabProps {
  services: AdminServiceRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onNotification: (type: "success" | "error", message: string) => void;
}

export function AdminServicesTab({
  services,
  isLoading,
  onRefresh,
  onNotification,
}: AdminServicesTabProps) {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminServiceRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [disciplinesText, setDisciplinesText] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  // Delete State
  const [serviceToDelete, setServiceToDelete] = useState<AdminServiceRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle("");
    setSlug("");
    setSubtitle("");
    setDescription("");
    setImage("");
    setDisciplinesText("");
    setOrder(services.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (serv: AdminServiceRecord) => {
    setEditingService(serv);
    setTitle(serv.title);
    setSlug(serv.slug);
    setSubtitle(serv.subtitle || "");
    setDescription(serv.description || "");
    setImage(serv.image || "");
    setDisciplinesText(Array.isArray(serv.disciplines) ? serv.disciplines.join(", ") : "");
    setOrder(serv.order || 1);
    setIsActive(serv.is_active !== false);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (serv: AdminServiceRecord) => {
    const res = await apiUpdateService(serv.id || serv.slug, {
      is_active: !serv.is_active,
    });
    if (res.success) {
      onNotification(
        "success",
        !serv.is_active ? `Service "${serv.title}" is now active.` : `Service "${serv.title}" is now hidden.`
      );
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to update service status.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      onNotification("error", "Please provide a title and image for this service offering.");
      return;
    }

    const disciplinesArray = disciplinesText
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      subtitle: subtitle.trim(),
      description: description.trim(),
      image: image.trim(),
      image_alt: title.trim(),
      disciplines: disciplinesArray,
      order: Number(order),
      is_active: isActive,
    };

    let res;
    if (editingService) {
      res = await apiUpdateService(editingService.id || editingService.slug, payload);
    } else {
      res = await apiCreateService(payload);
    }
    setIsSaving(false);

    if (res.success) {
      onNotification(
        "success",
        editingService ? `Service "${title}" updated.` : `New service "${title}" created.`
      );
      setIsModalOpen(false);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to save service.");
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    const res = await apiDeleteService(serviceToDelete.id || serviceToDelete.slug);
    setIsDeleting(false);

    if (res.success) {
      onNotification("success", `Service "${serviceToDelete.title}" deleted.`);
      setServiceToDelete(null);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to delete service.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE7DF] pb-5">
        <div>
          <h2 className="font-serif text-2xl text-[#171615] font-light">
            Studio Service Offerings
          </h2>
          <p className="text-xs text-[#5A5752] font-light">
            Manage architectural disciplines, residential styling, and turnkey execution descriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#32302D] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Visual</th>
              <th className="py-3 px-4">Service Title</th>
              <th className="py-3 px-4">Subtitle / Focus</th>
              <th className="py-3 px-4">Disciplines</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7DF]">
            {services.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                  {isLoading ? "Loading studio services..." : "No services configured."}
                </td>
              </tr>
            ) : (
              services.map((serv) => (
                <tr key={serv.id || serv.slug} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#8C877E]">#{serv.order}</td>
                  <td className="py-3 px-4">
                    <div className="relative w-12 h-12 bg-[#ECE7DF] overflow-hidden shrink-0 border border-[#ECE7DF]">
                      {serv.image ? (
                        <Image src={serv.image} alt="" fill unoptimized className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[#8C877E]">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-serif text-sm text-[#171615] font-normal">{serv.title}</p>
                    <p className="text-[10px] text-[#8C877E]">{serv.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-[#5A5752]">{serv.subtitle || "&mdash;"}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {Array.isArray(serv.disciplines) &&
                        serv.disciplines.map((d, i) => (
                          <span
                            key={i}
                            className="text-[9px] uppercase tracking-wider bg-[#FAF8F5] border border-[#ECE7DF] px-1.5 py-0.5 text-[#5A5752]"
                          >
                            {d}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(serv)}
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border cursor-pointer ${
                        serv.is_active !== false
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-zinc-100 text-zinc-600 border-zinc-200"
                      }`}
                    >
                      {serv.is_active !== false ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href="/services"
                      target="_blank"
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#8C877E] hover:text-[#171615] p-1"
                      title="Preview services page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(serv)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#171615] hover:text-amber-800 p-1 cursor-pointer"
                      title="Edit service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceToDelete(serv)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 p-1 cursor-pointer"
                      title="Delete service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-lg w-full p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#ECE7DF] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                  Studio Service Atelier
                </p>
                <h3 className="font-serif text-2xl text-[#171615] font-light">
                  {editingService ? `Edit "${editingService.title}"` : "Add Service Offering"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#8C877E] hover:text-[#171615] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Turnkey Execution"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Slug / URL Identifier
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. turnkey"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Subtitle / Focus
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Artisanal Direction & Realization"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <AdminImageUpload
                label="Service Atmosphere Image *"
                value={image}
                onChange={(url) => setImage(url)}
                helperText="Atmospheric image showcasing this service"
              />

              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Disciplines / Sub-Pillars (comma separated)
                </label>
                <input
                  type="text"
                  value={disciplinesText}
                  onChange={(e) => setDisciplinesText(e.target.value)}
                  placeholder="Material Procurement, Joinery Direction, Handover"
                  className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Service Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Meticulous site management, master craftsman coordination, and complete furnishing curation..."
                  className="w-full bg-white border border-[#ECE7DF] p-3 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white border border-[#ECE7DF]">
                <input
                  type="checkbox"
                  id="serviceActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#171615] cursor-pointer"
                />
                <label htmlFor="serviceActive" className="text-xs text-[#171615] font-medium cursor-pointer">
                  Display this service on public &ldquo;Services&rdquo; page and navigation
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECE7DF]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 border border-[#ECE7DF] bg-white text-xs uppercase tracking-wider text-[#5A5752] hover:text-[#171615]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#171615] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#32302D] disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingService ? "Update Service" : "Save Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(serviceToDelete)}
        title="Delete Studio Service Offering?"
        message={`Are you sure you want to permanently delete "${serviceToDelete?.title}"?`}
        confirmLabel="Permanently Delete Service"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setServiceToDelete(null)}
      />
    </div>
  );
}
