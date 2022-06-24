import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";

import React from "react";
import { CartList, OrderSummary } from "../../../components/cart";
import { HomeLayout } from "../../../components/layout";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { GetServerSideProps, NextPage } from "next";
import { orderdb } from "database";
import { IOrder } from "../../../interfaces/products";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import { Toast } from "components/UI";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { orderItem, address, _id, ...summary } = order;

  return (
    <HomeLayout title="Detalles de la órdenes" subTitle={`Órden : ${_id}`}>
      <Toast />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <CartList editable={false} products={orderItem} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h2">Resúmen</Typography>
              <Divider />
              <Typography variant="subtitle1">Datos de entrega</Typography>
              <Typography variant="subtitle2">
                {address?.firstName} {address?.lastName}
              </Typography>
              <Typography variant="subtitle2">{address?.address || address?.address2}</Typography>
              <Typography variant="subtitle2">{address?.phone}</Typography>
              <Typography variant="subtitle2">
                ( {address?.zip} ) - {address?.city} - {address?.country}
              </Typography>
              <Divider />
              <Typography variant="subtitle1">Datos de pedido</Typography>
              <OrderSummary summary={summary} />
              <Box display="flex" justifyContent="end" mt={2}>
                {order.isPaid ? (
                  <Chip label="Pagada" color="success" icon={<CreditCardIcon />} />
                ) : (
                  <Chip label="Pendiente de pago" color="error" icon={<CreditCardOffIcon />} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </HomeLayout>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const id = query.id as string;
  const order = await orderdb.getOrderById(id);
  return { props: { order } };
};
