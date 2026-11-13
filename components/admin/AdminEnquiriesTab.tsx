"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Inbox,
  X,
  FileText,
} from "lucide-react";
import { AdminConfirmModal } from "./AdminConfirmModal";
import { apiUpdateEnquiryStatus, apiDeleteEnquiry } from "@/lib/api";

const ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "In Discussion",
  "Completed",
  "Rejected",
];

interface AdminEnquiriesTabProps {
  enquiries: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onNotification: (type: "success" | "error", message: string) => void;
  initialSelectedEnquiry?: any | null;
}

export function AdminEnquiriesTab({
  enquiries,
  isLoading,
  onRefresh,
  onNotification,
  initialSelectedEnquiry = null,
}: AdminEnquiriesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(initialSelectedEnquiry);

  // Delete State
  const [enquiryToDelete, setEnquiryToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (enquiryId: number, newStatus: string) => {
    const res = await apiUpdateEnquiryStatus(enquiryId, newStatus);
    if (res.success) {
      onNotification("success", `Enquiry status updated to ${newStatus}.`);
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to update enquiry status.");
    }
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    const res = await apiDeleteEnquiry(enquiryToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      onNotification("success", `Enquiry from ${enquiryToDelete.full_name} deleted.`);
      setEnquiryToDelete(null);
      if (selectedEnquiry?.id === enquiryToDelete.id) {
        setSelectedEnquiry(null);
      }
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to delete enquiry.");
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      searchTerm === "" ||
      e.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.project_location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || e.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-[#ECE7DF] pb-5">
        <h2 className="font-serif text-2xl text-[#171615] font-light">
          Project Enquiries &amp; Consultations
        </h2>
        <p className="text-xs text-[#5A5752] font-light">
          Track architecture and interior commission inquiries submitted by prospective clients.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search enquiries by client name, email, or city..."
            className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2 pl-9 text-xs focus:outline-none focus:border-[#171615]"
          />
          <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#8C877E]" />
          <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#ECE7DF] px-2.5 py-1.5 text-xs text-[#171615] focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Client Name</th>
              <th className="py-3 px-4">Project &amp; Property</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Budget Range</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7DF]">
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                  {isLoading ? "Loading project enquiries..." : "No matching enquiries found."}
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3.5 px-4 text-[#8C877E]">
                    {new Date(enq.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-[#171615]">{enq.full_name}</p>
                    <p className="text-[10px] text-[#8C877E]">
                      {enq.email} &bull; {enq.phone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-[#171615] font-medium">{enq.project_type}</p>
                    <p className="text-[10px] text-[#8C877E]">{enq.property_type}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#5A5752]">{enq.project_location}</td>
                  <td className="py-3.5 px-4 font-medium text-[#171615]">
                    {enq.budget_range || "N/A"}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 border bg-white focus:outline-none cursor-pointer ${
                        enq.status === "New"
                          ? "border-blue-300 text-blue-900 bg-blue-50/50"
                          : enq.status === "Completed"
                          ? "border-emerald-300 text-emerald-900 bg-emerald-50/50"
                          : enq.status === "Rejected"
                          ? "border-red-300 text-red-900 bg-red-50/50"
                          : "border-[#ECE7DF] text-[#171615]"
                      }`}
                    >
                      {ENQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(enq)}
                      className="text-[11px] uppercase tracking-wider text-[#171615] hover:underline font-medium cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnquiryToDelete(enq)}
                      className="text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 p-1 cursor-pointer"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-xl w-full p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#ECE7DF] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                  Commission Inquiry Dossier
                </p>
                <h3 className="font-serif text-2xl text-[#171615]">
                  {selectedEnquiry.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="text-xs uppercase tracking-wider text-[#8C877E] hover:text-[#171615]"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Status Update Control */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#ECE7DF]">
                <span className="font-medium text-[#171615] uppercase tracking-wider">
                  Inquiry Status:
                </span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border bg-[#FAF8F5] cursor-pointer"
                >
                  {ENQUIRY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Contact Info */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium">
                  Client Contact
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#5A5752]">
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8C877E]" />
                    <span>{selectedEnquiry.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8C877E]" />
                    <span>{selectedEnquiry.phone}</span>
                  </p>
                </div>
              </div>

              {/* Project Scope & Location */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium">
                  Project Scope &amp; Budget
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#8C877E]">Discipline</span>
                    <p className="font-medium text-[#171615]">{selectedEnquiry.project_type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C877E]">Property Type</span>
                    <p className="font-medium text-[#171615]">{selectedEnquiry.property_type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C877E]">Location</span>
                    <p className="font-medium text-[#171615]">{selectedEnquiry.project_location}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C877E]">Approx. Area</span>
                    <p className="font-medium text-[#171615]">
                      {selectedEnquiry.project_area ? `${selectedEnquiry.project_area} sq.ft` : "Not specified"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-[#8C877E]">Budget Range</span>
                    <p className="font-medium text-[#171615]">{selectedEnquiry.budget_range || "Flexible / Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Requirements & Brief */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E] font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Client Requirements &amp; Brief</span>
                </p>
                <p className="text-[#171615] font-light leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.requirements || "No additional notes provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-6 py-2 bg-[#171615] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#32302D] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(enquiryToDelete)}
        title="Delete Client Project Enquiry?"
        message={`Are you sure you want to permanently delete the inquiry submitted by "${enquiryToDelete?.full_name}"?`}
        confirmLabel="Permanently Delete Enquiry"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setEnquiryToDelete(null)}
      />
    </div>
  );
}
