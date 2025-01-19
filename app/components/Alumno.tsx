"use client";

import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Grid, 
  Pagination,
  Card,
  CardMedia,
  CardContent
} from "@mui/material";

export default function Alumno() {
  const [rutina, setRutina] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await fetch("/api/rutinas/alumno");
        const data = await response.json();

        if (data.status === "success") {
          setRutina(data.rutina);
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
            {currentDayExercises.map((ejercicio: any, index: number) => (
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
    </Container>
  );
}
