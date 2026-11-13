"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Loader2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { AdminProjectRecord } from "@/types";
import { AdminImageUpload } from "./AdminImageUpload";
import { AdminConfirmModal } from "./AdminConfirmModal";
import {
  apiCreateProject,
  apiUpdateProject,
  apiDeleteProject,
} from "@/lib/api";

const CATEGORIES = [
  "Interior Design",
  "Architecture",
  "Turnkey Execution",
];

const PROPERTY_TYPES = [
  "Private Villa",
  "Private Residence",
  "Penthouse Residence",
  "Country Villa",
  "Heritage Residence",
  "Private Estate",
  "Boutique Commercial",
  "Other",
];

interface AdminProjectsTabProps {
  projects: AdminProjectRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onNotification: (type: "success" | "error", message: string) => void;
}

export function AdminProjectsTab({
  projects,
  isLoading,
  onRefresh,
  onNotification,
}: AdminProjectsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProjectRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0]);
  const [location, setLocation] = useState("Bengaluru, Karnataka");
  const [year, setYear] = useState("2025");
  const [area, setArea] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [designApproach, setDesignApproach] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  // Delete Confirmation State
  const [projectToDelete, setProjectToDelete] = useState<AdminProjectRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setCategory(CATEGORIES[0]);
    setPropertyType(PROPERTY_TYPES[0]);
    setLocation("Bengaluru, Karnataka");
    setYear("2025");
    setArea("");
    setShortDescription("");
    setDescription("");
    setDesignApproach("");
    setCoverImage("");
    setFeatured(false);
    setGalleryImages([]);
    setNewGalleryUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (proj: AdminProjectRecord) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setCategory(proj.category || CATEGORIES[0]);
    setPropertyType(proj.property_type || PROPERTY_TYPES[0]);
    setLocation(proj.location || "Bengaluru, Karnataka");
    setYear(proj.year || "2025");
    setArea(proj.area || "");
    setShortDescription(proj.short_description || "");
    setDescription(proj.description || "");
    setDesignApproach(proj.design_approach || "");
    setCoverImage(proj.cover_image || "");
    setFeatured(Boolean(proj.featured));
    setGalleryImages(Array.isArray(proj.gallery) ? proj.gallery : []);
    setNewGalleryUrl("");
    setIsModalOpen(true);
  };

  const handleAddGalleryImage = (url: string) => {
    if (url && url.trim()) {
      setGalleryImages([...galleryImages, url.trim()]);
      setNewGalleryUrl("");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onNotification("error", "Please provide a project title.");
      return;
    }
    if (!coverImage.trim()) {
      onNotification("error", "Please upload or specify a cover image.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      category,
      property_type: propertyType,
      location: location.trim(),
      year: year.trim(),
      area: area.trim(),
      short_description: shortDescription.trim() || title.trim(),
      description: description.trim() || title.trim(),
      design_approach: designApproach.trim(),
      cover_image: coverImage.trim(),
      featured,
      gallery: galleryImages,
    };

    let res;
    if (editingProject) {
      res = await apiUpdateProject(editingProject.id || editingProject.slug, payload);
    } else {
      res = await apiCreateProject(payload);
    }

    setIsSaving(false);

    if (res.success) {
      onNotification(
        "success",
        editingProject
          ? `Project "${title}" updated successfully.`
          : `Project "${title}" created and published.`
      );
      setIsModalOpen(false);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to save project.");
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    const res = await apiDeleteProject(projectToDelete.id || projectToDelete.slug);
    setIsDeleting(false);

    if (res.success) {
      onNotification("success", `Project "${projectToDelete.title}" deleted.`);
      setProjectToDelete(null);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to delete project.");
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.property_type && p.property_type.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === "All" ||
      p.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE7DF] pb-5">
        <div>
          <h2 className="font-serif text-2xl text-[#171615] font-light">
            Portfolio Commissions
          </h2>
          <p className="text-xs text-[#5A5752] font-light">
            Manage projects displayed across the public architectural portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#32302D] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, location, or type..."
            className="w-full bg-white border border-[#ECE7DF] px-3.5 py-2 pl-9 text-xs focus:outline-none focus:border-[#171615]"
          />
          <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#8C877E]" />
          <span className="text-[#8C877E] uppercase tracking-wider text-[11px]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-[#ECE7DF] px-2.5 py-1.5 text-xs text-[#171615] focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
            <tr>
              <th className="py-3 px-4">Visual</th>
              <th className="py-3 px-4">Project Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7DF]">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                  {isLoading ? "Loading portfolio commissions..." : "No projects found matching criteria."}
                </td>
              </tr>
            ) : (
              filteredProjects.map((proj) => (
                <tr key={proj.id || proj.slug} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="relative w-14 h-10 bg-[#ECE7DF] overflow-hidden shrink-0 border border-[#ECE7DF]">
                      {proj.cover_image ? (
                        <Image
                          src={proj.cover_image}
                          alt={proj.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[#8C877E]">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-serif text-sm text-[#171615] font-normal">{proj.title}</p>
                    <p className="text-[10px] text-[#8C877E] font-mono">{proj.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-[#5A5752]">{proj.category}</td>
                  <td className="py-3 px-4 text-[#5A5752]">{proj.location}</td>
                  <td className="py-3 px-4 font-mono text-[#8C877E]">{proj.year}</td>
                  <td className="py-3 px-4 text-center">
                    {proj.featured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8C877E]">&mdash;</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#8C877E] hover:text-[#171615] p-1"
                      title="Preview public page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(proj)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#171615] hover:text-amber-800 p-1 cursor-pointer"
                      title="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(proj)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 p-1 cursor-pointer"
                      title="Delete project"
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

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#ECE7DF] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                  Portfolio Atelier
                </p>
                <h3 className="font-serif text-2xl text-[#171615] font-light">
                  {editingProject ? `Edit "${editingProject.title}"` : "Create New Project"}
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

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Contemporary Villa"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Slug / URL Key (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. contemporary-villa (auto-generated if empty)"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Completion Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bengaluru, Karnataka"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Built-Up Area (sq.ft)
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 6,800 sq.ft"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>
              </div>

              {/* Cover Image Uploader */}
              <AdminImageUpload
                label="Cover Image *"
                value={coverImage}
                onChange={(url) => setCoverImage(url)}
                helperText="Primary architectural showcase image for cards and banner"
              />

              {/* Short & Full Description */}
              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Short Description / Excerpt
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence summary of the architectural commission"
                  className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Full Narrative / Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive narrative of the project design, spatial volumes, and material dialogue..."
                  className="w-full bg-white border border-[#ECE7DF] p-3 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Design Approach / Concept
                </label>
                <textarea
                  rows={2}
                  value={designApproach}
                  onChange={(e) => setDesignApproach(e.target.value)}
                  placeholder="Architectural approach, solar orientation, material specification..."
                  className="w-full bg-white border border-[#ECE7DF] p-3 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              {/* Multiple Gallery Images */}
              <div className="p-4 bg-white border border-[#ECE7DF] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Project Gallery Imagery ({galleryImages.length})
                  </label>
                  <span className="text-[10px] text-[#8C877E]">Add additional interior &amp; detail shots</span>
                </div>

                <AdminImageUpload
                  label="Add Gallery Image"
                  value={newGalleryUrl}
                  onChange={handleAddGalleryImage}
                  helperText="Upload image to append to project gallery"
                />

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-[4/3] bg-[#ECE7DF] border border-[#ECE7DF] group overflow-hidden">
                        <Image src={imgUrl} alt="" fill unoptimized className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-700 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Switch */}
              <div className="flex items-center gap-3 p-3 bg-white border border-[#ECE7DF]">
                <input
                  type="checkbox"
                  id="featuredProject"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#171615] cursor-pointer"
                />
                <label htmlFor="featuredProject" className="text-xs text-[#171615] font-medium cursor-pointer">
                  Feature this project on the homepage &ldquo;Selected Projects&rdquo; showcase
                </label>
              </div>

              {/* Form Buttons */}
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
                  <span>{editingProject ? "Update Project" : "Publish Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Project Portfolio Commission?"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"? This project will be removed from the public website and portfolio.`}
        confirmLabel="Permanently Delete Project"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
}
