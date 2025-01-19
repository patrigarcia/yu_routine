"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { formatearFecha } from '../../utils/formatters';
import { Rutina } from '../../types';

interface Alumno {
  nombreAlumno: string;
  codigoAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  fechaCreacion: string;
  ejercicios?: any[];
}

interface AlumnoCardProps {
  alumno: Rutina;
  onEditarRutina?: () => void;
}

export const AlumnoCard: React.FC<AlumnoCardProps> = ({ 
  alumno, 
  onEditarRutina 
}) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 2, 
        borderRadius: 2,
        backgroundColor: 'background.paper' 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {alumno.nombreAlumno}
        </Typography>
        <IconButton onClick={onEditarRutina}>
          <EditIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        <Typography variant="subtitle1">Código de alumno:</Typography>
        <Typography variant="body2">{alumno.codigoAlumno}</Typography>

        <Typography variant="subtitle1">Días de rutina:</Typography>
        <Typography variant="body2">{alumno.diasRutina}</Typography>

        <Typography variant="subtitle1">Ejercicios por día:</Typography>
        <Typography variant="body2">{alumno.ejerciciosPorDia}</Typography>

        <Typography variant="subtitle1">Fecha de creación:</Typography>
        <Typography variant="body2">{formatearFecha(alumno.fechaCreacion)}</Typography>
      </Box>
    </Paper>
  );
};
