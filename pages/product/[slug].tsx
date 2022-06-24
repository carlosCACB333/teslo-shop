import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import React, { useContext, useState } from "react";
import { ShopLayout } from "../../components/layout";
import { ICart, IProduct, ISize } from "../../interfaces/products";

import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { Slideshow } from "../../components/product";
import { Counter, SizeSelector, Toast } from "../../components/UI";
import { productdb } from "../../database";
import { CartContext } from "../../context/cart";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { currencyFormat } from "../../utils/currency";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const [tempCart, setTempCart] = useState<ICart>({
    _id: product._id,
    gender: product.gender,
    image: product.images[0],
    price: product.price,
    quantity: product.inStock <= 0 ? 0 : 1,
    slug: product.slug,
    title: product.title,
    size: undefined,
    inStock: product.inStock,
  });
  const router = useRouter();

  const { addProductToCart } = useContext(CartContext);

  const onChangeSize = (size: ISize) => {
    setTempCart((state) => ({ ...state, size }));
  };

  const onChangeCounter = (quantity: number) => {
    setTempCart((state) => ({ ...state, quantity }));
  };

  const onAddProductToCart = () => {
    if (!tempCart.size) {
      toast.error("Antes debes seleccionar una talla !!");
      return;
    }
    addProductToCart(tempCart);
    toast.success("El producto fue añadido a tu carrito");
    router.push("/cart");
  };

  return (
    <ShopLayout>
      <Toast />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Slideshow images={[...product.images]} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h1">{product.title}</Typography>
            {product.inStock <= 0 && <Chip color="error" label="Sin stock" />}
          </Box>
          <Typography variant="h4">{currencyFormat(product.price)}</Typography>

          <Counter
            title="Cantidad:"
            value={tempCart.quantity}
            max={product.inStock}
            onChangeCounter={onChangeCounter}
          />
          <SizeSelector
            title="Tallas:"
            sizes={product.sizes}
            selected={tempCart.size}
            onChangeSize={onChangeSize}
          />

          <Button
            fullWidth
            color="primary"
            sx={{ marginY: 4 }}
            disabled={product.inStock <= 0}
            onClick={onAddProductToCart}
          >
            {tempCart.size ? "Agregar al carrito" : "Seleccione una talla"}
          </Button>

          <Typography variant="body1">{`${product.description}`}</Typography>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default ProductPage;

export const getStaticPaths: GetStaticPaths = async (context) => {
  const slugs = await productdb.getAllProductSlug();
  const paths = slugs.map(({ slug }) => ({ params: { slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const product = await productdb.getProductBySlug(slug);

  if (!product) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { product }, revalidate: 86400 };
};

// SERVER SIDE RENDER
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { slug } = context.params as { slug: string };
//   const product = await productdb.getProductBySlug(slug);
//   if (!product) {
//     return { redirect: { destination: "/", permanent: false } };
//   }

//   return { props: { product } };
// };
