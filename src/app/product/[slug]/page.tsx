import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/actions';
import ProductDetailClient from '@/components/ProductDetailClient';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const slug =  params?.slug;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square relative rounded-xl overflow-hidden">
        <Image
          src={product.media[0]?.url || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <ProductDetailClient product={product} />
    </div>
  );
}
