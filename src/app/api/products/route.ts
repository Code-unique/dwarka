import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const query: any = {};

  if (searchParams.get('q')) {
    const q = searchParams.get('q');
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { slug: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];
  }

  if (searchParams.get('category')) {
    query.category = searchParams.get('category');
  }

  if (searchParams.get('featured')) {
    query.isFeatured = searchParams.get('featured') === 'true';
  }

  const products = await Product.find(query).lean();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await Product.create(body);
    return NextResponse.json(product);
  } catch (err: any) {
    console.error("Product POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

