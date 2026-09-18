import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "../types/Product";

type Props = {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
  onEdit: (product: Product) => void;
};

const categories = [
  "living-room",
  "bedroom",
  "dining-room",
  "office",
  "outdoor",
  "lighting",
  "decor",
];

export default function ProductForm({
  product,
  onClose,
  onAdd,
  onEdit,
}: Props) {
  const isEditing = Boolean(product);

  const [form, setForm] = useState({
    category: product?.category ?? "living-room",
    color: product?.color ?? "",
    description: product?.description ?? "",
    image: product?.image ?? "",
    material: product?.material ?? "",
    name: product?.name ?? "",
    price: product?.price ?? "",
    rating: product?.rating ?? "",
    stock: product?.stock?.toString() ?? "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Enter a valid price.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }

    if (!form.rating || Number(form.rating) < 0) {
      setError("Enter a valid rating.");
      return;
    }

    if (Number(form.rating) > 5) {
      setError("Rating cannot be greater than 5.");
      return;
    }

    const productData: Product = {
      id: product?.id ?? `${Date.now()}-${Math.random()}`,

      category: form.category,

      color: form.color.trim(),

      description: form.description.trim(),

      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25",

      material: form.material.trim(),

      name: form.name.trim(),

      price: form.price,

      rating: form.rating,

      stock: Number(form.stock),
    };

    if (isEditing) {
      onEdit(productData);
    } else {
      onAdd(productData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      updateField("image", reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-green-700">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? "Update product information."
                : "Add a new product to Novara."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Image
            </label>

            <div className="flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImagePlus size={24} className="text-slate-400" />
                  </div>
                )}
              </div>

              <label className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Name
            </label>

            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Luxury Wooden Sofa"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />
          </div>

          {/* Category + Material */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Material
              </label>

              <input
                value={form.material}
                onChange={(e) => updateField("material", e.target.value)}
                placeholder="Teak Wood"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />
            </div>
          </div>

          {/* Color + Price */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Color
              </label>

              <input
                value={form.color}
                onChange={(e) => updateField("color", e.target.value)}
                placeholder="Brown"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Price
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="1200"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-8 pr-4 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Rating + Stock */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Rating
              </label>

              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => updateField("rating", e.target.value)}
                placeholder="4.8"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />

              <p className="mt-1 text-xs text-slate-400">
                Rating must be between 0 and 5.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                placeholder="10"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              placeholder="Premium luxury wooden sofa for modern living room."
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {isEditing ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
