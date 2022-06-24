import { AppBar, Badge, Box, Button, FormControlLabel, IconButton, Link, Switch, TextField, Toolbar } from "@mui/material";
import React, { useContext, useState } from "react";
import NextLink from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Logo } from "./Logo";
import { useRouter } from "next/router";
import { UIContext } from "../../context";
import { CartContext } from "../../context/cart";
import { DarkMode, LightMode, WbSunny } from "@mui/icons-material";
import { MaterialUISwitch } from "./MaterialUISwitch";

export const NavBar = () => {
  const { asPath, push } = useRouter();
  const { toggleMenu, mode, toggletheme } = useContext(UIContext);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { summary } = useContext(CartContext);
  return (
    <AppBar>
      <nav>
        <Toolbar>
          <Logo />
          <Box flex="1"></Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <NextLink href="/category/men" passHref>
              <Link>
                <Button variant="text" color={asPath === "/category/men" ? "primary" : "secondary"}>
                  Hombres
                </Button>
              </Link>
            </NextLink>
            <NextLink href="/category/women" passHref>
              <Link>
                <Button variant="text" color={asPath === "/category/women" ? "primary" : "secondary"}>
                  Mujeres
                </Button>
              </Link>
            </NextLink>
            <NextLink href="/category/kid" passHref>
              <Link>
                <Button variant="text" color={asPath === "/category/kid" ? "primary" : "secondary"}>
                  Niños
                </Button>
              </Link>
            </NextLink>
          </Box>

          <Box flex="1"></Box>

          <Box position="relative">
            <IconButton onClick={toggleMenu} sx={{ display: { xs: "inline-flex", md: "none" } }}>
              <SearchIcon />
            </IconButton>
            {isSearchVisible ? (
              <TextField
                placeholder="Buscar producto..."
                className="fadeIn"
                value={search}
                type="search"
                autoFocus
                size="small"
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => setIsSearchVisible(false)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && search.trim().length !== 0) {
                    push(`/search/${search}`);
                    setIsSearchVisible(false);
                  }
                }}
                sx={{ position: "absolute", right: "100%", width: 250 }}
              />
            ) : (
              <IconButton
                className="fadeIn"
                sx={{
                  display: {
                    xs: "none",
                    md: "inline-flex",
                    position: "absolute",
                    right: "100%",
                  },
                }}
                onClick={() => setIsSearchVisible(true)}
              >
                <SearchIcon />
              </IconButton>
            )}

            <FormControlLabel
              control={<MaterialUISwitch sx={{ marginLeft: 2 }} checked={mode === "light"} onChange={toggletheme} />}
              label=""
            />
            <NextLink href="/cart" passHref>
              <Link>
                <IconButton>
                  <Badge color="primary" badgeContent={summary.numberItems}>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            </NextLink>
            <IconButton onClick={() => toggleMenu()}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </nav>
    </AppBar>
  );
};
