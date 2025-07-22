'use client';
import { useEffect, useState } from 'react';
import StripeCheckoutButton from '@/components/StripeCheckoutButton';
import Footer from '@/components/Footer';
export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    const res = await fetch('/api/cart');
    const data = await res.json();
    const items = data.items || [];
    setCart(items);
    setTotal(items.reduce((sum: number, item: any) => sum + item.product.price * item.qty, 0));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId: string, qty: number) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty }),
    });
    fetchCart();
  };

  const removeItem = async (productId: string) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    fetchCart();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-teal-600 text-center">🛒 Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your cart is empty. Let’s add something cool!</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between items-center bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-center md:text-left">
                  <p className="text-lg font-semibold text-gray-800">{item.product.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    NPR {item.product.price} × {item.qty} ={" "}
                    <span className="text-teal-600 font-medium">
                      NPR {item.product.price * item.qty}
                    </span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-3 md:mt-0">
                  <button
                    onClick={() => updateQty(item.product._id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="px-3 py-1 bg-gray-100 rounded-md text-lg hover:bg-gray-200 disabled:opacity-50"
                  >−</button>

                  <span className="text-lg font-medium">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.product._id, item.qty + 1)}
                    className="px-3 py-1 bg-gray-100 rounded-md text-lg hover:bg-gray-200"
                  >＋</button>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="ml-3 text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-right text-xl font-bold text-gray-800">
            Total: <span className="text-teal-600">NPR {total}</span>
          </div>

          <div className="mt-8 text-center">
            <StripeCheckoutButton
              cart={cart.map((item) => ({
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                qty: item.qty,
                media: item.product.media,
              }))}
              amount={total * 100}
            />
          </div>
          <Footer/>
        </>
        
      )}
    </div>
  );
}
