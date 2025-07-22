'use client';

import { useState } from 'react';

export default function AddToCartButton({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, qty: 1 }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');

      setAdded(true);
      setTimeout(() => setAdded(false), 3000); // reset added state after 3 seconds
    } catch (err) {
      alert('❌ Failed to add to cart. Are you logged in?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || added}
      className={`w-full mt-4 px-6 py-3 rounded-xl shadow-lg text-white font-semibold transition-all
        ${
          added
            ? 'bg-green-600 hover:bg-green-700 cursor-default animate-pulse'
            : 'bg-teal-600 hover:bg-teal-700'
        }`}
    >
      {loading
        ? 'Adding...'
        : added
        ? '✓ Added to Cart'
        : '🛒 Add to Cart'}
    </button>
  );
}
