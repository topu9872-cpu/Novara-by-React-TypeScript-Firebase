import { useMemo, useState } from "react";
import ProductForm from "../DashboardComponents/ProductForm";
import ProductTable from "../DashboardComponents/ProductTable";
import type { Product } from "../types/Product";

const initialProducts: Product[] = [
  {
    id: "1",
    category: "living-room",
    color: "Brown",
    description: "Premium luxury wooden sofa for modern living room.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    material: "Teak Wood",
    name: "Luxury Wooden Sofa",
    price: "1200",
    rating: "4.8",
    stock: 10,
  },
  {
    id: "2",
    category: "living-room",
    color: "Brown",
    description: "Premium luxury wooden sofa for modern living room.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    material: "Teak Wood",
    name: "Luxury Wooden Sofa",
    price: "1200",
    rating: "4.8",
    stock: 10,
  },
  {
    id: "3",
    category: "living-room",
    color: "Brown",
    description: "Premium luxury wooden sofa for modern living room.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    material: "Teak Wood",
    name: "Luxury Wooden Sofa",
    price: "1200",
    rating: "4.8",
    stock: 10,
  },
  {
    id: "4",
    category: "living-room",
    color: "Brown",
    description: "Premium luxury wooden sofa for modern living room.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    material: "Teak Wood",
    name: "Luxury Wooden Sofa",
    price: "1200",
    rating: "4.8",
    stock: 10,
  },
  {
    id: "5",
    category: "living-room",
    color: "Brown",
    description: "Premium luxury wooden sofa for modern living room.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
    material: "Teak Wood",
    name: "Luxury Wooden Sofa",
    price: "1200",
    rating: "4.8",
    stock: 10,
  },
];

type ProductStatus = "Active" | "Inactive" | "Out of Stock";

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [productStatuses, setProductStatuses] = useState<
    Record<string, ProductStatus>
  >(() =>
    Object.fromEntries(
      initialProducts.map((product) => [
        product.id,
        product.stock === 0 ? "Out of Stock" : "Active",
      ]),
    ),
  );

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const stats = useMemo(() => {
    return {
      total: products.length,

      active: products.filter(
        (product) => productStatuses[product.id] === "Active",
      ).length,

      inactive: products.filter(
        (product) => productStatuses[product.id] === "Inactive",
      ).length,

      outOfStock: products.filter((product) => product.stock === 0).length,

      lowStock: products.filter(
        (product) => product.stock > 0 && product.stock <= 5,
      ).length,
    };
  }, [products, productStatuses]);

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);

    setProductStatuses((prev) => ({
      ...prev,
      [product.id]: product.stock === 0 ? "Out of Stock" : "Active",
    }));

    setIsFormOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? product : item)),
    );

    setProductStatuses((prev) => ({
      ...prev,
      [product.id]:
        product.stock === 0
          ? "Out of Stock"
          : prev[product.id] === "Inactive"
            ? "Inactive"
            : "Active",
    }));

    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));

    setProductStatuses((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    setSelectedProducts((prev) => prev.filter((item) => item !== id));
  };

  const handleBulkDelete = () => {
    if (!selectedProducts.length) return;

    setProducts((prev) =>
      prev.filter((product) => !selectedProducts.includes(product.id)),
    );

    setProductStatuses((prev) => {
      const updated = { ...prev };

      selectedProducts.forEach((id) => {
        delete updated[id];
      });

      return updated;
    });

    setSelectedProducts([]);
  };

  const handleToggleStatus = (id: string) => {
    setProductStatuses((prev) => {
      const currentStatus = prev[id];

      if (currentStatus === "Out of Stock") {
        return prev;
      }

      return {
        ...prev,
        [id]: currentStatus === "Active" ? "Inactive" : "Active",
      };
    });
  };

  const handleStockChange = (id: string, change: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;

        const newStock = Math.max(0, product.stock + change);

        return {
          ...product,
          stock: newStock,
        };
      }),
    );

    setProductStatuses((prev) => {
      const currentProduct = products.find((product) => product.id === id);

      if (!currentProduct) return prev;

      const newStock = Math.max(0, currentProduct.stock + change);

      if (newStock === 0) {
        return {
          ...prev,
          [id]: "Out of Stock",
        };
      }

      if (prev[id] === "Out of Stock") {
        return {
          ...prev,
          [id]: "Active",
        };
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
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onAdd={handleAddProduct}
          onEdit={handleEditProduct}
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
