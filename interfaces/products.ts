import { IAddress, IUser } from "./users";
export type IGenres = "men" | "women" | "kid" | "unisex";
export type ISize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type IType = "shirts" | "pants" | "hoodies" | "hats";

export interface IProductSm {
  title: string;
  slug: string;
  inStock: number;
  images: string[];
  price: number;
}
export interface IProduct extends IProductSm {
  _id: string;
  description: string;
  sizes: ISize[];
  tags: string[];
  type: IType;
  gender: IGenres;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICart extends Omit<IProduct, "images" | "sizes" | "tags" | "description" | "type" | "createdAt" | "updatedAt"> {
  image: string;
  size?: ISize;
  quantity: number;
}

export interface ISummary {
  numberItems: number;
  subTotal: number;
  taxRate: number;
  tax: number;
  total: number;
}

export interface IOrderItem extends ICart {}

export interface IOrder extends ISummary {
  _id?: string;
  user?: IUser | string;
  orderItem: IOrderItem[];
  address?: IAddress;
  paymentResult?: string;
  isPaid: boolean;
  paidAt?: string;
  transactionId?: string;
}
