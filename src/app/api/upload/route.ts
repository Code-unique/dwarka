import { NextResponse } from "next/server";
import cloudinary from 'cloudinary';
import { Readable } from 'stream';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function streamToBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: "auto" }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    }).end(bytes);
  });

  return NextResponse.json(uploadResult);
}
