export type IRole = "superuser" | "seo" | "admin" | "client";
export interface IUser {
  __v?: Number;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: IRole;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
}

export interface IAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}
