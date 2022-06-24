import { useTheme } from "@mui/material";
import React from "react";
import { Toaster } from "react-hot-toast";

export const Toast = () => {
  const { palette } = useTheme();
  return (
    <Toaster
      toastOptions={{
        position: "bottom-right",
        style: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          padding: 16,
          border: `2px solid ${palette.primary.main}`,
        },
        duration: 3000,
      }}
    />
  );
};
