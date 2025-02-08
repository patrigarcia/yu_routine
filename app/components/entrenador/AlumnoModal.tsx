"use client";

import React from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { formatearFecha } from '../../utils/formatters';
import { RutinaTable } from './RutinaTable';
import { Alumno, Rutina } from '../../types';

interface AlumnoModalProps {
  open: boolean;
  onClose: () => void;
  alumno: Alumno;
  rutina?: Rutina;
  onEditRutina: (rutina: Rutina) => Promise<void>;
}

export const AlumnoModal: React.FC<AlumnoModalProps> = ({ 
  open, 
  onClose, 
  alumno, 
  rutina, 
  onEditRutina 
}) => {
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-detalles-alumno"
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary">
            Detalles de rutina
          </Typography>
          {rutina && (
            <IconButton 
              color="primary" 
              onClick={() => onEditRutina(rutina)}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {alumno.nombreAlumno}
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Código de alumno</Typography>
              <Typography variant="body1">{alumno.codigoAlumno}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Días de rutina</Typography>
              <Typography variant="body1">{alumno.diasRutina}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Ejercicios por día</Typography>
              <Typography variant="body1">{alumno.ejerciciosPorDia}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Fecha de creación</Typography>
              <Typography variant="body1">{formatearFecha(alumno.fechaCreacion)}</Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Ejercicios de la rutina
        </Typography>
        {rutina && <RutinaTable ejercicios={alumno.ejercicios || []} />}
      </Box>
    </Modal>
  );
};
