import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
