import { Link, Typography } from "@mui/material";
import NextLink from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <NextLink href="/" passHref>
      <Link sx={{ display: "flex", gap: 0.8 }}>
        <Typography variant="h6" color="primary">
          Teslo |
        </Typography>
        <Typography variant="h6" color="secondary">
          Shop
        </Typography>
      </Link>
    </NextLink>
  );
};
