'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, HeartOff } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }: { product: any }) {
  const { data: session } = useSession();
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist');
        const data = await res.json();
        const found = data.some((p: any) => p._id === product._id);
        setIsWished(found);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      }
    };

    if (session?.user) fetchWishlist();
  }, [product._id, session?.user]);

  const toggleWishlist = async () => {
    try {
      const method = isWished ? 'DELETE' : 'POST';
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });

      if (res.ok) setIsWished(!isWished);
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  return (
    <div className="bg-white group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#e8e5de] relative">
      {/* Wishlist button */}
      {session?.user && (
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWished ? (
            <HeartOff className="text-red-500 w-5 h-5" />
          ) : (
            <Heart className="text-gray-600 w-5 h-5" />
          )}
        </button>
      )}

      {/* Image + Link block */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square relative">
          <Image
            src={product.media[0]?.url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-2">
        <Link href={`/product/${product.slug}`} className="block space-y-1">
          <h3 className="font-serif text-xl font-semibold text-[#3a3a2d]">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2">
            {product.description?.slice(0, 80)}...
          </p>
          <p className="text-[#5e7c60] font-bold text-lg">NPR {product.price}</p>
        </Link>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
