"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Container, Typography, Box, TextField, Button, Paper, Grid, IconButton, createTheme, ThemeProvider, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Tema de estilo Apple
const appleTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ffa04d", // Color anaranjado
    },
    background: {
      default: "transparent",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.8)",
            "&.Mui-focused fieldset": {
              borderColor: "#ffa04d",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          padding: "12px 24px",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#ffa04d",
          color: "white",
          "&:hover": {
            backgroundColor: "#ff8f33",
          },
        },
      },
    },
  },
});

interface Ejercicio {
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video?: string | null;
}

export default function EditarRutina() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoAlumno = searchParams.get("codigoAlumno");

  const [rutina, setRutina] = useState<{
    nombreAlumno: string;
    codigoAlumno: string;
    ejercicios: Ejercicio[][];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRutina = async () => {
      if (!codigoAlumno) {
        setError("Código de alumno no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/rutinas/${codigoAlumno}`);
        const data = await response.json();

        if (data.status === "success") {
          setRutina(data.rutina);
        } else {
          setError(data.message || "Error al cargar la rutina");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching routine:", err);
        setError("No se pudo cargar la rutina");
        setLoading(false);
      }
    };

    fetchRutina();
  }, [codigoAlumno]);

  const handleUpdateEjercicio = (diaIndex: number, ejercicioIndex: number, field: keyof Ejercicio, value: string) => {
    if (!rutina) return;

    const nuevosEjercicios = [...rutina.ejercicios];
    nuevosEjercicios[diaIndex] = [...nuevosEjercicios[diaIndex]];
    nuevosEjercicios[diaIndex][ejercicioIndex] = {
      ...nuevosEjercicios[diaIndex][ejercicioIndex],
      [field]: value,
    };

    setRutina({
      ...rutina,
      ejercicios: nuevosEjercicios,
    });
  };

  const handleSaveRutina = async () => {
    if (!rutina) return;

    try {
      const response = await fetch("/api/rutinas/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rutina),
      });

      const data = await response.json();

      if (data.status === "success") {
        router.push("/entrenador");
      } else {
        setError(data.message || "Error al guardar la rutina");
      }
    } catch (err) {
      console.error("Error saving routine:", err);
      setError("No se pudo guardar la rutina");
    }
  };

  const handleAddEjercicio = (diaIndex: number) => {
    if (!rutina) return;

    const nuevosEjercicios = [...rutina.ejercicios];
    nuevosEjercicios[diaIndex] = [
      ...nuevosEjercicios[diaIndex],
      {
        ejercicio: "",
        semana: "",
        series: "",
        repeticiones: "",
        kilos: "",
        descanso: "",
      },
    ];

    setRutina({
      ...rutina,
      ejercicios: nuevosEjercicios,
    });
  };

  const handleRemoveEjercicio = (diaIndex: number, ejercicioIndex: number) => {
    if (!rutina) return;

    const nuevosEjercicios = [...rutina.ejercicios];
    nuevosEjercicios[diaIndex] = nuevosEjercicios[diaIndex].filter((_, index) => index !== ejercicioIndex);

    setRutina({
      ...rutina,
      ejercicios: nuevosEjercicios,
    });
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!rutina) return <Typography>No se encontró la rutina</Typography>;

  return (
    <ThemeProvider theme={appleTheme}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
          py: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" color="black" sx={{ fontWeight: "bold" }}>
              Editar rutina de {rutina.nombreAlumno}
            </Typography>
          </Box>

          {rutina.ejercicios.map((dia, diaIndex) => (
            <Paper
              key={diaIndex}
              elevation={3}
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            >
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Día {diaIndex + 1}
              </Typography>

              {dia.map((ejercicio, ejercicioIndex) => (
                <Grid container spacing={2} key={ejercicioIndex} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ejercicio"
                      value={ejercicio.ejercicio}
                      onChange={(e) => handleUpdateEjercicio(diaIndex, ejercicioIndex, "ejercicio", e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <TextField
                      fullWidth
                      label="Semana"
                      type="number"
                      value={ejercicio.semana}
                      onChange={(e) => handleUpdateEjercicio(diaIndex, ejercicioIndex, "semana", e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 1, max: 4 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <TextField
                      fullWidth
                      label="Series"
                      type="number"
                      value={ejercicio.series}
                      onChange={(e) => handleUpdateEjercicio(diaIndex, ejercicioIndex, "series", e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <TextField
                      fullWidth
                      label="Repeticiones"
                      type="number"
                      value={ejercicio.repeticiones}
                      onChange={(e) => handleUpdateEjercicio(diaIndex, ejercicioIndex, "repeticiones", e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <TextField
                      fullWidth
                      label="Kilos"
                      type="number"
                      value={ejercicio.kilos}
                      onChange={(e) => handleUpdateEjercicio(diaIndex, ejercicioIndex, "kilos", e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <TextField
                      fullWidth
                      label="Descanso"
                      type="number"
                      value={ejercicio.descanso}
                      onChange={(e) => handleUpdateEjercicio(diaIndex, ejercicioIndex, "descanso", e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton color="error" onClick={() => handleRemoveEjercicio(diaIndex, ejercicioIndex)} sx={{ mt: 0.5 }}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={() => handleAddEjercicio(diaIndex)} sx={{ mt: 2 }}>
                Agregar ejercicio
              </Button>
            </Paper>
          ))}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSaveRutina}>
              Guardar cambios
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
