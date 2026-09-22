import { ChevronLeft, ChevronRight, Edit, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "../types/Product";

type ProductStatus = "Active" | "Inactive" | "Out of Stock";

type Props = {
  products: Product[];
  productStatuses: Record<string, ProductStatus>;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
  onBulkDelete: () => void;
  onToggleStatus: (id: string) => void;
  onStockChange: (id: string, change: number) => void;
};

type SortOption =
  | "name"
  | "price-low"
  | "price-high"
  | "stock-low"
  | "stock-high";

export default function ProductTable({
  products,
  productStatuses,
  selectedProducts,
  setSelectedProducts,
  onEdit,
  onDelete,
  onBulkDelete,
  onToggleStatus,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState<SortOption>("name");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // No soft delete. Products are directly taken from props.
  const visibleProducts = products;

  const selectedProductIds = useMemo(
    () =>
      selectedProducts.filter((id) =>
        visibleProducts.some((product) => product.id === id),
      ),
    [selectedProducts, visibleProducts],
  );

  const categories = useMemo(() => {
    return [
      "All Categories",
      ...Array.from(
        new Set(visibleProducts.map((product) => product.category)),
      ),
    ];
  }, [visibleProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...visibleProducts];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    if (category !== "All Categories") {
      result = result.filter((product) => product.category === category);
    }

    if (status !== "All Status") {
      result = result.filter((product) => {
        const currentStatus =
          product.stock === 0
            ? "Out of Stock"
            : productStatuses[product.id] || product.status || "Active";

        return currentStatus === status;
      });
    }

    result.sort((a, b) => {
      switch (sort) {
        case "price-low":
          return Number(a.price) - Number(b.price);

        case "price-high":
          return Number(b.price) - Number(a.price);

        case "stock-low":
          return a.stock - b.stock;

        case "stock-high":
          return b.stock - a.stock;

        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [visibleProducts, productStatuses, search, category, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const allCurrentSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((product) =>
      selectedProductIds.includes(product.id),
    );

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const currentIds = paginatedProducts.map((product) => product.id);

    if (allCurrentSelected) {
      setSelectedProducts((prev) =>
        prev.filter((id) => !currentIds.includes(id)),
      );
    } else {
      setSelectedProducts((prev) => [...new Set([...prev, ...currentIds])]);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const getPaginationPages = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total];
    }

    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-200 lg:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products, category or SKU..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => handleCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Out of Stock</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option value="name">Name</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="stock-low">Stock: Low → High</option>
          <option value="stock-high">Stock: High → Low</option>
        </select>
      </div>

      {/* Selection toolbar */}
      {selectedProductIds.length > 0 && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-sm font-medium text-slate-700">
            {selectedProductIds.length} selected
          </p>

          <button
            onClick={onBulkDelete}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="w-12 px-5 py-3">
                <input
                  type="checkbox"
                  checked={allCurrentSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4"
                />
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                Product
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                Price
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                Stock
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 rounded-full bg-slate-100 p-4">
                      <Search size={24} className="text-slate-400" />
                    </div>

                    <p className="font-medium text-slate-700">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
               const currentStatus =
  product.stock <= 0
    ? "Out of Stock"
    : productStatuses[product.id] ?? product.status ?? "Active";
                return (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* Checkbox */}
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="h-4 w-4"
                      />
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />

                        <div>
                          <p className="font-medium text-slate-900">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span className="min-w-6 text-center text-sm">
                        {product.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                     <button
  type="button"
  onClick={() => onToggleStatus(product.id)}
  disabled={product.stock <= 0}
  className={`inline-flex min-w-20 items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
    product.stock <= 0
      ? "cursor-not-allowed border-red-100 bg-red-50 text-red-600"
      : currentStatus === "Active"
        ? "border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-100"
        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
  }`}
>
  <span
    className={`h-1.5 w-1.5 rounded-full ${
      product.stock <= 0
        ? "bg-red-500"
        : currentStatus === "Active"
          ? "bg-emerald-500"
          : "bg-slate-400"
    }`}
  />
  {currentStatus}
</button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-slate-700 transition"
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteProduct(product)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                <Trash2 size={20} className="text-red-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Delete product?
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-slate-700">
                    {deleteProduct.name}
                  </span>
                  ? You can restore it using the Undo option.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onDelete(deleteProduct.id, deleteProduct.name);

                  setDeleteProduct(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Pagination */}
      <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredProducts.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            –{" "}
            <span className="font-medium text-slate-700">
              {Math.min(currentPage * pageSize, filteredProducts.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {filteredProducts.length}
            </span>
          </p>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-slate-200 px-2 py-1 text-sm outline-none"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          <div className="flex items-center gap-1">
            {getPaginationPages(currentPage, totalPages).map(
              (pageNumber, index) => {
                if (pageNumber === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-1.5 text-sm text-slate-400"
                    >
                      ...
                    </span>
                  );
                }

                const num = pageNumber as number;

                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      currentPage === num
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {num}
                  </button>
                );
              },
            )}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
