import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';

export default async function AdminDashboard() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return <div className="text-center py-10 text-red-500">Access Denied</div>;
  }

  const [products, orders, users] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
  ]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">🚀 Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-6 text-center">
          <h2 className="text-xl font-semibold text-teal-600">Products</h2>
          <p className="text-3xl font-bold">{products}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h2 className="text-xl font-semibold text-blue-600">Orders</h2>
          <p className="text-3xl font-bold">{orders}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h2 className="text-xl font-semibold text-purple-600">Users</h2>
          <p className="text-3xl font-bold">{users}</p>
        </div>
      </div>
    </div>
  );
}
