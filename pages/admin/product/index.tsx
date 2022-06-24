import { Box, Button, CardMedia, Link } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from "@mui/x-data-grid";
import { HomeLayout } from "components/layout";
import { Loading } from "components/UI";
import { IProduct } from "interfaces";
import NextLink from "next/link";
import React from "react";
import useSWR from "swr";

const cols: GridColDef[] = [
  { field: "idx", headerName: "N°", width: 10 },
  {
    field: "image",
    headerName: "Imagen",
    renderCell: ({ row }: GridValueGetterParams<any, IProduct>) => <CardMedia component="img" image={row.images[0]} />,
  },
  {
    field: "title",
    headerName: "Título",
    flex: 2,
    renderCell: ({ row }: GridValueGetterParams<any, IProduct>) => (
      <NextLink href={`/admin/product/${row.slug}`} passHref>
        <Link>{row.title}</Link>
      </NextLink>
    ),
  },
  { field: "gender", headerName: "Género" },
  { field: "type", headerName: "Tipo" },
  { field: "inStock", headerName: "Inventario" },
  { field: "price", headerName: "Precio" },
  { field: "sizes", headerName: "tallas", flex: 1 },
];

const ProductPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/product");

  if (!data && !error) return <Loading />;
  if (error) return "Error";

  const rows: GridRowsProp = data!.map((product, idx) => ({ ...product, id: product._id, idx: ++idx }));
  return (
    <HomeLayout title="Productos" subTitle="Listado de todo los productos">
      <Box display="flex" justifyContent="end" marginY={2}>
        <Button href="/admin/product/new">Nuevo producto</Button>
      </Box>
      <DataGrid rowsPerPageOptions={[10]} columns={cols} rows={rows} pageSize={10} autoHeight />
    </HomeLayout>
  );
};

export default ProductPage;
