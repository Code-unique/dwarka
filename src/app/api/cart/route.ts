import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = new Types.ObjectId(session.user._id);
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  return NextResponse.json(cart || { items: [] });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, qty } = await req.json();

  const userId = new Types.ObjectId(session.user._id);

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [{ product: productId, qty }] });
  } else {
    const existing = cart.items.find((i: any) => i.product.toString() === productId);
    if (existing) existing.qty += qty;
    else cart.items.push({ product: productId, qty });
    await cart.save();
  }

  return NextResponse.json(cart);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, qty } = await req.json();
  const userId = new Types.ObjectId(session.user._id);

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

  const item = cart.items.find((i: any) => i.product.toString() === productId);
  if (item) item.qty = qty;
  await cart.save();

  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = new Types.ObjectId(session.user._id);

  let productId = null;
  try {
    const body = await req.json();
    productId = body?.productId;
  } catch {
    // no body, clear whole cart
  }

  if (productId) {
    await Cart.updateOne({ user: userId }, { $pull: { items: { product: productId } } });
    return NextResponse.json({ message: "Removed" });
  } else {
    await Cart.findOneAndDelete({ user: userId });
    return NextResponse.json({ message: "Cart cleared" });
  }
}
