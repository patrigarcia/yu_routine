"use client";

import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  useTheme 
} from '@mui/material';
import { formatearFecha } from '../../utils/formatters';

interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ 
  open, 
  onClose, 
  onChangePassword 
}) => {
  const theme = useTheme();
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const handleGuardarPassword = async () => {
    if (nuevaPassword !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await onChangePassword(passwordActual, nuevaPassword);
      onClose();
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
    }
  };

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
    p: 4,
    outline: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 10,
      background: 'linear-gradient(to right, #FF6B35, #FF9F1C)',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    }
  };

  const textFieldStyle = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      '&.Mui-focused fieldset': {
        borderColor: '#FF6B35',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FF6B35',
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-cambiar-password"
    >
      <Box sx={modalStyle}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: '#333', 
            textAlign: 'center',
            letterSpacing: -0.5 
          }}
        >
          Cambiar contraseña
        </Typography>
        <TextField
          fullWidth
          label="Contraseña actual"
          type="password"
          variant="outlined"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          sx={textFieldStyle}
        />
        <TextField
          fullWidth
          label="Nueva contraseña"
          type="password"
          variant="outlined"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          sx={textFieldStyle}
        />
        <TextField
          fullWidth
          label="Confirmar nueva contraseña"
          type="password"
          variant="outlined"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          sx={textFieldStyle}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleGuardarPassword}
          sx={{
            backgroundColor: '#FF6B35',
            color: 'white',
            borderRadius: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#FF9F1C'
            }
          }}
        >
          Guardar cambios
        </Button>
      </Box>
    </Modal>
  );
};
