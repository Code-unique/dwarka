import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Order from '@/models/Order';
import connectDB from '@/lib/mongodb';

export default async function DashboardPage() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const orders = await Order.find({ user: session?.user._id });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order: any) => (
            <li key={order._id} className="border p-4 rounded shadow">
              <p><strong>Total:</strong> NPR {order.totalPrice}</p>
              <p><strong>Status:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
