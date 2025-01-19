import React, { useState, useEffect } from "react";
import { TextField, Box, Typography, Button, useTheme, IconButton, InputAdornment } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

// Función para generar prefijo de código
const generarPrefijoCodigo = (nombre: string): string => {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
};

interface InformacionAlumnoProps {
  nombreAlumno: string;
  codigoAlumno: string;
  setNombreAlumno: (nombre: string) => void;
  setCodigoAlumno: (codigo: string) => void;
  errors: { nombreAlumno: boolean };
  setErrors: React.Dispatch<React.SetStateAction<{ nombreAlumno: boolean }>>;
}

export default function InformacionAlumno({ nombreAlumno, codigoAlumno, setNombreAlumno, setCodigoAlumno, errors, setErrors }: InformacionAlumnoProps) {
  const theme = useTheme();

  // Regenerar código de alumno
  const regenerarCodigo = () => {
    const prefijoCodigo = generarPrefijoCodigo(nombreAlumno);
    const digitosAleatorios = Math.floor(10 + Math.random() * 90).toString();
    const nuevoCodigo = `${prefijoCodigo}${digitosAleatorios}`;
    setCodigoAlumno(nuevoCodigo);
  };

  // Efecto para generar código automáticamente al cambiar el nombre
  useEffect(() => {
    if (nombreAlumno.length > 0) {
      const prefijoCodigo = generarPrefijoCodigo(nombreAlumno);
      const digitosAleatorios = Math.floor(10 + Math.random() * 90).toString();
      const nuevoCodigo = `${prefijoCodigo}${digitosAleatorios}`;
      setCodigoAlumno(nuevoCodigo);
    } else {
      setCodigoAlumno("");
    }
  }, [nombreAlumno]);

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.primary.main,
          mb: 2,
        }}
      >
        Información del alumno
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          fullWidth
          label="Nombre del alumno"
          placeholder="Nombre y apellido"
          value={nombreAlumno}
          onChange={(e) => {
            setNombreAlumno(e.target.value);
            setErrors((prev) => ({ ...prev, nombreAlumno: false }));
          }}
          error={errors.nombreAlumno}
          helperText={errors.nombreAlumno ? "Nombre del alumno es requerido" : ""}
          sx={{ flex: 1, "& .MuiInputBase-root": { width: "230px" } }}
        />
        <TextField
          fullWidth
          label="Código de alumno"
          value={codigoAlumno}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={regenerarCodigo}>
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            "& .MuiInputBase-root": {
              width: "230px",
            },
          }}
        />
      </Box>
    </Box>
  );
}
