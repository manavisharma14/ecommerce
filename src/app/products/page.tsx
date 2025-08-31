"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2   } from "lucide-react";

type Product = {
    id: string
    name: string
    price: number
    imageUrl: string
    description: string
    stock: number
  }
export default function ProductsPage() {

    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }                
                });
                if(!res.ok){
                    throw new Error('Failed to fetch products');
                }
                const data = await res.json();
                setProducts(data);
                console.log('Products:', data);
            }
            catch(error){
                console.log('FETCH_PRODUCTS', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const router = useRouter();
      const addToCart = async (productId: string) => {
        console.log("Add to Cart clicked for product id:", productId);
    
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
              items: [{ productId: productId, quantity: 1 }],
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

      const deleteProduct = async (productId: string) => {
        try {
          const res = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }

          })
          if(res.ok){
            setProducts(products.filter(product => product.id !== productId));
          
          } else {
            console.error("Failed to delete product:", res.statusText);
          }
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }

    return (
        <div className="max-w-7xl mx-auto px-8 py-32">
          <h1 className="text-3xl font-bold mb-4">Products</h1>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
  {products.map((product) => (
    <div
      key={product.id}
      className="border rounded-2xl flex flex-col justify-between overflow-hidden hover:shadow-lg transition cursor-pointer h-full min-h-[380px]"
    >
      <Link href={`/products/${product.id}`} className="flex-1">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded-lg"
        />
        <h2 className="text-xl px-2 font-semibold mb-2 line-clamp-2">
          {product.name}
        </h2>
      </Link>

      <div className="px-2">
        <p className="font-bold">${product.price.toFixed(2)}</p>
        <p
          className={`text-sm ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
        </p>
      </div>

      <div className="px-2 py-2 mt-auto flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id);
          }}
          className="flex-1 bg-yellow-400 rounded-full text-white px-4 py-2 hover:bg-yellow-600 transition"
        >
          Add to Cart
        </button>
        <button className="flex-1 bg-green-500 rounded-full text-white px-4 py-2 hover:bg-green-700 transition">
          Buy now
        </button>
      </div>
    </div>
  ))}
</div>
          )}

        </div>
      )
    }