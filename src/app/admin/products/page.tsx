'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface Variant {
  size: string;
  color: string;
  stock: string | number;
}

interface Media {
  type: 'image' | 'video';
  url: string;
}

interface Product {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  category: string;
  fabric: string;
  material: string;
  tags: string | string[];
  isFeatured: boolean;
  variants: Variant[];
  media: Media[];
}

const initProduct: Product = {
  name: '',
  slug: '',
  description: '',
  price: '',
  category: '',
  fabric: '',
  material: '',
  tags: '',
  isFeatured: false,
  variants: [{ size: '', color: '', stock: '' }],
  media: [],
};

export default function AdminProducts() {
  const [product, setProduct] = useState<Product>(initProduct);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uploadToCloudinary = async (file: File): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return {
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: data.secure_url,
    };
  };

  const handleMediaUpload = async (): Promise<Media[]> => {
    const uploaded = await Promise.all(mediaFiles.map(uploadToCloudinary));
    return uploaded;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const uploadedMedia = mediaFiles.length > 0 ? await handleMediaUpload() : product.media;

    const newProduct = {
      ...product,
      price: Number(product.price),
      media: uploadedMedia,
      tags: product.tags
        ? typeof product.tags === 'string'
          ? product.tags.split(',').map((t) => t.trim())
          : product.tags
        : [],
      variants: product.variants.map((v) => ({ ...v, stock: Number(v.stock) })),
    };

    const method = product._id ? 'PUT' : 'POST';
    const url = product._id ? `/api/products/${product._id}` : '/api/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      toast.success(product._id ? 'Product updated!' : 'Product added!');
      setProduct(initProduct);
      setMediaFiles([]);
      fetchProducts();
      setShowForm(false);
    } else {
      toast.error('Failed to save product');
    }
  };

  const handleVariantChange = (i: number, field: keyof Variant, value: string) => {
    const updated = [...product.variants];
    updated[i][field] = value;
    setProduct({ ...product, variants: updated });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { size: '', color: '', stock: '' }],
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles([...mediaFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted!');
      fetchProducts();
    } else {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (p: Product) => {
    setProduct({
      ...p,
      price: p.price.toString(),
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags,
    });
    setMediaFiles([]);
    setShowForm(true);
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      (Array.isArray(p.tags)
        ? p.tags.some((tag) => tag.toLowerCase().includes(q))
        : (p.tags as string).toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 mb-6"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Close Form' : '➕ Add Product'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid gap-4 mb-10 bg-gray-100 p-6 rounded-lg">
          <input
            placeholder="Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="p-2 border"
            required
          />
          <input
            placeholder="Slug"
            value={product.slug}
            onChange={(e) => setProduct({ ...product, slug: e.target.value })}
            className="p-2 border"
            required
          />
          <textarea
            placeholder="Description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="p-2 border"
          />
          <input
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="p-2 border"
            required
          />
          <input
            placeholder="Category"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            className="p-2 border"
          />
          <input
            placeholder="Fabric"
            value={product.fabric}
            onChange={(e) => setProduct({ ...product, fabric: e.target.value })}
            className="p-2 border"
          />
          <input
            placeholder="Material"
            value={product.material}
            onChange={(e) => setProduct({ ...product, material: e.target.value })}
            className="p-2 border"
          />
          <input
            placeholder="Tags (comma-separated)"
            value={product.tags}
            onChange={(e) => setProduct({ ...product, tags: e.target.value })}
            className="p-2 border"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={product.isFeatured}
              onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
            />
            <span>Featured Product</span>
          </label>

          {/* Variants */}
          <div className="space-y-2">
            <h3 className="font-medium">Variants (Size, Color, Stock)</h3>
            {product.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                  className="p-2 border"
                />
                <input
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                  className="p-2 border"
                />
                <input
                  placeholder="Stock"
                  type="number"
                  min="0"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                  className="p-2 border"
                />
              </div>
            ))}
            <button type="button" className="text-sm text-blue-600" onClick={addVariant}>
              + Add Variant
            </button>
          </div>

          {/* Media */}
          <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {mediaFiles.map((file, i) => (
              <div key={i} className="border p-2 text-sm truncate">
                {file.name}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {product._id ? 'Update Product' : 'Save Product'}
          </button>
        </form>
      )}

      {/* 🔍 Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name, slug, category, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">🧾 Existing Products</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p._id} className="border rounded p-3 relative">
              {p.media?.[0]?.type === 'image' && (
                <Image
                  src={p.media[0].url}
                  alt={p.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-60"
                />
              )}
              <h3 className="font-bold text-lg mt-2">{p.name}</h3>
              <p className="text-sm">{p.category}</p>
              <p className="text-green-700 font-bold">NPR {p.price}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id!)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
