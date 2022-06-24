export * from "./products";
export * from "./users";
export * from "./order";

export interface IErrors {
  errors: { [field: string]: string };
}
