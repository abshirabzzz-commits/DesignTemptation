"use client";

import React, { useState } from "react";
import {
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Loader2,
  X,
  Filter,
  MessageSquareQuote,
  ShieldCheck,
} from "lucide-react";
import { AdminReviewRecord } from "@/types";
import { AdminConfirmModal } from "./AdminConfirmModal";
import {
  apiCreateReview,
  apiUpdateReview,
  apiToggleReviewApproval,
  apiToggleReviewFeatured,
  apiDeleteReview,
} from "@/lib/api";

interface AdminReviewsTabProps {
  reviews: AdminReviewRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onNotification: (type: "success" | "error", message: string) => void;
}

export function AdminReviewsTab({
  reviews,
  isLoading,
  onRefresh,
  onNotification,
}: AdminReviewsTabProps) {
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<AdminReviewRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("2025");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Delete State
  const [reviewToDelete, setReviewToDelete] = useState<AdminReviewRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingReview(null);
    setClientName("");
    setProjectType("Private Villa Commission");
    setLocation("Bengaluru");
    setYear("2025");
    setRating(5);
    setQuote("");
    setIsApproved(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (rev: AdminReviewRecord) => {
    setEditingReview(rev);
    setClientName(rev.client_name);
    setProjectType(rev.project_type || "");
    setLocation(rev.location || "");
    setYear(rev.year || "2025");
    setRating(rev.rating || 5);
    setQuote(rev.quote || "");
    setIsApproved(rev.is_approved);
    setIsFeatured(rev.is_featured);
    setIsModalOpen(true);
  };

  const handleToggleApproval = async (id: number) => {
    const res = await apiToggleReviewApproval(id);
    if (res.success) {
      onNotification(
        "success",
        res.is_approved ? "Review approved and published to website." : "Review hidden from website."
      );
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to update review status.");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const res = await apiToggleReviewFeatured(id);
    if (res.success) {
      onNotification(
        "success",
        res.is_featured ? "Review featured on homepage marquee." : "Review removed from homepage marquee."
      );
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to toggle featured status.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !quote.trim()) {
      onNotification("error", "Please provide both client name and testimonial quote.");
      return;
    }

    setIsSaving(true);
    const payload = {
      client_name: clientName.trim(),
      project_type: projectType.trim(),
      location: location.trim(),
      year: year.trim(),
      rating: Number(rating),
      quote: quote.trim(),
      is_approved: isApproved,
      is_featured: isFeatured,
    };

    let res;
    if (editingReview) {
      res = await apiUpdateReview(editingReview.id, payload);
    } else {
      res = await apiCreateReview(payload);
    }
    setIsSaving(false);

    if (res.success) {
      onNotification(
        "success",
        editingReview ? "Review updated." : "New client review recorded."
      );
      setIsModalOpen(false);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to save review.");
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    const res = await apiDeleteReview(reviewToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      onNotification("success", `Review from ${reviewToDelete.client_name} deleted.`);
      setReviewToDelete(null);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to delete review.");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === "Approved") return r.is_approved;
    if (statusFilter === "Pending") return !r.is_approved;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE7DF] pb-5">
        <div>
          <h2 className="font-serif text-2xl text-[#171615] font-light">
            Client Testimonials &amp; Reviews
          </h2>
          <p className="text-xs text-[#5A5752] font-light">
            Moderate, approve, and feature client reviews displayed on the website and moving review marquee.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#32302D] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Review</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-[#8C877E]" />
        <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Moderation:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#ECE7DF] px-2.5 py-1.5 text-xs text-[#171615] focus:outline-none cursor-pointer"
        >
          <option value="All">All Reviews ({reviews.length})</option>
          <option value="Approved">Approved ({reviews.filter((r) => r.is_approved).length})</option>
          <option value="Pending">Pending Moderation ({reviews.filter((r) => !r.is_approved).length})</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Commission &amp; Location</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Quote Excerpt</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Marquee</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7DF]">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                  {isLoading ? "Loading client reviews..." : "No reviews found."}
                </td>
              </tr>
            ) : (
              filteredReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-serif text-sm text-[#171615] font-normal">{rev.client_name}</p>
                    <p className="text-[10px] text-[#8C877E]">{rev.year}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#5A5752]">
                    <p>{rev.project_type || "Commission"}</p>
                    <p className="text-[10px] text-[#8C877E]">{rev.location}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-0.5 text-amber-700">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-700" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#5A5752] max-w-xs truncate italic">
                    &ldquo;{rev.quote}&rdquo;
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleApproval(rev.id)}
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border cursor-pointer ${
                        rev.is_approved
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-900 border-amber-200"
                      }`}
                    >
                      {rev.is_approved ? "Approved" : "Pending"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(rev.id)}
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border cursor-pointer ${
                        rev.is_featured
                          ? "bg-[#171615] text-[#FAF8F5] border-[#171615]"
                          : "bg-white text-[#8C877E] border-[#ECE7DF]"
                      }`}
                    >
                      {rev.is_featured ? "Featured" : "Standard"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEditModal(rev)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#171615] hover:text-amber-800 p-1 cursor-pointer"
                      title="Edit review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewToDelete(rev)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 p-1 cursor-pointer"
                      title="Delete review"
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
                  Testimonial Moderation
                </p>
                <h3 className="font-serif text-2xl text-[#171615] font-light">
                  {editingReview ? "Edit Client Review" : "Record New Review"}
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
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Elena & Marcus Vance"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Commission / Project
                  </label>
                  <input
                    type="text"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="e.g. Private Villa Commission"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Client Review Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="The exquisite interplay of limestone, natural light, and bespoke oak millwork..."
                  className="w-full bg-white border border-[#ECE7DF] p-3 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2.5 p-3 bg-white border border-[#ECE7DF]">
                  <input
                    type="checkbox"
                    id="revApproved"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="w-4 h-4 accent-[#171615] cursor-pointer"
                  />
                  <label htmlFor="revApproved" className="text-xs text-[#171615] font-medium cursor-pointer">
                    Approve for Public Website
                  </label>
                </div>

                <div className="flex items-center gap-2.5 p-3 bg-white border border-[#ECE7DF]">
                  <input
                    type="checkbox"
                    id="revFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#171615] cursor-pointer"
                  />
                  <label htmlFor="revFeatured" className="text-xs text-[#171615] font-medium cursor-pointer">
                    Feature in Homepage Marquee
                  </label>
                </div>
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
                  <span>{editingReview ? "Update Review" : "Save Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(reviewToDelete)}
        title="Delete Client Testimonial?"
        message={`Are you sure you want to permanently delete the review from "${reviewToDelete?.client_name}"?`}
        confirmLabel="Permanently Delete Review"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
}
