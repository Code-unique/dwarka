import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function AdminUsers() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) return <div className="text-red-600 p-10">Access Denied</div>;

  const users = await User.find({}).lean();

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">👤 Users</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.isAdmin ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
