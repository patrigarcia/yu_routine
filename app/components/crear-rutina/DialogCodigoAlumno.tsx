import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Snackbar, Alert } from "@mui/material";

interface DialogCodigoAlumnoProps {
  open: boolean;
  onClose: () => void;
  codigoAlumno: string;
  nombreAlumno?: string;
}

export default function DialogCodigoAlumno({ open, onClose, codigoAlumno, nombreAlumno = "" }: DialogCodigoAlumnoProps) {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(codigoAlumno);
    setOpenSnackbar(true);
  };

  return (
    <>
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
    </>
  );
}
