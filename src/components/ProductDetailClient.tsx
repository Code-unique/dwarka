'use client';
import AddToCartButton from './AddToCartButton';
import { useRouter } from 'next/navigation';

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-2xl text-teal-600">NPR {product.price}</p>
      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      {product.variants?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700">Available Sizes:</p>
          <div className="flex gap-2 mt-2">
            {product.variants.map((v: any, i: number) => (
              <span key={i} className="border rounded px-3 py-1 text-sm">
                {v.size}
              </span>
            ))}
          </div>
        </div>
      )}

      <AddToCartButton product={product} />

      {/* ✅ Customize Button */}
     <button
  onClick={() => router.push(`/customize/${product._id}`)}
  className="...">
  ✨ Customize This Product
</button>

    </div>
  );
}
