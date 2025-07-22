import connectDB from './mongodb';
import Product from '@/models/Product';

export async function getAllProducts() {
  await connectDB();
  const products = await Product.find().lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  return JSON.parse(JSON.stringify(product));
}


export async function getRelatedProducts(productId: string, category: string, tags: string[]) {
  if (!category && (!tags || tags.length === 0)) return [];

  // Find products in the same category OR sharing any tag, excluding current product
  const related = await Product.find({
    _id: { $ne: productId },
    $or: [
      { category: category },
      { tags: { $in: tags } },
    ],
  })
    .limit(6)
    .lean();

  return related;
}