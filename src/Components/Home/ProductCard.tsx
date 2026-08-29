import { useEffect, useState } from "react";
import Card from "../AllCards";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/Product";
import { NavLink } from "react-router";
import { FaArrowRight } from "react-icons/fa6";

const ProductCard = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data as unknown as Product[]);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    loadProducts();
  }, []);

const topRated = [...products]
  .sort((a, b) => Number(b.rating) - Number(a.rating))
  .slice(0, 4);
    return (
    <div className="max-w-7xl my-10 mx-8">
      <div className="flex justify-between pb-6">
        <h1 className="text-2xl font-bold">Furniture Products</h1>
        <NavLink to={"/shop"} className="bg-gray-100 rounded-full flex items-center py-2 px-4 gap-2 font-semibold">
          View All Products <FaArrowRight size={14}/>
        </NavLink>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3   lg:grid-cols-4 gap-3">
        {topRated.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
