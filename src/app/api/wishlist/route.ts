import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

// GET Wishlist
export async function GET(req: Request) {
  await connectDB();
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.id && !session?.user?._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user._id || session.user.id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  return NextResponse.json(wishlist?.products || []);
}

// POST Wishlist
export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.id && !session?.user?._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user._id || session.user.id;

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, products: [productId] });
  } else if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  return NextResponse.json({ success: true, message: 'Added to wishlist' });
}

// DELETE Wishlist
export async function DELETE(req: Request) {
  await connectDB();
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.id && !session?.user?._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user._id || session.user.id;

  let productId = '';
  try {
    const body = await req.json();
    productId = body.productId;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }

  const wishlist = await Wishlist.findOne({ user: userId });
  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (id: any) => id.toString() !== productId.toString()
    );
    await wishlist.save();
  }

  return NextResponse.json({ success: true, message: 'Removed from wishlist' });
}
