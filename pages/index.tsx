import type { NextPage } from "next";
import { ShopLayout } from "../components/layout/ShopLayout";
import { ProductList } from "../components/product";
import { Loading } from "../components/UI";
import { useProduct } from "../hooks";
import { IProductSm } from "../interfaces/products";
const Home: NextPage = () => {
  const { products, isLoading, error } = useProduct<IProductSm[]>("/product");

  return (
    <ShopLayout>
      {isLoading ? <Loading /> : <ProductList products={products || []} title="Tienda" desc="listado de todo los productos" />}
    </ShopLayout>
  );
};

export default Home;
