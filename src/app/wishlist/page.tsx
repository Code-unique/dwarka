'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Heart, Instagram, Twitter, Facebook } from 'lucide-react';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist');
        if (!res.ok) throw new Error('Failed to fetch wishlist');
        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#e6f0e9] to-white py-10 px-6 max-w-7xl mx-auto flex flex-col">
        <header className="flex items-center gap-3 mb-8">
          <Heart className="text-[#5e7c60] w-8 h-8 animate-pulse" />
          <h1 className="text-4xl font-serif font-bold text-[#3a6e61] tracking-wide">
            Your Wishlist
          </h1>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : wishlist.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 flex-grow"
            style={{ animation: 'fadeIn 0.8s ease forwards' }}
          >
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-24 text-gray-600 flex-grow flex flex-col items-center justify-center">
            <p className="text-xl mb-4">Your wishlist is empty 😢</p>
            <p className="mb-8 max-w-sm">
              Explore our timeless collection and add your favorite sustainable fashion pieces!
            </p>
            <a
              href="/#products"
              className="inline-block bg-[#5e7c60] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#4a6b4f] transition"
            >
              Browse Products
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#3a6e61] text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-serif font-bold mb-2">DWARKA</h2>
            <p className="max-w-xs text-center md:text-left text-gray-200">
              Rooted in Nepal, crafting sustainable fashion with care and conscience.
            </p>
          </div>

          <nav className="flex gap-6 text-sm font-medium">
            <a href="/" className="hover:text-[#d4f0e1] transition">
              Home
            </a>
            <a href="/#products" className="hover:text-[#d4f0e1] transition">
              Products
            </a>
            <a href="/wishlist" className="hover:text-[#d4f0e1] transition">
              Wishlist
            </a>
            <a href="/profile" className="hover:text-[#d4f0e1] transition">
              Profile
            </a>
          </nav>

          <div className="flex gap-6 text-white">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#d4f0e1] transition">
              <Instagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-[#d4f0e1] transition">
              <Twitter size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#d4f0e1] transition">
              <Facebook size={24} />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-300 text-xs">
          &copy; {new Date().getFullYear()} DWARKA. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
