import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";

import React, { useState } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layout";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { orderdb } from "database";
import { IOrder } from "../../interfaces/products";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Toast } from "components/UI";
import toast from "react-hot-toast";
import { ax } from "api";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order: ord }) => {
  const [order, setOrder] = useState(() => ord);
  const { orderItem, address, _id, ...summary } = order;

  const onOrderCompleted = (id: string, status: string) => {
    if (status !== "COMPLETED") {
      toast.error("Erro en la transacción");
    }

    ax.post<IOrder>("/order/pay", { transactionId: id, orderId: _id })
      .then((res) => {
        toast.success("Orden pagada con éxito");
        setOrder(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("No se pudo realizar el pago");
      });
  };
  return (
    <ShopLayout title="Resumen de la orden ">
      <Toast />
      <Typography variant="h1">Detalle del Orden </Typography>
      <Box display="flex" justifyContent="space-between" marginY={1}>
        <Typography>ID : {_id}</Typography>
        {order.isPaid ? (
          <Chip label="Pagada" color="success" icon={<CreditCardIcon />} />
        ) : (
          <Chip label="Pendiente de pago" color="error" icon={<CreditCardOffIcon />} />
        )}
      </Box>
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
              <Box sx={{ mt: 3 }}>
                {!order.isPaid && (
                  <>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details.id, details.status);
                        });
                      }}
                    />
                    {/* <Button fullWidth startIcon={<CreditCardIcon />}>
                      Pagar
                    </Button> */}
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const id = query.id as string;
  const session: any = await getSession({ req });
  if (!session) {
    return { redirect: { destination: `/auth/login?next=/order/${id}`, permanent: false } };
  }

  const order = await orderdb.getOrderById(id);
  if (!order) {
    return { redirect: { destination: "/order/history", permanent: false } };
  }

  if (order.user !== session.user._id) {
    return { redirect: { destination: "/order/history", permanent: false } };
  }
  return { props: { order } };
};
