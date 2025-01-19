"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Container, Paper, Typography, Grid, createTheme, ThemeProvider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

// Definir tipo para ejercicio
interface Ejercicio {
  id?: string;
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video?: string;
}

// Importar componentes modulares
import InformacionAlumno from "./crear-rutina/InformacionAlumno";
import ConfiguracionRutina from "./crear-rutina/ConfiguracionRutina";
import TablaEjercicios from "./crear-rutina/TablaEjercicios";
import DialogCancelar from "./crear-rutina/DialogCancelar";
import DialogCodigoAlumno from "./crear-rutina/DialogCodigoAlumno";
import SnackbarMensaje from "./crear-rutina/SnackbarMensaje";

// Crear un tema personalizado al estilo Apple
const appleTheme = createTheme({
  typography: {
    fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#FF6B35", // Color anaranjado principal
      light: "#FF9F1C", // Tono más claro
      dark: "#FF4D00", // Tono más oscuro
    },
    background: {
      default: "#F2F2F7", // Light gray background
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1D1D1F", // Dark gray text
      secondary: "#86868B", // Light gray text
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
          padding: "24px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "12px 24px",
          fontWeight: 600,
        },
        contained: {
          color: "white", // Texto blanco para botones contenidos
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default function CrearRutina() {
  const theme = useTheme();
  const router = useRouter();

  // Estados
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [codigoAlumno, setCodigoAlumno] = useState("");
  const [diasRutina, setDiasRutina] = useState(1);
  const [ejerciciosPorDia, setEjerciciosPorDia] = useState(1);
  const [ejercicios, setEjercicios] = useState<Ejercicio[][]>([]);
  const [errors, setErrors] = useState({
    nombreAlumno: false,
  });
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openCodigoDialog, setOpenCodigoDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Generar lista de videos una sola vez
  const VIDEOS = useMemo(() => Array.from({ length: 52 }, (_, i) => `${i + 1}.mp4`), []);

  // Validar formulario
  const validateForm = () => {
    let isValid = true;

    if (!nombreAlumno) {
      setErrors((prev) => ({ ...prev, nombreAlumno: true }));
      isValid = false;
    }

    // Validar que todos los ejercicios tengan campos completos
    const todosEjerciciosCompletos = ejercicios.every((dia) => dia.every((ejercicio) => ejercicio.ejercicio && ejercicio.series && ejercicio.repeticiones && ejercicio.kilos && ejercicio.descanso));

    if (!todosEjerciciosCompletos) {
      alert("Por favor, complete todos los campos de los ejercicios");
      return false;
    }

    return isValid;
  };

  // Función para enviar rutina
  const enviarRutina = async () => {
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    // Preparar datos de la rutina
    const datosRutina = {
      nombreAlumno,
      diasRutina,
      ejerciciosPorDia,
      ejercicios: ejercicios,
    };

    try {
      // Enviar rutina al backend
      const response = await fetch("/api/rutinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosRutina),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Rutina guardada exitosamente
        setCodigoAlumno(data.codigoAlumno); // Establecer código recibido del backend
        setOpenCodigoDialog(true);
        setTimeout(() => {
          router.push("/entrenador"); // Redirigir al área de entrenador
        }, 3000);
      } else {
        // Manejar errores del servidor
        alert(data.message || "Error al crear la rutina");
      }
    } catch (error) {
      console.error("Error al enviar rutina:", error);
      alert("Ocurrió un error al crear la rutina");
    }
  };

  // Función para cancelar
  const handleCancelar = () => {
    setOpenCancelDialog(true);
  };

  // Confirmar cancelar
  const confirmCancelar = () => {
    router.push("/entrenador");
  };

  // Efecto para inicializar ejercicios cuando cambian días o ejercicios por día
  useEffect(() => {
    // Crear estructura inicial de ejercicios basada en días y ejercicios por día
    const nuevosEjercicios = Array.from({ length: diasRutina }, () =>
      Array.from({ length: ejerciciosPorDia }, () => ({
        ejercicio: "",
        semana: "1",
        series: "",
        repeticiones: "",
        kilos: "",
        descanso: "",
        video: undefined,
      }))
    );

    // Solo actualizar si los ejercicios están vacíos
    if (ejercicios.length === 0) {
      setEjercicios(nuevosEjercicios);
    }
  }, [diasRutina, ejerciciosPorDia]);

  return (
    <ThemeProvider theme={appleTheme}>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 4,
            backgroundColor: "background.default",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: "text.primary",
              textAlign: "left",
            }}
          >
            Crear nueva rutina
          </Typography>

          {/* Información del Alumno y Configuración en una línea */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  p: 3,
                  boxShadow: 2,
                }}
              >
                <InformacionAlumno nombreAlumno={nombreAlumno} codigoAlumno={codigoAlumno} setNombreAlumno={setNombreAlumno} setCodigoAlumno={setCodigoAlumno} errors={errors} setErrors={setErrors} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  p: 3,
                  boxShadow: 2,
                }}
              >
                <ConfiguracionRutina diasRutina={diasRutina} ejerciciosPorDia={ejerciciosPorDia} setDiasRutina={setDiasRutina} setEjerciciosPorDia={setEjerciciosPorDia} />
              </Box>
            </Grid>
          </Grid>

          {/* Tabla de Ejercicios */}
          <TablaEjercicios diasRutina={diasRutina} ejerciciosPorDia={ejerciciosPorDia} ejercicios={ejercicios} setEjercicios={setEjercicios} videosDisponibles={VIDEOS} />

          {/* Botones de Acción */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
              }}
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={enviarRutina}
              sx={{
                color: "white", // Texto blanco
                fontWeight: 600,
                textTransform: "none",
              }}
              disabled={ejercicios.length === 0}
            >
              Crear rutina
            </Button>
          </Box>
        </Paper>

        {/* Diálogos y Snackbars */}
        <DialogCancelar open={openCancelDialog} onClose={() => setOpenCancelDialog(false)} onConfirm={confirmCancelar} />
        <DialogCodigoAlumno open={openCodigoDialog} onClose={() => setOpenCodigoDialog(false)} codigoAlumno={codigoAlumno} />
        <SnackbarMensaje open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
      </Container>
    </ThemeProvider>
  );
}
