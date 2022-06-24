import type { NextPage } from "next";
import { ShopLayout } from "../../components/layout";
import { ProductList } from "../../components/product";
import { Loading } from "../../components/UI";
import { useProduct } from "../../hooks";
import { IProductSm } from "../../interfaces/products";

const WomenPage: NextPage = () => {
  const { products, isLoading, error } = useProduct<IProductSm[]>(
    "/product?gender=women"
  );

  return (
    <ShopLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <ProductList
          products={products || []}
          title="Sección Damas"
          desc="Todo muestros productos para Damas"
        />
      )}
    </ShopLayout>
  );
};

export default WomenPage;
