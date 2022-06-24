import { Grid, Typography } from "@mui/material";
import { ISummary } from "interfaces";
import { NextPage } from "next";
import React, { useContext } from "react";
import { CartContext } from "../../context/cart";
import { currencyFormat } from "../../utils/currency";

interface Props {
  summary?: ISummary;
}
export const OrderSummary: NextPage<Props> = ({ summary: sum1 }) => {
  const { summary: sum2 } = useContext(CartContext);
  const summary = sum1 || sum2;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="subtitle2">Items</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          {summary.numberItems} {`item${summary.numberItems !== 1 ? "s" : ""}`}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2">Sub Total</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>{currencyFormat(summary.subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2">Impuestos({summary.taxRate}%)</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>{currencyFormat(summary.tax)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1">{currencyFormat(summary.total)}</Typography>
      </Grid>
    </Grid>
  );
};
