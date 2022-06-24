import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ShopLayout } from "../../components/layout";
import { ProductList } from "../../components/product";
import { productdb } from "../../database";
import { IProductSm } from "../../interfaces";

interface Props {
  products: IProductSm[];
  isEmpty: boolean;
  query: string;
}
const SearchPage: NextPage<Props> = ({ products, isEmpty, query }) => {
  return (
    <ShopLayout>
      <ProductList
        products={products}
        title={`Resultado de búsqueda para "${query}"`}
        desc={
          isEmpty
            ? `No se encontraron ninguna coincidencia. Estos productos podrían interesarte`
            : `${products.length} resultados encontrados`
        }
      />
    </ShopLayout>
  );
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context.params as { query: string };
  let products = await productdb.search(query);
  const isEmpty = products.length === 0;
  if (isEmpty) {
    products = await productdb.getAllProduct();
  }
  return { props: { products, isEmpty, query } };
};
