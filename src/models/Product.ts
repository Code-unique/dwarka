import mongoose, { Schema, model, models } from "mongoose";

const variantSchema = new Schema({
  size: String,
  color: String,
  stock: Number,
});

const mediaSchema = new Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    media: [mediaSchema],
    category: String,
    fabric: String,
    material: String,
    tags: [String],
    sustainable: { type: Boolean, default: true },
    variants: [variantSchema],
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Corrected export
export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);
