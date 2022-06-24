import useSWR, { SWRConfiguration } from "swr";
import { IProductSm } from "../interfaces/products";

// const fetcher = (...args: [key: string]) =>
//   fetch(...args).then((res) => res.json());

export const useProduct = <T>(url: string, config: SWRConfiguration = {}) => {
  const { data, error } = useSWR<T>(`/api/${url}`, config);

  return { products: data, isLoading: !error && !data, error };
};
