import { HomeLayout } from "components/layout";
import React from "react";
import { DataGrid, GridColDef, GridValueGetterParams, GridRowsProp } from "@mui/x-data-grid";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import { Chip, IconButton } from "@mui/material";
import NextLink from "next/link";
import { NorthEast } from "@mui/icons-material";
import useSWR from "swr";
import { Loading } from "components/UI";
import { IOrder } from "interfaces";
import { IUser } from "../../interfaces/users";

const cols: GridColDef[] = [
  {
    field: "idx",
    headerName: "#",
    width: 8,
  },
  {
    field: "id",
    headerName: "ID de la orden",
    flex: 1.5,
  },
  {
    field: "email",
    headerName: "Correo",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
  },
  {
    field: "total",
    headerName: "Total",
  },
  {
    field: "isPaid",
    headerName: "Pagado",
    width: 130,
    renderCell: (params: GridValueGetterParams<any, IOrder>) =>
      params.row.isPaid ? (
        <Chip color="success" label="Pagada" icon={<CreditCardIcon />} />
      ) : (
        <Chip color="error" label="Pendiente" icon={<CreditCardOffIcon />} />
      ),
  },
  {
    field: "numberItems",
    headerName: "Cantidad",
  },

  {
    field: "ver",
    headerName: "Ver",
    sortable: false,
    width: 20,
    renderCell: (params: GridValueGetterParams<any, IOrder>) => (
      <NextLink href={`/admin/order/${params.row._id}`} passHref>
        <IconButton>
          <NorthEast />
        </IconButton>
      </NextLink>
    ),
  },
];

const OrderPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/order");

  if (!data && !error) {
    return <Loading />;
  }
  if (error) {
    return "Error";
  }

  const rows: GridRowsProp = data!.map((order, idx) => ({
    idx: idx + 1,
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    ...order,
  }));
  return (
    <HomeLayout title="Órdenes" subTitle="Listado de todo los órdenes">
      <DataGrid rows={rows} columns={cols} pageSize={10} rowsPerPageOptions={[10]} autoHeight />
    </HomeLayout>
  );
};

export default OrderPage;
