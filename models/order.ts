import { IOrder } from "interfaces";
import { Product, User } from "models";
import mongoose, { Model, Schema } from "mongoose";

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    orderItem: [
      {
        _id: { type: Schema.Types.ObjectId, ref: Product, required: true },
        title: { type: String, requered: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        gender: { type: String, required: true },
      },
    ],

    address: {
      firstName: { type: String, requered: true },
      lastName: { type: String, requered: true },
      address: { type: String, requered: true },
      address2: { type: String },
      zip: { type: String, requered: true },
      city: { type: String, requered: true },
      country: { type: String, requered: true },
      phone: { type: String, requered: true },
    },

    numberItems: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    taxRate: { type: Number, required: true },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: String },
    paymentResult: { type: String },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const OrderModel: Model<IOrder> = mongoose.models?.Order || mongoose.model("Order", OrderSchema);

export default OrderModel;
