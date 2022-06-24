import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layout";
import { CartContext } from "../../context";
import { countries } from "../../utils/countries";
import { useRouter } from "next/router";
import { Toast } from "components/UI";
import toast from "react-hot-toast";

const SummaryPage = () => {
  const { summary, address, createOrder } = useContext(CartContext);
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!summary) {
      router.push("/checkout/address");
    }
  }, [summary, router]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const resp = await createOrder();
    setIsPosting(false);
    if (!resp.ok) {
      return toast.error(resp.data);
    }
    toast.success("La órden se creó correctamente");
    router.replace(`/order/${resp.data}`);
  };

  return (
    <ShopLayout title="Resumen de la orden">
      <Toast />
      <Typography variant="h1">Resumen</Typography>
      <Typography>Resumen del pedido</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <CartList editable={false} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h2">Resúmen</Typography>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Datos de entrega</Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link>Editar</Link>
                </NextLink>
              </Box>
              <Typography variant="subtitle2">
                {address?.firstName} {address?.lastName}
              </Typography>
              <Typography variant="subtitle2">{address?.address || address?.address2}</Typography>
              <Typography variant="subtitle2">{address?.phone}</Typography>
              <Typography variant="subtitle2">
                ({address?.zip}) {address?.city} - {countries.find((c) => c.code === address?.country || "")?.name}
              </Typography>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Datos de pedido</Typography>
                <NextLink href="/cart" passHref>
                  <Link>Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button fullWidth onClick={onCreateOrder} disabled={isPosting}>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
