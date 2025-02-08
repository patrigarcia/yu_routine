"use client";

import React from "react";
import { List, ListItem, Typography, Box, useTheme, Stack, Divider } from "@mui/material";

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

interface EjercicioListProps {
  ejercicios: Ejercicio[][];
}

export const EjercicioList: React.FC<EjercicioListProps> = ({ ejercicios }) => {
  const theme = useTheme();

  // Aplanar la estructura de ejercicios
  const flattenedEjercicios = ejercicios.flat();

  if (!flattenedEjercicios.length) {
    return (
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "0.9em",
          fontStyle: "italic",
          textAlign: "center",
          py: 2,
        }}
      >
        No hay ejercicios asignados
      </Typography>
    );
  }

  return (
    <List sx={{ width: "100%", p: 0 }}>
      {flattenedEjercicios.map((ejercicio, index) => (
        <ListItem
          key={ejercicio._id || index}
          sx={{
            px: 0,
            py: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: "0.95em",
              mb: 1,
            }}
          >
            {ejercicio.ejercicio}
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={1.5} 
            alignItems="center" 
            sx={{ 
              color: theme.palette.text.secondary,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: "0.85em" }}>
              {ejercicio.series} series
            </Typography>
            <Typography sx={{ fontSize: "0.85em", color: theme.palette.divider }}>•</Typography>
            <Typography sx={{ fontSize: "0.85em" }}>
              {ejercicio.repeticiones} reps
            </Typography>
            <Typography sx={{ fontSize: "0.85em", color: theme.palette.divider }}>•</Typography>
            <Typography sx={{ fontSize: "0.85em" }}>
              {ejercicio.kilos} kg
            </Typography>
            <Typography sx={{ fontSize: "0.85em", color: theme.palette.divider }}>•</Typography>
            <Typography sx={{ fontSize: "0.85em" }}>
              {ejercicio.descanso}s
            </Typography>
          </Stack>

          {index < flattenedEjercicios.length - 1 && (
            <Divider 
              sx={{ 
                width: "100%", 
                mt: 1.5,
                opacity: 0.6,
              }} 
            />
          )}
        </ListItem>
      ))}
    </List>
  );
};
