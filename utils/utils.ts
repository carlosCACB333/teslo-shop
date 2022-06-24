import { ICart } from "interfaces";
import { IProduct, ISummary } from "../interfaces/products";

export const calcSummary = (carts: ICart[]): ISummary => {
  let numberItems = 0;
  let subTotal = 0;
  let taxRate = 0;
  let tax = 0;
  let total = 0;

  carts.forEach((cart, idx) => {
    numberItems += cart.quantity;
    subTotal += cart.quantity * cart.price;
    taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || "0");
    tax = (subTotal * taxRate) / 100;
    tax = Math.round(tax * 100) / 100;
    total = tax + subTotal;
    total = Math.round(total * 100) / 100;
  });

  return { numberItems, subTotal, taxRate, total, tax };
};
