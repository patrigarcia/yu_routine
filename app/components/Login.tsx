"use client";

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'alumno' | 'entrenador'>('alumno');
  const router = useRouter();

  const handleLogin = () => {
    // Código para entrenador hardcodeado
    if (userType === 'entrenador' && code.toLowerCase() === 'yuli25') {
      router.push('/entrenador');
    } 
    // Código para alumno (6 dígitos)
    else if (userType === 'alumno' && /^\d{6}$/.test(code)) {
      router.push('/alumno');
    } 
    else {
      setError('Código inválido. Intenta de nuevo.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      py: 4 // Añadido padding vertical para subir el modal
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          maxWidth: 400, // Límite de ancho para mantener un diseño compacto
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#ff02b5',
            mb: 3 
          }}
        >
          Iniciar Sesión
        </Typography>

        <ToggleButtonGroup
          color="primary"
          value={userType}
          exclusive
          onChange={(e, newUserType) => {
            if (newUserType) setUserType(newUserType);
          }}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="alumno">Soy Alumno</ToggleButton>
          <ToggleButton value="entrenador">Soy Entrenador</ToggleButton>
        </ToggleButtonGroup>

        <TextField 
          fullWidth
          label={`Código de ${userType === 'alumno' ? 'Alumno' : 'Entrenador'}`} 
          variant="outlined"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          inputProps={{ 
            maxLength: userType === 'alumno' ? 6 : undefined,
            style: { textTransform: 'uppercase' }
          }}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '100%', mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <Button 
          fullWidth
          variant="contained" 
          color="primary"
          onClick={handleLogin}
          sx={{ 
            py: 1.5,
            color: 'white' // Texto en blanco
          }}
        >
          Ingresar
        </Button>

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            textAlign: 'center', 
            color: 'text.secondary' 
          }}
        >
          {userType === 'alumno' 
            ? 'Ingresa tu código de 6 dígitos' 
            : 'Ingresa tu código de entrenador'}
        </Typography>
      </Paper>
    </Container>
  );
}
