"use client";

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

// Definir interfaz para Rutina
interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function Alumno() {
  const [openRutina, setOpenRutina] = useState(false);
  const [selectedRutina, setSelectedRutina] = useState<Rutina | null>(null);

  const rutinas: Rutina[] = [
    { id: 1, nombre: 'Rutina Fuerza', descripcion: 'Entrenamiento de fuerza para principiantes' },
    { id: 2, nombre: 'Rutina Cardio', descripcion: 'Rutina de ejercicios cardiovasculares' },
    { id: 3, nombre: 'Rutina Flexibilidad', descripcion: 'Ejercicios para mejorar la flexibilidad' }
  ];

  const handleVerRutina = (rutina: Rutina) => {
    setSelectedRutina(rutina);
    setOpenRutina(true);
  };

  const handleCloseRutina = () => {
    setOpenRutina(false);
    setSelectedRutina(null);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Mis Rutinas
      </Typography>

      <Grid container spacing={3}>
        {rutinas.map((rutina) => (
          <Grid item xs={12} sm={6} md={4} key={rutina.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{rutina.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {rutina.descripcion}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => handleVerRutina(rutina)}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openRutina} onClose={handleCloseRutina}>
        <DialogTitle>Detalles de la Rutina</DialogTitle>
        <DialogContent>
          {selectedRutina && (
            <>
              <Typography variant="h6">{selectedRutina.nombre}</Typography>
              <Typography variant="body1">{selectedRutina.descripcion}</Typography>
              {/* Aquí podrías agregar más detalles de la rutina */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRutina} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
