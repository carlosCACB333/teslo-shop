import { createContext, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { IAddress, ICart, IErrors, IOrder, ISummary } from "../../interfaces";
import { CartReducer } from "./CartReducer";
import cookie from "js-cookie";
import { ax } from "api";

import { calcSummary } from "utils";
import axios from "axios";

interface CartContextProps {
  isLoaded: boolean;
  cart: ICart[];
  summary: ISummary;
  address?: IAddress;
  addProductToCart: (cart: ICart) => void;
  updateProductInCart: (cart: ICart) => void;
  deleteProductFromCart: (cart: ICart) => void;
  setAddress: (address: IAddress) => void;
  createOrder: () => Promise<{ ok: Boolean; data: string }>;
}

export interface CartState {
  isLoaded: boolean;
  cart: ICart[];
  summary: ISummary;
  address?: IAddress;
}

export const Cart_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  summary: { numberItems: 0, subTotal: 0, taxRate: 0, total: 0, tax: 0 },
};

export const CartContext = createContext<CartContextProps>({} as CartContextProps);

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, Cart_INITIAL_STATE);

  useEffect(() => {
    const prods: ICart[] = JSON.parse(cookie.get("cart") || "[]");
    dispatch({ type: "cart_load_product", payload: prods });
  }, []);

  useEffect(() => {
    if (state.isLoaded) {
      cookie.set("cart", JSON.stringify(state.cart));
    }
  }, [state.cart, state.isLoaded]);

  useEffect(() => {
    const summary = calcSummary(state.cart);
    dispatch({ type: "cart_summary_update", payload: summary });
  }, [state.cart]);

  useEffect(() => {
    const addressCookie = cookie.get("address");
    if (!addressCookie) return;
    dispatch({ type: "address_load_or_set", payload: JSON.parse(addressCookie) });
  }, []);

  const setAddress = (address: IAddress) => {
    dispatch({ type: "address_load_or_set", payload: address });
  };

  const addProductToCart = (productCart: ICart) => {
    dispatch({ type: "cart_add_product", payload: productCart });
  };

  const updateProductInCart = (productCard: ICart) => {
    dispatch({ type: "cart_update_product", payload: productCard });
  };
  const deleteProductFromCart = (productCard: ICart) => {
    dispatch({ type: "cart_delete_product", payload: productCard });
  };

  const createOrder = (): Promise<{ ok: Boolean; data: string }> => {
    const body: IOrder = {
      orderItem: state.cart,
      address: state.address,
      isPaid: false,
      ...state.summary,
    };

    return ax
      .post<IOrder>("/order", body)
      .then((res) => {
        dispatch({ type: "cart_order_complete" });
        return { ok: true, data: res.data._id! };
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const { errors } = err.response?.data as IErrors;
          return { ok: false, data: errors?.notField || "Error inesperado" };
        }
        return { ok: false, data: "Error inesperado" };
      });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductInCart,
        deleteProductFromCart,
        setAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
