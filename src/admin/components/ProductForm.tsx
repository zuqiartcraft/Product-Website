"use client";

import { useState, useEffect } from "react";
import { Product, getProductImages } from "@/types/product";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";

interface ProductFormProps {
  onSubmit: (product: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  initialData?: Product;
  getToken: () => string | null;
}

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData,
  getToken,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    short_description: initialData?.short_description || "",
    long_description: initialData?.long_description || "",
    size: initialData?.size || "",
    price: initialData?.price || 0,
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      const images = getProductImages(initialData);
      setImageUrls(images);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        image_url: JSON.stringify(imageUrls),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddUrl = () => {
    if (newUrlInput.trim()) {
      setImageUrls((prev) => [...prev, newUrlInput.trim()]);
      setNewUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const token = getToken();
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading images. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= imageUrls.length) return;

    const newUrls = [...imageUrls];
    [newUrls[index], newUrls[newIndex]] = [newUrls[newIndex], newUrls[index]];
    setImageUrls(newUrls);
  };

  return (
    <>
      <toast.ToastContainer />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {initialData ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Product Images Section */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Product Images * (First image will be main)
              </label>

              {/* Image Preview Grid */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                      <div className="absolute top-1 right-1 flex gap-1">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, "up")}
                            className="bg-black/50 text-white p-1 rounded hover:bg-black/70"
                            title="Move left"
                          >
                            ←
                          </button>
                        )}
                        {index < imageUrls.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, "down")}
                            className="bg-black/50 text-white p-1 rounded hover:bg-black/70"
                            title="Move right"
                          >
                            →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="space-y-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>{uploading ? "Uploading..." : "Upload Images"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {/* Add URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newUrlInput}
                    onChange={(e) => setNewUrlInput(e.target.value)}
                    placeholder="Or paste image URL"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add URL
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: JPEG, PNG, WebP, GIF (max 5MB per image)
                </p>
              </div>
            </div>

            {/* Other Form Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description for product card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Long Description *
              </label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Small, Medium, Large or dimensions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading
                  ? "Saving..."
                  : initialData
                  ? "Update Product"
                  : "Add Product"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
