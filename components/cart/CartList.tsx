import { Box, Card, CardActionArea, CardMedia, Grid, InputLabel, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { FC, useContext } from "react";
import { ICart, IOrderItem } from "../../interfaces";
import { Counter } from "../UI";
import { Button } from "@mui/material";
import { CartContext } from "../../context/cart";
import { currencyFormat } from "../../utils/currency";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
export const CartList: FC<Props> = ({ editable = true, products }) => {
  const { cart } = useContext(CartContext);

  const productToShow = products || cart;
  return (
    <>
      {productToShow?.map((product) => (
        <CartItem key={product.slug + product.size} product={product} editable={editable} />
      ))}
    </>
  );
};

const CartItem: FC<{ product: ICart; editable: boolean }> = ({ product, editable }) => {
  const { updateProductInCart, deleteProductFromCart } = useContext(CartContext);

  const onChangeCounter = (quantity: number) => {
    updateProductInCart({ ...product, quantity });
  };

  return (
    <Grid container key={product.slug} spacing={2} marginBottom={1}>
      <Grid item xs={3}>
        <NextLink href={`/product/${product.slug}`} passHref>
          <Link>
            <Card>
              <CardActionArea>
                <CardMedia component="img" image={product.image}></CardMedia>
              </CardActionArea>
            </Card>
          </Link>
        </NextLink>
      </Grid>
      <Grid item xs={7}>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {product.title}
          </Typography>
          <InputLabel> Talla : {product.size}</InputLabel>
          {editable ? (
            <Counter title="Cantidad:" value={product.quantity} onChangeCounter={onChangeCounter} max={product.inStock} />
          ) : (
            <InputLabel> Cantidad : {product.quantity}</InputLabel>
          )}
        </Box>
      </Grid>
      <Grid item xs={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography variant="subtitle1">{currencyFormat(product.price)}</Typography>
        {editable && (
          <Button variant="text" color="error" onClick={() => deleteProductFromCart(product)}>
            remover
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
