import { Container } from "@mui/material";
import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";
interface Props extends PropsWithChildren {
  title?: string;
  desc?: string;
  imgUrl?: string;
}
export const AuthLayout: FC<Props> = ({
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

      <main>
        <Container maxWidth="xl">{children}</Container>
      </main>
    </>
  );
};
