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
  CheckCircle2,
  AlertCircle,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import { formatINR } from "@/data/content";
import { AdminImageUpload } from "./AdminImageUpload";
import { AdminConfirmModal } from "./AdminConfirmModal";
import {
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
} from "@/lib/api";

const PRODUCT_CATEGORIES = [
  "Living Objects",
  "Architectural Lighting",
  "Seating Collection",
  "Tables & Consoles",
  "Textiles & Accents",
  "Other",
];

interface AdminProductsTabProps {
  products: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onNotification: (type: "success" | "error", message: string) => void;
}

export function AdminProductsTab({
  products,
  isLoading,
  onRefresh,
  onNotification,
}: AdminProductsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [numericPrice, setNumericPrice] = useState<number>(100000);
  const [image, setImage] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(true);

  // Delete State
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategory(PRODUCT_CATEGORIES[0]);
    setNumericPrice(100000);
    setImage("");
    setDimensions("");
    setMaterial("");
    setDescription("");
    setFeatured(false);
    setAvailable(true);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setCategory(prod.category || PRODUCT_CATEGORIES[0]);
    setNumericPrice(prod.numeric_price || prod.numericPrice || 0);
    setImage(prod.image || "");
    setDimensions(prod.dimensions || "");
    setMaterial(prod.material || "");
    setDescription(prod.description || "");
    setFeatured(Boolean(prod.featured));
    setAvailable(prod.available !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onNotification("error", "Please provide a product piece name.");
      return;
    }
    if (!image.trim()) {
      onNotification("error", "Please upload or provide an image for the piece.");
      return;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      category,
      price: formatINR(numericPrice),
      numeric_price: Number(numericPrice),
      image: image.trim(),
      image_alt: name.trim(),
      dimensions: dimensions.trim(),
      material: material.trim(),
      description: description.trim(),
      featured,
      available,
    };

    let res;
    if (editingProduct) {
      res = await apiUpdateProduct(editingProduct.id || editingProduct.slug, payload);
    } else {
      res = await apiCreateProduct(payload);
    }

    setIsSaving(false);

    if (res.success) {
      onNotification(
        "success",
        editingProduct
          ? `Product "${name}" updated successfully.`
          : `Product "${name}" created and added to collection.`
      );
      setIsModalOpen(false);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to save product.");
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    const res = await apiDeleteProduct(productToDelete.id || productToDelete.slug);
    setIsDeleting(false);

    if (res.success) {
      onNotification("success", `Product "${productToDelete.name}" deleted.`);
      setProductToDelete(null);
      onRefresh();
    } else {
      onNotification("error", res.message || "Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === "All" ||
      p.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE7DF] pb-5">
        <div>
          <h2 className="font-serif text-2xl text-[#171615] font-light">
            Curated Atelier Objects
          </h2>
          <p className="text-xs text-[#5A5752] font-light">
            Manage architectural furnishings, monolithic stones, and luminaires available for acquisition.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171615] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#32302D] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name, material, or keywords..."
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
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#ECE7DF] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#ECE7DF] text-[10px] uppercase tracking-widest text-[#8C877E]">
            <tr>
              <th className="py-3 px-4">Visual</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price (INR ₹)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7DF]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#8C877E] text-xs">
                  {isLoading ? "Loading collection objects..." : "No products found matching criteria."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => (
                <tr key={prod.id || prod.slug} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="relative w-12 h-12 bg-[#ECE7DF] overflow-hidden shrink-0 border border-[#ECE7DF]">
                      {prod.image ? (
                        <Image
                          src={prod.image}
                          alt={prod.name}
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
                    <p className="font-serif text-sm text-[#171615] font-normal">{prod.name}</p>
                    <p className="text-[10px] text-[#8C877E]">{prod.material || prod.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-[#5A5752]">{prod.category}</td>
                  <td className="py-3 px-4 font-semibold text-[#171615] font-sans">
                    {prod.numeric_price || prod.numericPrice
                      ? formatINR(prod.numeric_price || prod.numericPrice)
                      : prod.price}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {prod.available !== false ? (
                      <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        Available
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600 bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                        Reserved
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {prod.featured ? (
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
                      href={`/products/${prod.slug}`}
                      target="_blank"
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#8C877E] hover:text-[#171615] p-1"
                      title="Preview piece in public catalog"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-[#171615] hover:text-amber-800 p-1 cursor-pointer"
                      title="Edit product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductToDelete(prod)}
                      className="inline-flex items-center text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 p-1 cursor-pointer"
                      title="Delete product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#ECE7DF] max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#ECE7DF] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8C877E]">
                  Collection Atelier
                </p>
                <h3 className="font-serif text-2xl text-[#171615] font-light">
                  {editingProduct ? `Edit "${editingProduct.name}"` : "Add Curated Object"}
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
              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Object Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monolithic Travertine Console"
                  className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Acquisition Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={numericPrice}
                    onChange={(e) => setNumericPrice(Number(e.target.value))}
                    placeholder="640000"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                  <p className="text-[10px] text-[#8C877E]">{formatINR(numericPrice)}</p>
                </div>
              </div>

              {/* Image Upload */}
              <AdminImageUpload
                label="Product Visual Image *"
                value={image}
                onChange={(url) => setImage(url)}
                helperText="Primary high-resolution piece photograph"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 180cm W × 45cm D × 80cm H"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                    Material &amp; Craftsmanship
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. Honed Roman Travertine"
                    className="w-full bg-white border border-[#ECE7DF] px-3 py-2 text-xs focus:outline-none focus:border-[#171615]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#171615] uppercase tracking-wider text-[11px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural provenance, artisanal finish details, and spatial suitability..."
                  className="w-full bg-white border border-[#ECE7DF] p-3 text-xs focus:outline-none focus:border-[#171615]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2.5 p-3 bg-white border border-[#ECE7DF]">
                  <input
                    type="checkbox"
                    id="productAvailable"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 accent-[#171615] cursor-pointer"
                  />
                  <label htmlFor="productAvailable" className="text-xs text-[#171615] font-medium cursor-pointer">
                    Available for Acquisition
                  </label>
                </div>

                <div className="flex items-center gap-2.5 p-3 bg-white border border-[#ECE7DF]">
                  <input
                    type="checkbox"
                    id="productFeatured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#171615] cursor-pointer"
                  />
                  <label htmlFor="productFeatured" className="text-xs text-[#171615] font-medium cursor-pointer">
                    Feature on Homepage Showcase
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
                  <span>{editingProduct ? "Update Object" : "Save Object"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Collection Object?"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"?`}
        confirmLabel="Permanently Delete Piece"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
