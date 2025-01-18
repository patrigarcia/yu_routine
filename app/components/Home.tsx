"use client";

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import Link from 'next/link';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Navbar from './Navbar';

export default function Home() {
  const features = [
    {
      icon: <SportsGymnasticsIcon color="primary" />,
      title: 'Rutinas Personalizadas',
      description: 'Crea rutinas adaptadas a las necesidades de cada alumno.'
    },
    {
      icon: <DirectionsRunIcon color="primary" />,
      title: 'Seguimiento de Progreso',
      description: 'Monitorea el avance y evolución de tus alumnos.'
    },
    {
      icon: <ScheduleIcon color="primary" />,
      title: 'Gestión de Horarios',
      description: 'Organiza y programa entrenamientos de manera eficiente.'
    },
    {
      icon: <TrackChangesIcon color="primary" />,
      title: 'Objetivos Claros',
      description: 'Define y rastrea metas específicas para cada alumno.'
    }
  ];

  return (
    <Box sx={{ 
      backgroundColor: 'background.default', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Sección de Presentación */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              Yu-Routine
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              gutterBottom 
              sx={{ mb: 3 }}
            >
              La plataforma definitiva para entrenadores deportivos
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ mb: 3 }}
            >
              Simplifica la creación, gestión y seguimiento de rutinas de entrenamiento. 
              Optimiza el rendimiento de tus alumnos con herramientas inteligentes.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="/login/entrenador" passHref>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                >
                  Entrar como Entrenador
                </Button>
              </Link>
              <Link href="/login/alumno" passHref>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="large"
                >
                  Entrar como Alumno
                </Button>
              </Link>
            </Box>
          </Grid>

          {/* Sección de Características */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                backgroundColor: 'background.paper',
                borderRadius: 2 
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ textAlign: 'center', mb: 3 }}
              >
                Características
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>{feature.icon}</ListItemIcon>
                    <ListItemText 
                      primary={feature.title} 
                      secondary={feature.description} 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
