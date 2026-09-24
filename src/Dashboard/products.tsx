import { useEffect, useMemo, useState } from "react";
import ProductForm from "../DashboardComponents/ProductForm";
import ProductTable from "../DashboardComponents/ProductTable";
import type { Product } from "../types/Product";
import { getAllProducts } from "../services/productService";
import {
  createProduct,
  deleteProduct,
  restoreProduct,
  updateProduct,
  updateProductStatus,
} from "../services/AdminDashboard";
import { toast } from "sonner";
import { useNavigate } from "react-router";
type ProductStatus = "Active" | "Inactive" | "Out of Stock";

const normalizeProductStatus = (value?: string | null): ProductStatus => {
  if (value === "Inactive") return "Inactive";
  if (value === "Out of Stock") return "Out of Stock";
  return "Active";
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [productStatuses, setProductStatuses] = useState<
    Record<string, ProductStatus>
  >({});
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const reload = useNavigate();
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getAllProducts();
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
        (product) => Number(product.stock) > 0 && product.status === "Active",
      ).length,

      inactive: products.filter(
        (product) => Number(product.stock) > 0 && product.status === "Inactive",
      ).length,

      lowStock: products.filter(
        (product) => Number(product.stock) > 0 && Number(product.stock) <= 5,
      ).length,

      outOfStock: products.filter((product) => Number(product.stock) === 0).length,
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

  const handleEditProduct = async (product: Product) => {
    try {
      setLoading(true);
      await updateProduct(product);
      toast.success("product update successfully !");
      setIsFormOpen(false);
      reload(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setEditingProduct(null);
    }
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
    const product = products.find((p) => p.id === id);
    if (!product || product.stock === 0) return;

    const currentStatus =
      productStatuses[id] || normalizeProductStatus(product.status);
    const newStatus: ProductStatus =
      currentStatus === "Active" ? "Inactive" : "Active";

    try {
      // 1. Update the database
      await updateProductStatus(id, newStatus);

      // 2. Update the products array state
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
      );

      // 3. Update the status dictionary state (This makes the UI change instantly!)
      setProductStatuses((prev) => ({
        ...prev,
        [id]: newStatus,
      }));

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
        const newStock = Math.max(0, Number(product?.stock) + change);
        return { ...product, stock: newStock };
      }),
    );

    setProductStatuses((prev) => {
      const currentProduct = products.find((product) => product.id === id);
      if (!currentProduct) return prev;

      const newStock = Math.max(0, Number(currentProduct.stock) + change);

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
