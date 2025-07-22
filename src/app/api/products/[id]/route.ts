import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();

  const { id } = context.params; // ✅ No hook, just read normally

  try {
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }
}


export async function DELETE(req: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  const params = await context.params;
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}

export async function PUT(req: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  const params = await context.params;
  await connectDB();
  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}
