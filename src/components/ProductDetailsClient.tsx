"use client";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
};

export default function ProductDetailsClient({ product }: { product: Product }) {

  const router = useRouter();
  const addToCart = async () => {
    console.log("Add to Cart clicked for product id:", product.id);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [{ productId: product.id, quantity: 1 }],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await res.json();
      console.log("Add to Cart response:", data);
      router.push('/cart');

      alert("Product added to cart!");
    } catch (error) {
      console.error("ADD_TO_CART", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Product Details Page</h1>
      <div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
          <p className="text-lg font-medium mb-2">Price: ${product.price}</p>
          <p className="mb-2">{product.description}</p>
          <p className="mb-4">Stock: {product.stock}</p>
          <button
            onClick={addToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
