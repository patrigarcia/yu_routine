"use client";

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography 
} from '@mui/material';
import { Ejercicio } from '../../types';

interface RutinaTableProps {
  ejercicios: Ejercicio[][];
}

export const RutinaTable: React.FC<RutinaTableProps> = ({ ejercicios }) => {
  if (!ejercicios || ejercicios.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
        No hay ejercicios disponibles
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: 'primary.light' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ejercicio</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Series</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Repeticiones</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Peso</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ejercicios.map((dia, indexDia) => (
            dia.map((ejercicio, indexEjercicio) => (
              <TableRow key={`${indexDia}-${indexEjercicio}`} hover>
                <TableCell component="th" scope="row">
                  {ejercicio.nombreEjercicio}
                </TableCell>
                <TableCell align="right">{ejercicio.series}</TableCell>
                <TableCell align="right">{ejercicio.repeticiones}</TableCell>
                <TableCell align="right">
                  {ejercicio.peso ? `${ejercicio.peso} kg` : 'N/A'}
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
