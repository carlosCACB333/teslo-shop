import { Container } from "@mui/material";
import Head from "next/head";
import React, { FC } from "react";
import { NavBar, SideMenu } from "../UI";

interface Props {
  title?: string;
  desc?: string;
  imgUrl?: string;
  children: JSX.Element | JSX.Element[];
}
export const ShopLayout: FC<Props> = ({
  title = "TesloShop",
  desc = "venta de accesorios",
  imgUrl,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={desc} />
        {imgUrl && <meta name="og:image" content={imgUrl} />}
      </Head>
      <NavBar />
      <SideMenu />
      <main style={{ marginTop: 70 }}>
        <Container maxWidth="xl">{children}</Container>
      </main>
    </>
  );
};
