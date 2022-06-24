import { Box, Button, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useContext, useEffect } from "react";
import { ShopLayout } from "../../components/layout/ShopLayout";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { CartContext } from "../../context";
import { Loading } from "../../components/UI";
import { useRouter } from "next/router";

const EmptyPage = () => {
  const {
    isLoaded,
    summary: { numberItems },
  } = useContext(CartContext);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && numberItems > 0) {
      router.push("/cart");
    }
  }, [isLoaded, numberItems, router]);

  if (!isLoaded) {
    return <Loading />;
  }
  return (
    <ShopLayout title="Empty page">
      <Box display="flex" height="80vh" justifyContent="center" alignItems="center">
        <RemoveShoppingCartIcon color="secondary" sx={{ fontSize: 100 }} />

        <Box>
          <NextLink href="/">
            <>
              <Typography variant="h5" color="secondary">
                El carrito está vacío
              </Typography>
              <Link>Ir a comprar</Link>
            </>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
