import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Link from 'next/link';

export default async function MyOrdersPage() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#3a6e61] via-[#5ca78c] to-[#2f5e50] text-white text-xl font-semibold">
        You must be logged in to view your orders.
      </div>
    );
  }

  const orders = await Order.find({ user: session.user._id }).lean();

  const plainOrders = orders.map((order: any) => ({
    ...order,
    _id: order._id.toString(),
    createdAt: order.createdAt?.toISOString(),
    paidAt: order.paidAt?.toISOString() || null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a6e61] via-[#5ca78c] to-[#2f5e50] px-6 py-16 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-10 border-b-2 border-white/30 pb-4 tracking-wider text-center">
          🌿 My Orders
        </h1>

        {plainOrders.length === 0 ? (
          <p className="text-center text-lg text-white/80">No orders yet.</p>
        ) : (
          plainOrders.map((order: any) => (
            <div
              key={order._id}
              className="mb-6 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-green-200/50"
            >
              <p className="mb-2">
                <span className="font-semibold text-[#d4f0e1]">🆔 Order ID:</span>{' '}
                <Link
                  href={`/orders/${order._id}`}
                  className="text-[#c1ffee] underline hover:text-white transition"
                >
                  {order._id}
                </Link>
              </p>
              <p className="mb-1">
                <span className="font-semibold text-[#d4f0e1]">📅 Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <span className="font-semibold text-[#d4f0e1]">💰 Total:</span> NPR {order.totalPrice}
              </p>
              <p className="mb-1">
                <span className="font-semibold text-[#d4f0e1]">💳 Paid:</span>{' '}
                {order.isPaid ? '✅ Yes' : '❌ No'}
              </p>
              <p>
                <span className="font-semibold text-[#d4f0e1]">📦 Delivered:</span>{' '}
                {order.isDelivered ? '🚚 Delivered' : '⏳ Pending'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
