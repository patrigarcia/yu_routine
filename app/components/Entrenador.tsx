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
  DialogActions,
  TextField
} from '@mui/material';

// Definir interfaz para Rutina
interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function Entrenador() {
  const [openCrearRutina, setOpenCrearRutina] = useState(false);
  const [rutinas, setRutinas] = useState<Rutina[]>([
    { id: 1, nombre: 'Rutina Fuerza', descripcion: 'Entrenamiento de fuerza para principiantes' },
    { id: 2, nombre: 'Rutina Cardio', descripcion: 'Rutina de ejercicios cardiovasculares' }
  ]);

  const [nuevaRutina, setNuevaRutina] = useState<Omit<Rutina, 'id'>>({
    nombre: '',
    descripcion: ''
  });

  const handleCrearRutina = () => {
    if (nuevaRutina.nombre && nuevaRutina.descripcion) {
      const nuevaRutinaConId: Rutina = {
        ...nuevaRutina,
        id: rutinas.length + 1
      };
      setRutinas([...rutinas, nuevaRutinaConId]);
      setOpenCrearRutina(false);
      setNuevaRutina({ nombre: '', descripcion: '' });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Panel de Entrenador
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mb: 3 }}
        onClick={() => setOpenCrearRutina(true)}
      >
        Crear Nueva Rutina
      </Button>

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
                  variant="outlined" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  Editar Rutina
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openCrearRutina} onClose={() => setOpenCrearRutina(false)}>
        <DialogTitle>Crear Nueva Rutina</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Rutina"
            fullWidth
            value={nuevaRutina.nombre}
            onChange={(e) => setNuevaRutina({...nuevaRutina, nombre: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={nuevaRutina.descripcion}
            onChange={(e) => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrearRutina(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCrearRutina} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
