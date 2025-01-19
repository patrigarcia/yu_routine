import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Snackbar, Alert } from "@mui/material";

interface DialogCodigoAlumnoProps {
  open: boolean;
  onClose: () => void;
  codigoAlumno: string;
  nombreAlumno?: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6B35", // Color anaranjado principal
      light: "#FF9F1C", // Tono más claro
      dark: "#FF4D00", // Tono más oscuro
    },
  },
});

export default function DialogCodigoAlumno({ open, onClose, codigoAlumno, nombreAlumno = "" }: DialogCodigoAlumnoProps) {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(codigoAlumno);
    setOpenSnackbar(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} aria-labelledby="codigo-alumno-dialog">
        <DialogTitle id="codigo-alumno-dialog">Código de alumno generado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El código para el alumno <strong>{nombreAlumno}</strong> es:
          </DialogContentText>
          <Typography
            variant="h4"
            align="center"
            color="primary"
            sx={{
              fontWeight: "bold",
              my: 2,
              p: 2,
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: 2,
            }}
          >
            {codigoAlumno}
          </Typography>
          <DialogContentText>Por favor, comunica este código al alumno. Le servirá para acceder a su rutina.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopiarCodigo} color="primary">
            Copiar Código
          </Button>
          <Button onClick={onClose} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={10000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Código copiado al portapapeles
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
