import { Chip, IconButton, Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../../components/layout/ShopLayout";
import { DataGrid, GridRowsProp, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import { NorthEast } from "@mui/icons-material";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { orderdb } from "database";
import { IOrder } from "../../interfaces/products";

const cols: GridColDef[] = [
  { field: "id", headerName: "Id" },
  { field: "fullName", headerName: "Nombre completo", flex: 1 },
  {
    field: "paid",
    headerName: "Estado de pago",
    width: 150,
    description: "Información que muestra si la orden ya fue papada",
    renderCell: (params: GridValueGetterParams<any, IOrder>) =>
      params.row.isPaid ? (
        <Chip color="success" label="Pagada" icon={<CreditCardIcon />} />
      ) : (
        <Chip color="error" label="Pendiente" icon={<CreditCardOffIcon />} />
      ),
  },
  {
    field: "ver",
    headerName: "Ver",
    sortable: false,
    renderCell: (params: GridValueGetterParams) => (
      <NextLink href={`/order/${params.row._id}`} passHref>
        <IconButton>
          <NorthEast />
        </IconButton>
      </NextLink>
    ),
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows: GridRowsProp = orders.map((or, idx) => ({
    _id: or._id,
    id: idx + 1,
    fullName: or.address?.firstName + " " + or.address?.lastName,
    ...or,
  }));

  return (
    <ShopLayout>
      <Typography variant="h1">Mis compras </Typography>
      <Typography>Historial de órdenes</Typography>
      <DataGrid rows={rows} columns={cols} pageSize={10} rowsPerPageOptions={[10]} autoHeight></DataGrid>
    </ShopLayout>
  );
};

export default HistoryPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });
  if (!session) {
    return { redirect: { destination: `/auth/login?next=/order/history}`, permanent: false } };
  }
  const uid = session.user._id;
  const orders = await orderdb.getOrdersByUser(uid);

  return { props: { orders } };
};
