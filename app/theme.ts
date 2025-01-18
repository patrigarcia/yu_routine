"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light", // or 'dark'
    primary: {
      main: "#1976d2", // Puedes personalizar este color
    },
    secondary: {
      main: "#dc004e", // Puedes personalizar este color
    },
  },
  typography: {
    fontFamily: '"Geist", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
