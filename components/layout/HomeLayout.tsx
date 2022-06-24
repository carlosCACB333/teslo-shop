import { Box, Container, Typography } from "@mui/material";
import { NavBarAdmin } from "components/admin";
import { SideBar, SideMenu } from "components/UI";
import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title?: string;
  subTitle?: string;
  Icon?: JSX.Element;
}
export const HomeLayout: FC<Props> = ({ title = "TesloShop", subTitle = "venta de accesorios", children, Icon }) => {
  return (
    <>
      <Head>
        <title>TesloShop | Admin </title>
      </Head>

      <SideBar />
      <SideMenu />
      <main style={{ marginLeft: 280 }}>
        <NavBarAdmin />
        <Container maxWidth="xl">
          <Typography variant="h1">
            {Icon} {title}
          </Typography>
          <Typography variant="h2">{subTitle}</Typography>
          <Box marginTop={2}>{children}</Box>
        </Container>
      </main>
    </>
  );
};
