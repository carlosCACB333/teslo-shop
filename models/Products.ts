import { allowedGenres } from "database";
import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "../interfaces";

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String },
    description: { type: String, required: true },
    images: [{ type: String }],
    inStock: { type: Number, default: 0 },
    price: { type: Number },
    sizes: [
      {
        type: String,
        enum: {
          values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
          message: "{VALUE} no es una talla permitida",
        },
      },
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    type: {
      type: String,
      enum: {
        values: ["shirts", "pants", "hoodies", "hats"],
        message: "{VALUE} no es un tipo válido",
      },
    },
    gender: {
      type: String,
      enum: {
        values: allowedGenres,
        message: "{VALUE} no es un género válido",
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

ProductSchema.index({ title: "text", tags: "text" });

const ProductModel: Model<IProduct> = mongoose.models?.Product || mongoose.model("Product", ProductSchema);

export default ProductModel;
