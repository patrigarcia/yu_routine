"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rutina, Ejercicio } from "../../types";

interface EditCardAlumnoProps {
  open: boolean;
  onClose: () => void;
  rutina: Rutina;
  onSave: (rutina: Rutina) => Promise<void>;
}

export const EditCardAlumno: React.FC<EditCardAlumnoProps> = ({
  open,
  onClose,
  rutina,
  onSave,
}) => {
  const theme = useTheme();
  const [editedRutina, setEditedRutina] = useState<Rutina>(rutina);
  const [nuevoEjercicio, setNuevoEjercicio] = useState<Ejercicio>({
    ejercicio: "",
    semana: "1",
    series: "0",
    repeticiones: "0",
    kilos: "0",
    descanso: "0",
    video: "",
  });

  const handleAddEjercicio = () => {
    const newEjercicios = [...(editedRutina.ejercicios || [])];
    
    // Si no hay ejercicios para la semana actual, crear un nuevo array
    if (!newEjercicios[0]) {
      newEjercicios[0] = [];
    }

    // Crear un nuevo objeto ejercicio con la estructura correcta
    const ejercicioObj: { [key: string]: Ejercicio } = {
      [`ejercicio_${Date.now()}`]: {
        ...nuevoEjercicio,
        semana: nuevoEjercicio.semana || "1",
        series: nuevoEjercicio.series || "0",
        repeticiones: nuevoEjercicio.repeticiones || "0",
        kilos: nuevoEjercicio.kilos || "0",
        descanso: nuevoEjercicio.descanso || "0",
      }
    };

    newEjercicios[0].push(ejercicioObj);

    setEditedRutina({
      ...editedRutina,
      ejercicios: newEjercicios,
    });

    // Resetear el formulario
    setNuevoEjercicio({
      ejercicio: "",
      semana: "1",
      series: "0",
      repeticiones: "0",
      kilos: "0",
      descanso: "0",
      video: "",
    });
  };

  const handleDeleteEjercicio = (semanaIndex: number, ejercicioIndex: number) => {
    const newEjercicios = [...(editedRutina.ejercicios || [])];
    newEjercicios[semanaIndex].splice(ejercicioIndex, 1);
    
    // Si la semana queda vacía, eliminarla
    if (newEjercicios[semanaIndex].length === 0) {
      newEjercicios.splice(semanaIndex, 1);
    }

    setEditedRutina({
      ...editedRutina,
      ejercicios: newEjercicios,
    });
  };

  const handleSave = async () => {
    await onSave(editedRutina);
    onClose();
  };

  const handleInputChange = (field: keyof Ejercicio, value: string) => {
    setNuevoEjercicio(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Editar Rutina
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Formulario para agregar ejercicio */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "flex-start" }}>
          <TextField
            label="Ejercicio"
            value={nuevoEjercicio.ejercicio}
            onChange={(e) => handleInputChange("ejercicio", e.target.value)}
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            label="Series"
            type="number"
            value={nuevoEjercicio.series}
            onChange={(e) => handleInputChange("series", e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Repeticiones"
            type="number"
            value={nuevoEjercicio.repeticiones}
            onChange={(e) => handleInputChange("repeticiones", e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Kilos"
            type="number"
            value={nuevoEjercicio.kilos}
            onChange={(e) => handleInputChange("kilos", e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Descanso (s)"
            type="number"
            value={nuevoEjercicio.descanso}
            onChange={(e) => handleInputChange("descanso", e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Video URL"
            value={nuevoEjercicio.video}
            onChange={(e) => handleInputChange("video", e.target.value)}
            size="small"
            sx={{ flex: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddEjercicio}
            sx={{ height: "40px" }}
          >
            Agregar
          </Button>
        </Box>

        {/* Tabla de ejercicios */}
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ejercicio</TableCell>
                <TableCell align="center">Series</TableCell>
                <TableCell align="center">Repeticiones</TableCell>
                <TableCell align="center">Kilos</TableCell>
                <TableCell align="center">Descanso (s)</TableCell>
                <TableCell align="center">Video</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editedRutina.ejercicios?.map((semana, semanaIndex) =>
                semana.map((ejercicioObj, ejercicioIndex) => {
                  const ejercicio = Object.values(ejercicioObj)[0];
                  return (
                    <TableRow key={ejercicioIndex}>
                      <TableCell>{ejercicio.ejercicio}</TableCell>
                      <TableCell align="center">{ejercicio.series}</TableCell>
                      <TableCell align="center">{ejercicio.repeticiones}</TableCell>
                      <TableCell align="center">{ejercicio.kilos}</TableCell>
                      <TableCell align="center">{ejercicio.descanso}</TableCell>
                      <TableCell align="center">
                        {ejercicio.video && (
                          <Button
                            size="small"
                            href={ejercicio.video}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteEjercicio(semanaIndex, ejercicioIndex)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
