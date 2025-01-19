"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  createTheme,
  ThemeProvider,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/authStore';

const alumnoTheme = createTheme({
  palette: {
    primary: {
      main: "#FF6B35", // Color anaranjado principal
    },
  },
  typography: {
    fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 16,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default function AlumnoRutinaPage() {
  const [rutina, setRutina] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { codigoAlumno, isLoggedIn, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/alumno/login');
      return;
    }

    const fetchRutina = async () => {
      try {
        const response = await fetch(`/api/rutinas/${codigoAlumno}`);
        const data = await response.json();

        if (data.success) {
          setRutina(data.rutina);
        } else {
          console.error('Error al cargar rutina');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error en fetch de rutina:', error);
        setLoading(false);
      }
    };

    fetchRutina();
  }, [codigoAlumno, isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push('/alumno/login');
  };

  if (loading) {
    return (
      <ThemeProvider theme={alumnoTheme}>
        <Container maxWidth="md">
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Cargando rutina...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (!rutina) {
    return (
      <ThemeProvider theme={alumnoTheme}>
        <Container maxWidth="md">
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No se encontró la rutina
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={alumnoTheme}>
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              backgroundColor: '#f9f9f9' 
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}>
              <Typography variant="h4" color="primary">
                Mi Rutina
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {rutina.nombreAlumno}
            </Typography>

            {rutina.ejercicios.map((dia: any, diaIndex: number) => (
              <Accordion key={diaIndex}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`dia-${diaIndex}-content`}
                  id={`dia-${diaIndex}-header`}
                >
                  <Typography variant="subtitle1" color="primary">
                    Día {diaIndex + 1}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {dia.map((ejercicio: any, ejercicioIndex: number) => (
                      <Grid item xs={12} key={ejercicioIndex}>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            backgroundColor: '#fff' 
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body1" color="textPrimary">
                                <strong>Ejercicio:</strong> {ejercicio.ejercicio}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Series:</strong> {ejercicio.series}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Repeticiones:</strong> {ejercicio.repeticiones}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Kilos:</strong> {ejercicio.kilos}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Descanso:</strong> {ejercicio.descanso}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
