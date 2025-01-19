"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore"; // Importar store
import { createTheme, ThemeProvider } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// Tema de estilo Apple
const appleTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "transparent", // Fondo transparente
    },
    primary: {
      main: "#ffa04d", // Color anaranjado
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
            backdropFilter: "blur(10px)",
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
          color: "white", // Letras blancas
        },
        containedPrimary: {
          backgroundColor: "#ffa04d", // Color anaranjado
          "&:hover": {
            backgroundColor: "#ff8f33",
          },
        },
      },
    },
  },
});

export default function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"alumno" | "entrenador">("alumno");
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async () => {
    // Limpiar errores previos
    setError("");

    // Validaciones iniciales
    if (!code) {
      setError("Por favor, ingresa un código");
      return;
    }

    // Validación de formato según tipo de usuario
    const isValidCode = userType === "entrenador" 
      ? code.toLowerCase() === "yuli25"
      : /^[A-Z]{4}\d{2}$/i.test(code);  // Formato: 4 letras mayúsculas + 2 dígitos

    if (!isValidCode) {
      setError(`Código de ${userType} inválido`);
      return;
    }

    try {
      // Login de entrenador
      if (userType === "entrenador" && code.toLowerCase() === "yuli25") {
        login("entrenador");
        router.push("/entrenador");
        return;
      }

      // Login de alumno
      const response = await fetch('/api/alumno/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          codigo: code.toUpperCase(), // Convertir a mayúsculas
          userType 
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Guardar código de alumno en cookie
        document.cookie = `codigoAlumno=${code.toUpperCase()}; path=/; max-age=3600`;
        login("alumno");
        router.push("/alumno");
      } else {
        // Manejar diferentes tipos de errores
        const errorMessage = data.message || "Código de alumno inválido";
        setError(errorMessage);
        setCode(""); // Limpiar el input
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError("Error de conexión. Intenta de nuevo.");
      setCode(""); // Limpiar el input
    }
  };

  return (
    <ThemeProvider theme={appleTheme}>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh", // Reducir de 100vh a 90vh
          background: "transparent", // Fondo completamente transparente
          backgroundColor: "transparent",
          backgroundImage: "none",
          backdropFilter: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src="/yu.png"
            alt="Yu Routine Logo"
            width={150}
            height={150}
            loading="lazy"
            style={{
              marginBottom: "32px",
              objectFit: "contain",
              width: "auto",
              height: "auto",
              maxWidth: "150px",
              maxHeight: "150px"
            }}
          />

          <Paper
            elevation={4}
            sx={{
              width: "100%",
              padding: 4,
              borderRadius: 4,
              backgroundColor: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: appleTheme.palette.text.primary,
              }}
            >
              Iniciar sesión
            </Typography>

            <ToggleButtonGroup
              color="primary"
              value={userType}
              exclusive
              fullWidth
              onChange={(e, newUserType) => {
                if (newUserType) setUserType(newUserType);
              }}
              sx={{
                mb: 3,
                "& .MuiToggleButton-root": {
                  flexGrow: 1,
                },
              }}
            >
              <ToggleButton value="alumno">Soy Alumno</ToggleButton>
              <ToggleButton value="entrenador">Soy Entrenador</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              fullWidth
              label={`Código de ${userType === "alumno" ? "alumno" : "entrenador"}`}
              variant="outlined"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              inputProps={{
                maxLength: userType === "alumno" ? 6 : undefined,
                style: { textTransform: "uppercase" },
              }}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
              Ingresar
            </Button>

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              {userType === "alumno" ? "Ingresa tu código de 6 dígitos" : "Ingresa tu código de entrenador"}
            </Typography>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
