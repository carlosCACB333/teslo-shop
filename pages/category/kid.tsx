import type { NextPage } from "next";
import { ShopLayout } from "../../components/layout";
import { ProductList } from "../../components/product";
import { Loading } from "../../components/UI";
import { useProduct } from "../../hooks";
import { IProductSm } from "../../interfaces/products";

const KidPage: NextPage = () => {
  const { products, isLoading, error } = useProduct<IProductSm[]>(
    "/product?gender=kid"
  );
  console.log(error);

  return (
    <ShopLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <ProductList
          products={products || []}
          title="Sección Niños"
          desc="Todo muestros productos para niños"
        />
      )}
    </ShopLayout>
  );
};

export default KidPage;
