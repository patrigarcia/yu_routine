import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, createTheme, ThemeProvider } from "@mui/material";

interface DialogCancelarProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const soberTheme = createTheme({
  palette: {
    primary: {
      main: "#FF6B35", // Color anaranjado principal
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          textAlign: "center",
          paddingBottom: 8,
          color: "#333",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          textAlign: "left",
          paddingTop: 8,
          paddingBottom: 16,
          color: "#666",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          fontWeight: 500,
          padding: "6px 12px",
        },
        containedPrimary: {
          color: "white",
          backgroundColor: "#FF6B35",
          "&:hover": {
            backgroundColor: "#FF4D00",
          },
        },
        outlinedPrimary: {
          borderColor: "#FF6B35",
          color: "#FF6B35",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 53, 0.05)",
          },
        },
      },
    },
  },
});

export default function DialogCancelar({ open, onClose, onConfirm }: DialogCancelarProps) {
  return (
    <ThemeProvider theme={soberTheme}>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Cancelar creación de rutina</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás segura de que quieres cancelar? Se perderán todos los cambios.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="outlined">
            No, continuar
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
