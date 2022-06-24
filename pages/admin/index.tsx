import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimits,
  SupervisedUserCircle,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { HomeLayout } from "components/layout";
import { Loading } from "components/UI";
import { IDashboard } from "interfaces";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { StatCard } from "../../components/admin/StatCard";

const HomePage = () => {
  const { data, error } = useSWR<IDashboard>("/api/admin/dashboard", { refreshInterval: 1000 * 30 });
  const [reflesh, setReflesh] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => setReflesh((state) => (state > 0 ? state - 1 : 30)), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data && !error) {
    return <Loading />;
  }
  return (
    <HomeLayout title="Dashboard" subTitle="Estadísticas generales" Icon={<DashboardOutlined />}>
      <Grid container spacing={1}>
        {data && (
          <>
            <StatCard title="Ordenes totales" value={data.numberOfOrders} Icon={CreditCardOutlined} />
            <StatCard title="Ordenes pagadas" value={data.paidOrdes} Icon={AttachMoneyOutlined} />
            <StatCard title="Ordenes pendientes" value={data.notPaidOrders} Icon={CreditCardOffOutlined} />
            <StatCard title="Clientes" value={data.numberOfClients} Icon={GroupOutlined} />
            <StatCard title="Productos" value={data.numberOfProducts} Icon={CategoryOutlined} />
            <StatCard title="Sin existencia" value={data.lowInventory} Icon={CancelOutlined} />
            <StatCard title="Bajo inventario" value={data.productsWhitNotInventory} Icon={ProductionQuantityLimits} />
            <StatCard title="Actualizar en:" value={reflesh + " Seg"} Icon={AccessTimeOutlined} />
          </>
        )}
      </Grid>
    </HomeLayout>
  );
};

export default HomePage;
