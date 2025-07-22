import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // Import User model
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
  } = body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return NextResponse.json({ error: "No order items" }, { status: 400 });
  }

  const order = await Order.create({
    user: user._id,  // Use the real _id from DB
    orderItems: orderItems.map((item: any) => ({
      name: item.name,
      qty: item.qty,
      price: item.price,
      product: item._id,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isPaid: isPaid || false,
    paidAt: paidAt || null,
  });

  return NextResponse.json(order, { status: 201 });
}
