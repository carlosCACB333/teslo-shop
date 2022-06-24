import { Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layout";
import { CartContext } from "../../context";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Loading } from "../../components/UI";

const CardPage = () => {
  const {
    isLoaded,
    summary: { numberItems },
  } = useContext(CartContext);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && numberItems <= 0) {
      router.push("/cart/empty");
    }
  }, [isLoaded, numberItems, router]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <ShopLayout>
      <Typography variant="h1">Mi carrito</Typography>
      <Typography>Productos en mi lista</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              <Divider sx={{ marginBottom: 4 }} />

              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button fullWidth onClick={() => router.push("/checkout/address")}>
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CardPage;
