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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14 items-stretch shadow-sm hover:shadow-lg">
  {products.map((product) => (
    <div
    key={product.id}
    className="border border-gray-200 rounded-xl flex flex-col overflow-hidden 
               shadow-sm hover:shadow-md transition h-full bg-white"
  >
    <Link href={`/products/${product.id}`} className="flex-1">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h2>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
        <p className="text-base font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
        <p className={`text-xs mt-1 ${
          product.stock > 0 ? "text-green-600" : "text-red-600"
        }`}>
          {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
        </p>
      </div>
    </Link>
  
    <div className="px-4 py-3 flex gap-2 border-t border-gray-100">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(product.id);
        }}
        className="flex-1 bg-black text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
      <button
        className="flex-1 border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
      >
        Buy Now
      </button>
    </div>
  </div>
  ))}
</div>
          )}

        </div>
      )
    }