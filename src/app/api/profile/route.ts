import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  const user = await User.findById(session.user._id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    address: user.address || "",
    phone: user.phone || "",
  });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  const { address, phone, avatar } = await req.json();

  const user = await User.findById(session.user._id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.address = address || "";
  user.phone = phone || "";
  if (avatar) user.avatar = avatar;

  await user.save();

  return NextResponse.json({ message: "Updated" });
}
