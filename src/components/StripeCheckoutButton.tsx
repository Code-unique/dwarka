
'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({
  amount,
  cart,
  onSuccess,
}: {
  amount: number;
  cart: any[];
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is not loaded.');
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError('Card element not found.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        setLoading(false);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setLoading(false);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <CardElement className="border p-3 rounded" />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 transition"
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
}

export default function StripeCheckoutButton({
  amount,
  cart,
}: {
  amount: number;
  cart: any[];
}) {
  const [paid, setPaid] = useState(false);
  const { data: session } = useSession();

  const handleSuccess = async () => {
    if (!session) {
      alert('You must be logged in to complete this payment.');
      return;
    }

    const order = {
      orderItems: cart,
      shippingAddress: {
    name: session.user.name || 'Customer',
    address: 'Online payment – no address collected',
    city: 'Kathmandu',
    postalCode: '0000',
    country: 'Nepal',
  },
      paymentMethod: 'Stripe',
      itemsPrice: amount / 100,
      shippingPrice: 0,
      totalPrice: amount / 100,
      isPaid: true,
      paidAt: new Date(),
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      credentials: 'include',
    });

    if (res.ok) {
      setPaid(true);
      await fetch('/api/cart', { method: 'DELETE' }); // 🧹 clear backend cart
      window.location.href = '/orders/success';
    } else {
      alert('Order creation failed after payment.');
    }
  };

  if (paid) {
    return (
      <p className="text-green-600 font-semibold text-center mt-4">
        ✅ Payment successful! Redirecting...
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} cart={cart} onSuccess={handleSuccess} />
    </Elements>
  );
}
