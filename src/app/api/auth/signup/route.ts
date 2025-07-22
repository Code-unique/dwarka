import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();

  const { name, email, password, address, phone } = await req.json();

  if (!name || !email || !password || !address || !phone) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    address,
    phone,
    isAdmin: false,
  });

  await newUser.save();

  return NextResponse.json({ message: "User created successfully" });
}
