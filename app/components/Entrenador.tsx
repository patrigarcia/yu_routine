"use client";

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid,
  Avatar,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Entrenador() {
  const theme = useTheme();
  const router = useRouter();

  const handleCrearRutina = () => {
    router.push('/crear-rutina');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Información del Perfil */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 4 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            alt="Yuliana Fanaro" 
            src="/perfil.jpg" 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              border: `3px solid ${theme.palette.secondary.main}`
            }} 
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
              Yuliana Fanaro
            </Typography>
            <Typography variant="subtitle1">
              Profesora y Entrenadora Profesional
            </Typography>
          </Box>
        </Box>

        {/* Botones de Acción */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCrearRutina}
            sx={{ 
              backgroundColor: theme.palette.primary.light,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            Crear Rutina
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PeopleIcon />}
            sx={{ 
              backgroundColor: theme.palette.primary.light,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            Mis Alumnos
          </Button>
        </Box>
      </Box>

      {/* Contenido principal del panel */}
      <Box>
        {/* Aquí irán los componentes de rutinas y alumnos */}
      </Box>
    </Container>
  );
}
