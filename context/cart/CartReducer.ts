import { IAddress, ICart, ISummary } from "../../interfaces";
import { CartState } from "./CartContext";

type CartAction =
  | { type: "cart_add_product"; payload: ICart }
  | { type: "cart_update_product"; payload: ICart }
  | { type: "cart_delete_product"; payload: ICart }
  | { type: "cart_load_product"; payload: ICart[] }
  | { type: "cart_summary_update"; payload: ISummary }
  | { type: "address_load_or_set"; payload: IAddress }
  | { type: "cart_order_complete" };

export const CartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "cart_load_product":
      return { ...state, isLoaded: true, cart: [...action.payload] };

    case "cart_add_product": {
      let { _id, size, quantity } = action.payload;
      const inCart = state.cart.some((p) => p._id === _id && p.size === size);
      return {
        ...state,
        cart: inCart
          ? state.cart.map((p) => (p._id === _id ? { ...p, quantity: p.quantity + quantity } : p))
          : [...state.cart, action.payload],
      };
    }

    case "cart_update_product":
      return {
        ...state,
        cart: state.cart.map((p) => (p._id === action.payload._id ? action.payload : p)),
      };

    case "cart_delete_product": {
      let { _id, size } = action.payload;
      return {
        ...state,
        cart: state.cart.filter((p) => !(p._id === _id && p.size === size)),
      };
    }

    case "cart_summary_update":
      return { ...state, summary: { ...state.summary, ...action.payload } };

    case "address_load_or_set":
      return { ...state, address: action.payload };

    case "cart_order_complete":
      return { ...state, cart: [] };

    default:
      return state;
  }
};
