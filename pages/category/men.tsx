import type { NextPage } from "next";
import { ShopLayout } from "../../components/layout";
import { ProductList } from "../../components/product";
import { Loading } from "../../components/UI";
import { useProduct } from "../../hooks";
import { IProductSm } from "../../interfaces/products";

const MenPage: NextPage = () => {
  const { products, isLoading, error } = useProduct<IProductSm[]>(
    "/product?gender=men"
  );

  return (
    <ShopLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <ProductList
          products={products || []}
          title="Sección Hombres"
          desc="Todo muestros productos para hombres"
        />
      )}
    </ShopLayout>
  );
};

export default MenPage;
