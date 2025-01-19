"use client";

import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Grid, 
  Pagination,
  Card,
  CardMedia,
  CardContent,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from "@mui/material";

// Type definitions for routine and exercise
interface Ejercicio {
  _id: string;
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video: string | null;
}

interface Rutina {
  nombreAlumno: string;
  codigoAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: Ejercicio[][];
}

export default function Alumno() {
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});
  const [editingExercise, setEditingExercise] = useState<Ejercicio | null>(null);

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await fetch("/api/rutinas/alumno");
        const data = await response.json();

        if (data.status === "success") {
          setRutina(data.rutina);
          // Initialize completed exercises state
          const initialCompletedState = data.rutina.ejercicios.flat().reduce((acc: { [key: string]: boolean }, ejercicio: Ejercicio) => {
            acc[ejercicio._id] = false;
            return acc;
          }, {});
          setCompletedExercises(initialCompletedState);
        } else {
          console.error("Error al cargar rutina");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error en fetch de rutina:", error);
        setLoading(false);
      }
    };

    fetchRutina();
  }, []);

  const handleDayChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentDay(value);
  };

  const handleExerciseCompletion = (ejercicioId: string, completed: boolean) => {
    setCompletedExercises(prev => ({
      ...prev,
      [ejercicioId]: completed
    }));
  };

  const handleEditExercise = (ejercicio: Ejercicio) => {
    setEditingExercise(ejercicio);
  };

  const handleCloseEditModal = () => {
    setEditingExercise(null);
  };

  const handleSaveEditedExercise = async () => {
    if (!editingExercise || !rutina) return;

    try {
      const response = await fetch("/api/rutinas/alumno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editingExercise)
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Invalid JSON response');
      }

      if (data.status === "success") {
        // Update the routine with the edited exercise
        const updatedRutina = { ...rutina };
        updatedRutina.ejercicios = updatedRutina.ejercicios.map(dayExercises => 
          dayExercises.map(ejercicio => 
            ejercicio._id === editingExercise._id ? editingExercise : ejercicio
          )
        );
        setRutina(updatedRutina);
        handleCloseEditModal();
      } else {
        console.error("Error al guardar ejercicio editado:", data);
        alert(data.message || "Error al guardar el ejercicio");
      }
    } catch (error) {
      console.error("Error al guardar ejercicio:", error);
      alert("No se pudo guardar el ejercicio. Inténtalo de nuevo.");
    }
  };

  if (loading) return <Typography align="center">Cargando...</Typography>;
  if (!rutina) return <Typography align="center">No se encontró la rutina</Typography>;

  const currentDayExercises = rutina.ejercicios[currentDay - 1] || [];

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography 
            variant="h5" 
            color="primary"
            sx={{ 
              fontSize: { xs: '1.2em', sm: '1.4em' },
              mb: 2,
              textAlign: { xs: 'left', sm: 'center' }
            }}
          >
            Rutina de {rutina.nombreAlumno}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography 
            variant="h6"
            sx={{ 
              fontSize: { xs: '1.1em', sm: '1.3em' },
              mb: 2,
              textAlign: { xs: 'left', sm: 'center' }
            }}
          >
            Día {currentDay}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {currentDayExercises.map((ejercicio, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    position: 'relative'
                  }}
                >
                  {ejercicio.video && (
                    <CardMedia
                      component="video"
                      src={`/Videos/${ejercicio.video}`}
                      controls
                      sx={{ 
                        height: 250, 
                        objectFit: 'cover' 
                      }}
                    />
                  )}
                  <CardContent 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      pb: 2 
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '1em', sm: '1.1em' },
                        fontWeight: 'bold',
                        mr: 2
                      }}
                    >
                      {ejercicio.ejercicio}
                    </Typography>
                    <Checkbox 
                      checked={completedExercises[ejercicio._id] || false}
                      onChange={(e) => handleExerciseCompletion(ejercicio._id, e.target.checked)}
                      color="primary"
                    />
                  </CardContent>
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2">Series: {ejercicio.series}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Repeticiones: {ejercicio.repeticiones}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Peso: {ejercicio.kilos} kg</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Descanso: {ejercicio.descanso} seg</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  {!completedExercises[ejercicio._id] && (
                    <CardContent>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => handleEditExercise(ejercicio)}
                        fullWidth
                      >
                        Editar Ejercicio
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
          <Pagination 
            count={rutina.ejercicios.length} 
            page={currentDay} 
            onChange={handleDayChange} 
            color="primary" 
          />
        </Grid>
      </Grid>

      {/* Edit Exercise Modal */}
      <Dialog 
        open={!!editingExercise} 
        onClose={handleCloseEditModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Editar Ejercicio</DialogTitle>
        <DialogContent>
          {editingExercise && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ejercicio"
                  value={editingExercise.ejercicio}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Series"
                  type="number"
                  value={editingExercise.series}
                  onChange={(e) => setEditingExercise({...editingExercise, series: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Repeticiones"
                  type="number"
                  value={editingExercise.repeticiones}
                  onChange={(e) => setEditingExercise({...editingExercise, repeticiones: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Peso (kg)"
                  type="number"
                  value={editingExercise.kilos}
                  onChange={(e) => setEditingExercise({...editingExercise, kilos: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Descanso (seg)"
                  type="number"
                  value={editingExercise.descanso}
                  onChange={(e) => setEditingExercise({...editingExercise, descanso: e.target.value})}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEditedExercise} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
