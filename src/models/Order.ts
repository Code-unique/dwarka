import mongoose, { Schema, model, models } from 'mongoose';

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        qty: Number,
        media: [Object], // array of images/videos
      },
    ],
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: String,
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
    },
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default models.Order || model("Order", orderSchema);
