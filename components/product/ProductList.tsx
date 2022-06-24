import { Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import { IProductSm } from "../../interfaces";

import { ProductCard } from "./ProductCard";
interface Props {
  products: IProductSm[];
  title: string;
  desc: string;
}
export const ProductList: FC<Props> = ({ title, desc, products }) => {
  return (
    <>
      <Typography variant="h1">{title}</Typography>
      <Typography>{desc}</Typography>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={6} sm={4} key={product.slug}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
