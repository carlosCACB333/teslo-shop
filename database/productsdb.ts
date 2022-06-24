import { db } from "../database";
import { Product } from "../models";
import { IProduct, IProductSm } from "../interfaces/products";

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (!product) return null;
  product.images = product.images.map((img) => (img.includes("http") ? img : `${process.env.HOST_NAME}/products/${img}`));
  return JSON.parse(JSON.stringify(product));
};

interface IProductSlug {
  slug: string;
}

export const getAllProductSlug = async (): Promise<IProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select("slug -_id").lean();
  await db.disconnect();
  return slugs;
};
export const getAllProduct = async (): Promise<IProductSm[]> => {
  await db.connect();
  let products = await Product.find().select("title images price inStock slug -_id").lean();
  products = products.map((product) => ({
    ...product,
    images: product.images.map((img) => (img.includes("http") ? img : `${process.env.HOST_NAME}/products/${img}`)),
  }));
  await db.disconnect();
  return products;
};

export const search = async (query: string): Promise<IProductSm[]> => {
  await db.connect();
  let products = await Product.find({
    $text: { $search: query.toLowerCase() },
  })
    .select("title images price inStock slug -_id")
    .lean();

  products = products.map((product) => ({
    ...product,
    images: product.images.map((img) => (img.includes("http") ? img : `${process.env.HOST_NAME}/products/${img}`)),
  }));

  await db.disconnect();
  return products;
};
