"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Get logged in user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 your login flow should save token
        if (!token) {
          console.error("No auth token found");
          return;
        }
  
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 pass token
          },
        });
  
        if (!res.ok) {
          console.error("Failed to fetch user:", res.status);
          return;
        }
  
        const data = await res.json();
        console.log("Fetched user:", data);
  
        // data looks like { user: { id, email } }
        setUserId(data.user.id);
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
  
    fetchUser();
  }, []);

  const handleCheckout = async () => {
    console.log("Initiating checkout...");

    if (!userId) {
      console.error("❌ No user ID found. Please log in first.");
      return;
    }

    try {
      // 2. Send userId to checkout API
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // 👈 important
      });

      const data = await res.json();
      console.log("Checkout API response:", data);

      if (data.sessionId) {
        const stripe = await stripePromise;
        if (!stripe) {
          console.error("Stripe.js failed to load.");
          return;
        }
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      <h1>Checkout Page</h1>
      <Button
        className="bg-red-500 mt-32"
        onClick={handleCheckout}
        disabled={!userId} // prevent if not loaded
      >
        Checkout
      </Button>
    </div>
  );
}