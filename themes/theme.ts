import { blue, blueGrey, grey, purple, deepPurple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const darkPrimary = "rgb(145, 85, 253)";
const darkPaper = "rgb(33, 43, 54)";
const darkBg = "rgb(22, 28, 36)";
const darkSecondary = "rgba(231, 227, 252, 0.68)";
const darkTxtPrimary = "#fff";
const darkTxtSecondary = "rgba(231, 227, 252, 0.68)";
const DarkError = "rgb(255, 62, 29)";

export const darkTheme = createTheme({
  typography: {
    fontFamily: ["Public Sans", "sans-serif"].join(","),
    fontWeightLight: 300,
    body1: {
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    body2: {
      fontWeight: 400,
      color: darkTxtSecondary,
    },
  },

  shape: {
    borderRadius: 8,
  },

  palette: {
    mode: "dark",
    background: { default: darkBg, paper: darkPaper },
    primary: {
      main: darkPrimary,
    },
    secondary: {
      main: darkSecondary,
    },
    error: {
      main: DarkError,
    },
    text: {
      primary: darkTxtPrimary,
      secondary: darkTxtSecondary,
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },

      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiAppBar: {
      defaultProps: {
        color: "transparent",
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: darkBg,
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: "1.5rem",
          fontWeight: 600,
        },
        h2: {
          fontSize: "1.2rem",
          fontWeight: 400,
          color: darkTxtSecondary,
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600,
        },
      },
    },

    MuiLink: {
      defaultProps: {
        underline: "none",
        color: darkPrimary,
      },
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: darkSecondary,
          paddingTop: 12,
          paddingBottom: 12,
          borderRadius: 8,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: darkSecondary,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          color: darkTxtPrimary,
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    // primary: {
    //   main: "#3A64D8",
    // },
    secondary: {
      main: grey.A700,
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
        color: "GrayText",
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "fixed",
      },
      styleOverrides: {
        root: {
          backgroundColor: "white",
          height: 60,
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 30,
          fontWeight: 600,
        },
        h2: {
          fontSize: 20,
          fontWeight: 400,
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600,
        },
      },
    },

    MuiButton: {
      defaultProps: {
        variant: "contained",

        // size: "small",
        // disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          borderRadius: 10,
          // ":hover": {
          //   backgroundColor: "rgba(0,0,0,0.05)",
          //   transition: "all 0.3s ease-in-out",
          // },
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: "0px 5px 5px rgba(0,0,0,0.05)",
          borderRadius: "10px",
        },
      },
    },
  },
});
