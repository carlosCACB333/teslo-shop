import { Container, Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../components/layout/ShopLayout";

const NotFooundPage = () => {
  return (
    <ShopLayout title="Page Not Found" desc="No se encontró la página">
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 100px)",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h1">404 |</Typography>
        <Typography marginLeft={1}>No se encontró la página</Typography>
      </Container>
    </ShopLayout>
  );
};

export default NotFooundPage;
