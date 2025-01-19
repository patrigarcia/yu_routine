import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface DialogCancelarProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DialogCancelar({ open, onClose, onConfirm }: DialogCancelarProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancelar creación de rutina</DialogTitle>
      <DialogContent>
        <DialogContentText>¿Estás segura de que quieres cancelar? Se perderán todos los cambios.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          No, continuar
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Sí, cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
