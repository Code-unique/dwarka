import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

export default async function AdminOrders() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) return <div className="text-red-600 p-10">Access Denied</div>;

  const orders = await Order.find({}).populate('user').sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">📦 Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order._id} className="border-b">
                <td className="p-2">{order.user?.name || 'N/A'}</td>
                <td className="p-2">NPR {order.totalPrice}</td>
                <td className="p-2">
                  <span className={order.isPaid ? 'text-green-600' : 'text-red-600'}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <br />
                  <span className={order.isDelivered ? 'text-green-600' : 'text-orange-500'}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </td>
                <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
