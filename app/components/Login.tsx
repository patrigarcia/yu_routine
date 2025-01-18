"use client";

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper 
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface LoginProps {
  type: 'alumno' | 'entrenador';
}

export default function Login({ type }: LoginProps) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Lógica de validación de código
    if (codigo.trim() === '') {
      setError('Por favor ingrese un código');
      return;
    }

    try {
      // Aquí iría la lógica de autenticación con MongoDB
      // Por ahora, un ejemplo simple
      if (type === 'alumno' && codigo === 'ALUMNO123') {
        router.push('/alumno');
      } else if (type === 'entrenador' && codigo === 'TRAINER456') {
        router.push('/entrenador');
      } else {
        setError('Código inválido');
      }
    } catch (err) {
      setError('Error en la autenticación');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 4 
        }}
      >
        <Typography component="h1" variant="h5">
          Login {type === 'alumno' ? 'Alumno' : 'Entrenador'}
        </Typography>
        <Box component="form" sx={{ width: '100%', mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Código de Acceso"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color={type === 'alumno' ? 'primary' : 'secondary'}
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Ingresar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
