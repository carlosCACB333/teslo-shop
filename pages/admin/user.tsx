import { MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from "@mui/x-data-grid";
import { ax } from "api";
import { HomeLayout } from "components/layout";
import { Loading, Toast } from "components/UI";
import { IUser } from "interfaces";
import React from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { allowedRoles } from "../../database/constant";
import { IRole } from "../../interfaces/users";

const UserPage = () => {
  const { data, error, mutate } = useSWR<IUser[]>("/api/admin/user");
  if (!data && !error) {
    return <Loading />;
  }

  const cols: GridColDef[] = [
    {
      field: "idx",
      headerName: "#",
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Nombre completo",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Rol",
      width: 140,
      renderCell: ({ row }: GridValueGetterParams<any, IUser>) => {
        return (
          <Select fullWidth value={row.role} label="Role" size="small" onChange={(e) => changeRole(e.target.value as any, row._id!)}>
            {allowedRoles.map((rol) => (
              <MenuItem key={rol} value={rol}>
                {rol}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  const rows: GridRowsProp = data!.map((user, idx) => ({ idx: idx + 1, id: user._id, ...user }));

  const changeRole = (role: IRole, uid: string) => {
    ax.put<IUser>("/admin/user", { role, uid })
      .then((res) => {
        toast.success(`Ahora ${res.data.name} es ${res.data.role.toUpperCase()}`);
        mutate(
          data?.map((d) => (d._id === res.data._id ? res.data : d)),
          { revalidate: false }
        );
      })
      .catch((err) => toast.error("No se pudo cambiar el rol"));
  };

  return (
    <HomeLayout title="Usuarios" subTitle="Gestion de todo los usuarios">
      <Toast />
      <DataGrid columns={cols} rows={rows} autoHeight />
    </HomeLayout>
  );
};

export default UserPage;
