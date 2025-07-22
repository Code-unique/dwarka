'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();

      // ✅ Safely extract product array
      const productArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(productArray);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]); // fallback to empty array to prevent crash
    }
  };

  fetchProducts();
}, []);


  useEffect(() => {
    fetch('/api/wishlist')
      .then(res => res.json())
      .then((data: any) => setWishlist(data.map((p: any) => p._id)))
      .catch(console.error);
  }, []);

  const toggleWishlist = async (id: string) => {
    if (wishlist.includes(id)) {
      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      if (res.ok) setWishlist(wishlist.filter(i => i !== id));
    } else {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      if (res.ok) setWishlist([...wishlist, id]);
    }
  };

  const filteredProducts = products
    .filter((product: any) => {
      const q = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q) ||
        (Array.isArray(product.tags)
          ? product.tags.some((tag) => tag.toLowerCase().includes(q))
          : (product.tags as string)?.toLowerCase().includes(q))
      );
    })
    .sort((a: any, b: any) => {
      if (sortOption === 'low') return a.price - b.price;
      if (sortOption === 'high') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <HeroSection />

      <section id="products" className="bg-gradient-to-b from-gray-100 to-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-serif font-extrabold text-center text-gray-800 mb-12 tracking-wide drop-shadow-lg">
            Our Exclusive Collection
          </h2>

          {/* Search + Sort */}
          <div
            className="flex flex-col md:flex-row justify-between items-center gap-5 mb-12 p-6 bg-white bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg max-w-4xl mx-auto"
            style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full md:w-2/3 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            >
              <option value="latest">Sort: Latest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: any) => {
                const isInWishlist = wishlist.includes(product._id);
                return (
                  <div
                    key={product._id}
                    className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.03] transition duration-300"
                  >
                    <ProductCard product={product} />
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`
                        absolute top-4 right-4 text-3xl cursor-pointer select-none
                        transition-transform duration-300
                        ${isInWishlist ? 'animate-pulse text-red-500' : 'text-gray-400 hover:text-red-500'}
                      `}
                      style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))' }}
                      title={isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                    >
                      {isInWishlist ? '❤️' : '🤍'}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-xl text-gray-500 mt-16">
                Sorry, no products found matching your criteria.
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-14 space-x-4 select-none">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-5 py-3 rounded-lg font-semibold transition
                  ${
                    currentPage === i + 1
                      ? 'bg-teal-600 text-white shadow-lg scale-110'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
