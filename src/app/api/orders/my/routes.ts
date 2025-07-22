import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // adjust if needed
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await Order.find({ user: session.user._id }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
