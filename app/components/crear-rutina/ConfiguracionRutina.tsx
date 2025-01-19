import React from "react";
import { Box, Typography, TextField, useTheme } from "@mui/material";

interface ConfiguracionRutinaProps {
  diasRutina: number;
  ejerciciosPorDia: number;
  setDiasRutina: (dias: number) => void;
  setEjerciciosPorDia: (ejercicios: number) => void;
}

export default function ConfiguracionRutina({ diasRutina, ejerciciosPorDia, setDiasRutina, setEjerciciosPorDia }: ConfiguracionRutinaProps) {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.primary.main,
          mb: 2,
        }}
      >
        Configuración de rutina
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          fullWidth
          type="number"
          label="Días de rutina"
          variant="outlined"
          value={diasRutina}
          onChange={(e) => {
            const dias = parseInt(e.target.value);
            setDiasRutina(isNaN(dias) ? 1 : Math.max(1, dias));
          }}
          inputProps={{
            min: 1,
            max: 7,
          }}
          sx={{ flex: 2 }}
        />
        <TextField
          fullWidth
          type="number"
          label="Ejercicios por día"
          variant="outlined"
          value={ejerciciosPorDia}
          onChange={(e) => {
            const ejercicios = parseInt(e.target.value);
            setEjerciciosPorDia(isNaN(ejercicios) ? 1 : Math.max(1, ejercicios));
          }}
          inputProps={{
            min: 1,
            max: 10,
          }}
          sx={{ flex: 3 }}
        />
      </Box>
    </Box>
  );
}
