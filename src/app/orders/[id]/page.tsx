


import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#3a6e61] via-[#5ca78c] to-[#2f5e50] text-white text-xl font-semibold">
        You must be logged in to view this order.
      </div>
    );
  }

  const rawOrder = await Order.findById(id).populate('orderItems.product').lean();

  if (!rawOrder || rawOrder.user.toString() !== session.user._id) {
    return notFound();
  }

  const order = {
    ...rawOrder,
    _id: rawOrder._id.toString(),
    user: rawOrder.user.toString(),
    createdAt: rawOrder.createdAt?.toISOString(),
    paidAt: rawOrder.paidAt?.toISOString() || null,
    orderItems: rawOrder.orderItems.map((item: any) => ({
      ...item,
      product: item.product
        ? {
            _id: item.product._id?.toString(),
            name: item.product.name,
            price: item.product.price,
          }
        : null,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a6e61] via-[#5ca78c] to-[#2f5e50] px-6 py-16 text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-serif font-bold border-b border-white/20 pb-3 text-center">🧾 Order Summary</h1>

        <div className="rounded-xl bg-white/5 backdrop-blur-md p-6 shadow-lg border border-white/10 space-y-2">
          <p><strong className="text-[#d4f0e1]">Order ID:</strong> {order._id}</p>
          <p><strong className="text-[#d4f0e1]">Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong className="text-[#d4f0e1]">Total:</strong> NPR {order.totalPrice}</p>
          <p><strong className="text-[#d4f0e1]">Status:</strong> {order.isPaid ? '✅ Paid' : '❌ Not Paid'}</p>
          <p><strong className="text-[#d4f0e1]">Delivery:</strong> {order.isDelivered ? '📦 Delivered' : '⏳ Pending'}</p>

          <a
            href={`/api/orders/${order._id}/invoice`}
            target="_blank"
            className="inline-block mt-4 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-white px-6 py-2 rounded-full shadow-lg hover:brightness-110 transition-all text-sm font-semibold"
          >
            📄 Download Invoice
          </a>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">🛍️ Order Items</h2>
          <ul className="space-y-4">
            {order.orderItems.map((item: any, i: number) => (
              <li key={i} className="bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-sm shadow-sm">
                <p className="font-semibold text-lg">
                  {item.product?.name || '❌ Product not available'}
                </p>
                <p className="text-white/80">Quantity: {item.qty}</p>
                <p className="text-white/80">Price: NPR {item.price}</p>
                <p className="text-[#d4f0e1] font-medium">Total: NPR {item.qty * item.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
