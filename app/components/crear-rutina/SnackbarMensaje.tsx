import React from 'react';
import { 
  Snackbar, 
  Alert 
} from '@mui/material';

interface SnackbarMensajeProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
}

export default function SnackbarMensaje({ 
  open, 
  onClose, 
  message,
  severity = 'success'
}: SnackbarMensajeProps) {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={3000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
