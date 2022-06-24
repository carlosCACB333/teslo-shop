import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import { AuthContext, UIContext } from "../../context";
import { useRouter } from "next/router";
import { DashboardOutlined } from "@mui/icons-material";
import ListItemButton from "@mui/material/ListItemButton";

export const SideMenu = () => {
  const { openMenu, toggleMenu } = useContext(UIContext);
  const { user, logoutUser } = useContext(AuthContext);
  const { palette } = useTheme();
  const [search, setSearch] = useState("");

  const router = useRouter();

  const onNavigateTo = (url: string) => {
    router.push(url);
    toggleMenu();
  };

  const onSearch = () => {
    if (search.trim().length === 0) return;
    router.push(`/search/${search}`);
    toggleMenu();
  };

  return (
    <Drawer
      open={openMenu}
      onClose={() => toggleMenu()}
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
      PaperProps={{ sx: { backgroundColor: palette.background.default } }}
    >
      <Box
        sx={{
          width: 250,
          padding: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          <ListItemButton>
            <Input
              autoFocus={true}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              type="text"
              placeholder="Buscar producto..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={onSearch}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItemButton>

          {user && (
            <>
              <ListItemButton onClick={() => onNavigateTo("/order/history")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mis Ordenes"} />
              </ListItemButton>
            </>
          )}
          {user ? (
            <ListItemButton onClick={logoutUser}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={"Salir"} />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={() => onNavigateTo(`/auth/login?next=${router.asPath}`)}>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ingresar"} />
            </ListItemButton>
          )}

          {/* categorias */}
          <Divider />
          <ListSubheader sx={{ display: { xs: "", sm: "none" } }}>Categorias</ListSubheader>
          <ListItemButton sx={{ display: { xs: "", sm: "none" } }} onClick={() => onNavigateTo("/category/men")}>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Hombres"} />
          </ListItemButton>

          <ListItemButton sx={{ display: { xs: "", sm: "none" } }} onClick={() => onNavigateTo("/category/women")}>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mujeres"} />
          </ListItemButton>

          <ListItemButton sx={{ display: { xs: "", sm: "none" } }} onClick={() => onNavigateTo("/category/kid")}>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={"Niños"} />
          </ListItemButton>

          {/* Admin */}

          {user?.role === "admin" && (
            <>
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItemButton onClick={() => onNavigateTo("/admin")}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItemButton>
              <ListItemButton onClick={() => onNavigateTo("/admin/order")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Ordenes"} />
              </ListItemButton>

              <ListItemButton onClick={() => onNavigateTo("/admin/user")}>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={"Usuarios"} />
              </ListItemButton>
            </>
          )}
        </List>

        <Box sx={{ marginY: 1 }}>
          <Typography textAlign="center" variant="body1">
            ¡ Hola {user?.name} !
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};
