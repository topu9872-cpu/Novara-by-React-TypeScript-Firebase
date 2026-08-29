import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import SortDropdown from "../Components/Shop/SortDropdown";
import Card from "../Components/AllCards";
import { getAllProducts } from "../services/productService";
import type { Product } from "../types/Product";
import Pagination from "../Components/Shop/Pagination";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Read parameters directly from URL
  const searchQuery = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "default";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 16;

  // 2. Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        console.log("Fetched products for shop:", data.products); // Debug log
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch shop products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 3. Universal Search & Category Filter (Safely checks both 'name' and 'title')
  const filteredProducts = allProducts.filter((product: any) => {
    const productName = (product.name || product.title || "").toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch = productName.includes(query);
    const matchesCategory =
      currentCategory === "all" || product.category === currentCategory;

    return matchesSearch && matchesCategory;
  });

  // 4. Apply Dynamic Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (currentSort === "price-low") return Number(a.price) - Number(b.price);
    if (currentSort === "price-high") return Number(b.price) - Number(a.price);
    if (currentSort === "rating") return Number(b.rating) - Number(a.rating);
    return 0;
  });

  // 5. Pagination Math
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const sortOptions = [
    { label: "Sort by: Featured", value: "default" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Highest Rated", value: "rating" },
  ];

  const handleSortChange = (newSortValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSortValue);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-5 mt-10 mb-16">
      <SortDropdown
        sortBy={currentSort}
        setSortBy={handleSortChange}
        sortOptions={sortOptions}
      />

      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-medium">
          Loading shop catalog...
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 font-medium">
          {searchQuery
            ? `No products found matching "${searchQuery}".`
            : "No products found."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {currentProducts.map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Shop;