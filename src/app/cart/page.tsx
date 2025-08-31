"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
};

type CartItem = {
    id: string;
    quantity: number;
    product: Product;
};

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState("standard");

    const options = [
        { id: "standard", label: "Standard", price: "Free" },
        { id: "express", label: "Express", price: "$5.00" },
        { id: "overnight", label: "Overnight", price: "$15.00" },
      ];

    const router = useRouter();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch('/api/cart', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include authentication headers if necessary
                        'Authorization': `Bearer ${token}`,
                    },
                })
                if (response.ok) {
                    const data = await response.json();
                    console.log("Cart items:", data);
                    setItems(data?.items || []);
                } else {
                    console.error("Failed to fetch cart items:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCartItems();
    }, []);

    const deletdCartItem = async (itemId: string) => {
        try {
            const res = await fetch(`/api/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.ok) {
                setItems(items.filter(item => item.id !== itemId));
            } else {
                console.error("Failed to delete cart item:", res.statusText);
            }
        }
        catch (error) {
            console.error("Error deleting cart item:", error);
        }
    }

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        // Implement increase quantity logic here
        console.log("Increase quantity clicked");
        try {
            const res = await fetch(`/api/cart/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity })
            })
            if (res.ok) {
                setItems(items.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
            } else {
                console.error("Failed to update cart item:", res.statusText);
            }
        } catch (error) {
            console.error("Error updating cart item:", error);
        }

    }

    return (
        <div className="p-32">
            <h1 className="text-3xl font-bold mb-4">MY CART</h1>
            {loading ? (
                <p>Loading...</p>

            ) : items.length === 0 ? (
                <p>Your cart is empty right now</p>
            ) : (
                <div className="">

                    <div className="grid grid-cols-5 items-center text-center border-b py-4 text-gray-700">
                        <span className="col-span-2">Product</span>
                        <span>Price</span>
                        <span>Qty</span>
                        <span>Total</span>

                    </div>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-5 font-semibold text-center items-center border-b pb-3 text-gray-700"
                        >
                            {/* Product Image */}

                            <div className="col-span-2 flex items-center gap-4">
                                <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-40 h-40 object-cover rounded mb-3"
                                />
                                <div>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-lg font-semibold">{item.product.name}</h2>
                                        <p className="text-sm text-gray-500">ID: {item.product.id}</p>
                                        <button onClick={() => deletdCartItem(item.id)} className="">
                                            <Trash2 className="inline-block mr-2" />
                                            Remove from Cart
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>

                                ${item.product.price.toFixed(2)}

                            </div>

                            {/* 3️⃣ Quantity Column */}
                            <div>
                                <Button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus /></Button>
                                {item.quantity}
                                <Button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                ><Plus /></Button>
                            </div>

                            <div className="font-semibold">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </div>



                        </div>
                    ))}
                </div>
            )
            }


            <div className="bg-[#F0F4F7] h-96 mt-32 rounded-3xl shadow-md hover:shadow-lg flex items-center px-20">

            <div className="mt-6 w-96">
      <p className="font-semibold mb-3">Choose shipping method</p>

      <div className="grid gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`flex justify-between items-center border rounded-lg p-4 cursor-pointer transition 
              ${selected === option.id ? "border-red-500 bg-red-50" : "border-gray-300 bg-white hover:border-red-300"}
            `}
          >
            <div>
              <p className="font-medium">{option.label}</p>
              <p className="text-sm text-gray-500">{option.price}</p>
            </div>

            {/* ✅ Tick icon when selected */}
            {selected === option.id && (
              <Check className="text-red-500 w-6 h-6" strokeWidth={3} />
            )}
          </div>
        ))}
      </div>
    </div>


                <div className="flex flex-col gap-6 text-2xl justify-center ml-auto">
                    <p className="text-2xl font-bold"> ${items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</p>
                    <h1>Total</h1>
                    <p className="">Delivery : Free</p>
                    <Button onClick={() => router.push("/checkout")} className="bg-red-500 text-white hover:bg-red-600" >Checkout</Button>
                </div>
               
            </div>

        </div>
    )
}