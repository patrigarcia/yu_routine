"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, Button, useTheme, Chip, Divider, Stack } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rutina } from "../../types";
import { EditCardAlumno } from "./EditCardAlumno";
import { EjercicioList } from "./EjercicioList";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AlumnoCardProps {
  alumno: Rutina;
  onDelete: (id: string) => void;
  onSave: (rutina: Rutina) => Promise<void>;
}

export const AlumnoCard: React.FC<AlumnoCardProps> = ({ alumno, onDelete, onSave }) => {
  const theme = useTheme();
  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Obtener el número de semana del primer ejercicio
  const getSemana = (): string => {
    if (alumno.ejercicios && alumno.ejercicios.length > 0) {
      const primerSemana = alumno.ejercicios[0];
      if (primerSemana && primerSemana.length > 0) {
        return primerSemana[0]?.semana || "1";
      }
    }
    return "1";
  };

  const transformedEjercicios = alumno.ejercicios ? alumno.ejercicios.map(day => Object.values(day)) : [];

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        borderRadius: 2,
        height: "400px",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AccountCircleIcon sx={{ fontSize: 44, color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: "1em",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {alumno.nombreAlumno}
          </Typography>
        </Stack>
        <Chip
          label={alumno.codigoAlumno}
          color="primary"
          sx={{
            height: 32,
            "& .MuiChip-label": {
              px: 1.5,
              py: 1.5,
              fontSize: "0.9em",
              fontWeight: 500,
              color: "white",
            },
          }}
        />
      </Stack>

      {/* Semana */}
      <Box mb={2}>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.secondary.main,
            fontWeight: 500,
            fontSize: "1em",
          }}
        >
          Semana {getSemana()}
        </Typography>
      </Box>

      {/* Lista de ejercicios */}
      {alumno.ejercicios && alumno.ejercicios.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: "0.95em",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: theme.palette.text.primary,
                mb: 1.5,
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 20 }} />
              Ejercicios
            </Typography>
            <EjercicioList ejercicios={transformedEjercicios} />
          </Box>
        </>
      )}

      {/* Footer */}
      <Box mt="auto">
        {/* Fecha */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: theme.palette.text.secondary }} mb={2}>
          <CalendarTodayIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontSize: "0.85em" }}>
            Creado el {formatDate(alumno.fechaCreacion)}
          </Typography>
        </Stack>

        {/* Acciones */}
        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={handleOpenEdit}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Editar
          </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(alumno._id)}
            sx={{
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.contrastText,
              },
            }}
          >
            Eliminar
          </Button>
        </Stack>
      </Box>

      <EditCardAlumno open={openEdit} onClose={handleCloseEdit} rutina={alumno} onSave={onSave} />
    </Paper>
  );
};
