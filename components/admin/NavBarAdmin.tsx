import { AppBar, Box, FormControlLabel, IconButton, Toolbar } from "@mui/material";
import React, { useContext } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { UIContext } from "../../context";
import { Logo, MaterialUISwitch } from "components/UI";

export const NavBarAdmin = () => {
  const { toggleMenu, toggletheme, mode } = useContext(UIContext);

  return (
    <AppBar position="sticky">
      <nav>
        <Toolbar>
          <Logo />
          <Box flex="1"></Box>
          <FormControlLabel
            control={<MaterialUISwitch sx={{ marginLeft: 2 }} checked={mode === "light"} onChange={toggletheme} />}
            label=""
          />

          <IconButton onClick={() => toggleMenu()}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </nav>
    </AppBar>
  );
};
