"use client"
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
export default function CheckoutPage() {

    const handleCheckout = async () => {
        console.log('Initiating checkout...');
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            console.log("Checkout API response:", data);
            if(data.sessionId) {
                const stripe = await stripePromise
                if(!stripe) {
                    console.error('Stripe.js failed to load.');
                    return;
                }
                await stripe.redirectToCheckout({ sessionId: data.sessionId });

            }

        } catch (error) {
            console.error('Error during checkout:', error);
        }
    }

    return <div>
        <h1>Checkout Page</h1>
        <Button className="bg-red-500 mt-32" onClick={handleCheckout}>
  Checkouttt
</Button>    </div>;
}