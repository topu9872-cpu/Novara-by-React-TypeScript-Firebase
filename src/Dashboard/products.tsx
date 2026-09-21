import { useEffect, useMemo, useState } from "react";
import ProductForm from "../DashboardComponents/ProductForm";
import ProductTable from "../DashboardComponents/ProductTable";
import type { Product } from "../types/Product";
import { getAllProducts } from "../services/productService";
import {
  createProduct,
  deleteProduct,
  restoreProduct,
  updateProductStatus,
} from "../services/AdminDashboard";
import { toast } from "sonner";
type ProductStatus = "Active" | "Inactive" | "Out of Stock";

const normalizeProductStatus = (value?: string | null): ProductStatus => {
  if (value === "Inactive") return "Inactive";
  if (value === "Out of Stock") return "Out of Stock";
  return "Active";
};

export default function Products() {
  // 1. Initialize as an empty array to prevent undefined map/filter errors
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [productStatuses, setProductStatuses] = useState<
    Record<string, ProductStatus>
  >({});
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 2. Fetch products and initialize statuses once data arrives
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getAllProducts();

        // If another request has already finished or component
        // is no longer active, ignore this result.
        if (cancelled) return;

        const fetchedProducts = data.products || [];

        setProducts(fetchedProducts);

        const initialStatuses: Record<string, ProductStatus> =
          Object.fromEntries(
            fetchedProducts.map((product) => [
              product.id,
              product.stock === 0
                ? "Out of Stock"
                : normalizeProductStatus(product.status),
            ]),
          );

        setProductStatuses(initialStatuses);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch products:", error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);
  const stats = useMemo(() => {
    return {
      total: products.length,

      active: products.filter(
        (product) => product.stock > 0 && product.status === "Active",
      ).length,

      inactive: products.filter(
        (product) => product.stock > 0 && product.status === "Inactive",
      ).length,

      lowStock: products.filter(
        (product) => product.stock > 0 && product.stock <= 5,
      ).length,

      outOfStock: products.filter((product) => product.stock === 0).length,
    };
  }, [products]);

  const handleAddProduct = async (product: Product) => {
    try {
      setLoading(true);

      const createdProduct = await createProduct(product);

      if (!createdProduct) {
        toast.error("Failed to add product!");
        return;
      }

      setProducts((prev) => [createdProduct, ...prev]);

      setProductStatuses((prev) => ({
        ...prev,
        [createdProduct.id]:
          createdProduct.stock === 0 ? "Out of Stock" : "Active",
      }));

      setIsFormOpen(false);

      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    const nextStatus: ProductStatus =
      product.stock === 0
        ? "Out of Stock"
        : normalizeProductStatus(product.status ?? productStatuses[product.id]);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, ...product, status: nextStatus }
          : item,
      ),
    );

    setProductStatuses((prev) => ({
      ...prev,
      [product.id]: nextStatus,
    }));

    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    const deletedProduct = products.find((product) => product.id === id);

    if (!deletedProduct) return;

    const previousStatus: ProductStatus = normalizeProductStatus(
      productStatuses[id] ?? deletedProduct.status,
    );

    try {
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setSelectedProducts((prev) =>
        prev.filter((productId) => productId !== id),
      );
      setProductStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      await deleteProduct(id);

      toast.success(`${name} deleted successfully!`, {
        duration: 5000,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              const restoredProduct: Product = {
                ...deletedProduct,
              };

              await restoreProduct(restoredProduct);

              setProducts((prev) => {
                if (prev.some((product) => product.id === restoredProduct.id)) {
                  return prev;
                }

                return [restoredProduct, ...prev];
              });

              setProductStatuses((prev) => ({
                ...prev,
                [restoredProduct.id]: previousStatus,
              }));

              toast.success(`${name} restored!`);
            } catch (error) {
              console.error(error);
              toast.error(`Failed to restore ${name}!`);
            }
          },
        },
      });
    } catch (error) {
      console.error(error);
      setProducts((prev) =>
        prev.some((product) => product.id === deletedProduct.id)
          ? prev
          : [deletedProduct, ...prev],
      );
      setProductStatuses((prev) => ({
        ...prev,
        [deletedProduct.id]: previousStatus,
      }));
      toast.error(`Failed to delete ${name}!`);
    }
  };
  const handleBulkDelete = async () => {
    if (!selectedProducts.length) return;

    const deletedProducts = products.filter((product) =>
      selectedProducts.includes(product.id),
    );

    if (!deletedProducts.length) return;

    try {
      // Delete from Firebase
      await Promise.all(
        deletedProducts.map((product) => deleteProduct(product.id)),
      );

      // Remove from UI
      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id)),
      );

      setSelectedProducts([]);

      toast.success(`${deletedProducts.length} products deleted!`, {
        duration: 5000,
        action: {
          label: "Undo",

          onClick: async () => {
            try {
              // Restore in Firebase
              await Promise.all(
                deletedProducts.map((product) => restoreProduct(product)),
              );

              // Restore in UI
              setProducts((prev) => {
                const existingIds = new Set(prev.map((product) => product.id));

                const restoredProducts = deletedProducts.filter(
                  (product) => !existingIds.has(product.id),
                );

                return [...restoredProducts, ...prev];
              });

              toast.success(`${deletedProducts.length} products restored!`);
            } catch (error) {
              console.error(error);
              toast.error("Failed to restore products!");
            }
          },
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete products!");
    }
  };

  const handleToggleStatus = async (id: string) => {
    const product = products.find((product) => product.id === id);

    if (!product || product.stock === 0) return;

    const currentStatus = normalizeProductStatus(product.status);

    const newStatus: ProductStatus =
      currentStatus === "Active" ? "Inactive" : "Active";

    try {
      await updateProductStatus(id, newStatus);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                status: newStatus,
              }
            : product,
        ),
      );
      toast.success(`Product status changed to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const handleStockChange = (id: string, change: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;
        const newStock = Math.max(0, product.stock + change);
        return { ...product, stock: newStock };
      }),
    );

    setProductStatuses((prev) => {
      const currentProduct = products.find((product) => product.id === id);
      if (!currentProduct) return prev;

      const newStock = Math.max(0, currentProduct.stock + change);

      if (newStock === 0) {
        return { ...prev, [id]: "Out of Stock" };
      }

      if (prev[id] === "Out of Stock") {
        return { ...prev, [id]: "Active" };
      }

      return prev;
    });
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your Novara products and inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat title="Total" value={stats.total} />
        <Stat title="Active" value={stats.active} />
        <Stat title="Inactive" value={stats.inactive} />
        <Stat title="Low Stock" value={stats.lowStock} />
        <Stat title="Out of Stock" value={stats.outOfStock} />
      </div>

      {/* Table */}
      <ProductTable
        products={products}
        productStatuses={productStatuses}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        onEdit={openEditForm}
        onDelete={handleDeleteProduct}
        onBulkDelete={handleBulkDelete}
        onToggleStatus={handleToggleStatus}
        onStockChange={handleStockChange}
      />

      {/* Form */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            if (loading) return;

            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onAdd={handleAddProduct}
          onEdit={handleEditProduct}
          loading={loading}
        />
      )}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
