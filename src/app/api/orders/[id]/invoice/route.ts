import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const order = await Order.findById(params.id)
    .populate('orderItems.product')
    .lean();

  if (!order || order.user.toString() !== session.user._id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const doc = new PDFDocument();
  doc.font('Times-Roman'); // ✅ Avoid Helvetica-related crash
  const stream = doc.pipe(Readable.from([]));

  // Header
  doc.fontSize(20).text('🧾 UANA Order Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Customer: ${session.user.name || session.user.email}`);
  doc.moveDown();

  doc.text('Items:', { underline: true });
  doc.moveDown(0.5);

  // Items
  order.orderItems.forEach((item: any, index: number) => {
    doc.text(
      `${index + 1}. ${item.product?.name || 'Unknown'} - Qty: ${item.qty} x NPR ${item.price}`
    );
  });

  doc.moveDown();
  doc.text(`Total: NPR ${order.totalPrice}`, { bold: true });
  doc.text(`Paid: ${order.isPaid ? 'Yes ✅' : 'No ❌'}`);
  doc.text(`Delivered: ${order.isDelivered ? 'Yes 📦' : 'No ⏳'}`);

  doc.end();

  const streamBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  return new NextResponse(streamBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${order._id}.pdf`,
    },
  });
}
