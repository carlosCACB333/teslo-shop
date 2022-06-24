import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Drawer from "@mui/material/Drawer";
import { NavBarAdmin } from "../admin/NavBarAdmin";
import { Card, CardHeader, CardContent, Avatar, ListSubheader } from "@mui/material";
import { Logo } from "./Logo";
import { CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, Person } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import { useRouter } from "next/router";
import { AuthContext } from "context";

const widthSide = 280;

const urls: { url: string; name: string; icon: JSX.Element }[] = [
  {
    name: "Dashboard",
    url: "/admin",
    icon: <DashboardOutlined />,
  },

  {
    name: "Usuarios",
    url: "/admin/user",
    icon: <GroupIcon />,
  },
  {
    name: "Órdenes",
    url: "/admin/order",
    icon: <ConfirmationNumberOutlined />,
  },
  {
    name: "Productos",
    url: "/admin/product",
    icon: <CategoryOutlined />,
  },
];

export const SideBar = () => {
  const { palette } = useTheme();
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const { user } = React.useContext(AuthContext);

  return (
    <Drawer variant="permanent" open={open} PaperProps={{ sx: { backgroundColor: palette.background.default } }}>
      <Box sx={{ width: widthSide, p: 2 }}>
        <Logo />
        <Card sx={{ marginY: 2 }}>
          <CardContent>
            <Box display="flex" gap={1}>
              <Avatar src={user?.image}>{user?.name}</Avatar>
              <Box>
                <Typography variant="body1">{user?.email}</Typography>
                <Typography variant="body2" textTransform="capitalize">
                  {user?.role}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <List>
          <ListSubheader sx={{}}>
            <ListItemText primary="Admin" />
          </ListSubheader>
          {urls.map((url, index) => (
            <ListItem key={url.name + url.url}>
              <ListItemButton sx={{ color: router.asPath === url.url ? palette.text.primary : null }} onClick={() => router.push(url.url)}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 2,
                    color: router.asPath === url.url ? palette.text.primary : null,
                  }}
                >
                  {url.icon}
                </ListItemIcon>
                <ListItemText primary={url.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};
