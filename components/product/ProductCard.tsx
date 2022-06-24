import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import Link from "next/link";
import React, { FC, useState } from "react";
import { IProductSm } from "../../interfaces";
import { currencyFormat } from "../../utils";
interface Props {
  product: IProductSm;
}
export const ProductCard: FC<Props> = ({ product }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <>
      <Card onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <Link href={"/product/" + product.slug}>
          <CardActionArea>
            {product.inStock <= 0 && (
              <Chip sx={{ position: "absolute", zIndex: 100, left: 4, top: 4 }} label="No disponible" color="error" />
            )}
            <CardMedia className="fadeIn" component="img" image={isHover ? product.images[1] : product.images[0]} alt={product.title} />
          </CardActionArea>
        </Link>

        <CardContent>
          <Typography fontWeight="bold">{product.title}</Typography>
          <Typography>{currencyFormat(product.price)}</Typography>
        </CardContent>
      </Card>
    </>
  );
};
