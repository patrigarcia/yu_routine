"use client";

import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Container, 
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid, 
  IconButton,
  InputAdornment,
  Paper, 
  Snackbar, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography 
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { Select, MenuItem } from '@mui/material';

// Definir tipo para ejercicio
type Ejercicio = {
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video: string;
};

// Definir tipo para campos de ejercicio
type EjercicioField = keyof Ejercicio;

const VIDEOS = Array.from({ length: 52 }, (_, i) => `${i + 1}.mp4`);

export default function CrearRutina() {
  const theme = useTheme();
  const router = useRouter();

  const [nombreAlumno, setNombreAlumno] = useState("");
  const [diasRutina, setDiasRutina] = useState(1);
  const [ejerciciosPorDia, setEjerciciosPorDia] = useState(1);
  const [ejercicios, setEjercicios] = useState<Ejercicio[][]>(
    Array(diasRutina).fill(null).map(() => 
      Array(ejerciciosPorDia).fill(null).map(() => ({
        ejercicio: "",
        semana: "",
        series: "",
        repeticiones: "",
        kilos: "",
        descanso: "",
        video: "",
      }))
    )
  );

  // Estado para manejar el video siendo arrastrado
  const [draggedVideo, setDraggedVideo] = useState<string | null>(null);

  // Estado para código de alumno
  const [codigoAlumno, setCodigoAlumno] = useState("");

  // Funciones de Drag and Drop
  const handleDragStart = (video: string, e: React.DragEvent<HTMLVideoElement>) => {
    setDraggedVideo(video);
    e.dataTransfer?.setData('text/plain', video);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = theme.palette.primary.light;
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const handleDrop = (
    diaIndex: number, 
    ejercicioIndex: number, 
    e: React.DragEvent<HTMLTableCellElement>
  ) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'transparent';

    if (draggedVideo) {
      const nuevosEjercicios = [...ejercicios];
      nuevosEjercicios[diaIndex][ejercicioIndex].video = draggedVideo;
      setEjercicios(nuevosEjercicios);
      setDraggedVideo(null);
    }
  };

  const [errors, setErrors] = useState({
    nombreAlumno: false,
    ejercicios: false
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  // Estado para el diálogo de código de alumno
  const [openCodigoDialog, setOpenCodigoDialog] = useState(false);

  const handleEjercicioChange = (
    diaIndex: number,
    ejercicioIndex: number, 
    field: EjercicioField, 
    value: string
  ) => {
    const nuevosEjercicios = [...ejercicios];
    nuevosEjercicios[diaIndex][ejercicioIndex][field] = value;
    setEjercicios(nuevosEjercicios);
  };

  const validateForm = () => {
    const nombreError = nombreAlumno.trim() === '';
    const ejerciciosError = !ejercicios.some(dia => 
      dia.some(ej => 
        ej.ejercicio !== '' && 
        ej.semana !== '' && 
        ej.series !== '' && 
        ej.repeticiones !== '' && 
        ej.kilos !== '' && 
        ej.descanso !== '' && 
        ej.video !== ''
      )
    );

    setErrors({
      nombreAlumno: nombreError,
      ejercicios: ejerciciosError
    });

    return !(nombreError || ejerciciosError);
  };

  // Función para generar prefijo de código
  const generarPrefijoCodigo = (nombreAlumno: string): string => {
    return nombreAlumno
      .normalize('NFD')  // Descomponer caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '')  // Eliminar acentos
      .replace(/[^a-zA-Z]/g, '')  // Eliminar caracteres no alfabéticos
      .toUpperCase()
      .slice(0, 4)
      .padEnd(4, 'X');  // Rellenar con X si es necesario
  };

  // Función para generar código de alumno único
  const generarCodigoAlumno = async (nombreAlumno: string): Promise<string> => {
    const prefijoCodigo = generarPrefijoCodigo(nombreAlumno);
    
    // Generar número aleatorio único
    let codigoAlumno: string;
    let intentos = 0;
    const MAX_INTENTOS = 10;

    do {
      // Generar 2 dígitos aleatorios
      const digitosAleatorios = Math.floor(10 + Math.random() * 90).toString();
      codigoAlumno = `${prefijoCodigo}${digitosAleatorios}`;

      // Verificar si el código ya existe en la base de datos
      try {
        const response = await fetch(`/api/rutinas/verificar-codigo?codigo=${codigoAlumno}`);
        const result = await response.json();
        
        // Si el código no existe, salir del bucle
        if (result.disponible) {
          break;
        }
      } catch (error) {
        console.error('Error al verificar código:', error);
      }

      intentos++;
    } while (intentos < MAX_INTENTOS);

    // Si no se encuentra un código único después de varios intentos, lanzar error
    if (intentos === MAX_INTENTOS) {
      throw new Error('No se pudo generar un código de alumno único');
    }

    return codigoAlumno;
  };

  // Efecto para generar código automáticamente al cambiar el nombre
  useEffect(() => {
    if (nombreAlumno.length > 0) {
      const prefijoCodigo = generarPrefijoCodigo(nombreAlumno);
      setCodigoAlumno(prefijoCodigo);
    } else {
      setCodigoAlumno('');
    }
  }, [nombreAlumno]);

  const handleGuardarRutina = async () => {
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    // Generar código de alumno
    const nuevoCodigoAlumno = await generarCodigoAlumno(nombreAlumno);

    try {
      const response = await fetch('/api/rutinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreAlumno,
          codigoAlumno: nuevoCodigoAlumno,
          diasRutina,
          ejerciciosPorDia,
          ejercicios
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Establecer código de alumno y abrir diálogo
        setOpenCodigoDialog(true);

        // Limpiar formulario después de 3 segundos
        setTimeout(() => {
          // Resetear todos los estados
          setNombreAlumno("");
          setDiasRutina(1);
          setEjerciciosPorDia(1);
          setEjercicios(
            Array(1).fill(null).map(() => 
              Array(1).fill(null).map(() => ({
                ejercicio: "",
                semana: "",
                series: "",
                repeticiones: "",
                kilos: "",
                descanso: "",
                video: "",
              }))
            )
          );

          // Navegar de vuelta a la página de entrenador
          router.push('/entrenador');
        }, 3000);
      } else {
        // Manejar error
        console.error('Error al guardar rutina:', result);
        // Mostrar mensaje de error
        setSnackbarMessage(result.message || 'Error al guardar la rutina');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setSnackbarMessage('No se pudo conectar con el servidor');
      setOpenSnackbar(true);
    }
  };

  const handleCancelar = () => {
    setOpenCancelDialog(true);
  };

  const confirmCancelar = () => {
    router.push('/entrenador');
  };

  // Actualizar ejercicios cuando cambian días o ejercicios por día
  useEffect(() => {
    setEjercicios(
      Array(diasRutina).fill(null).map(() => 
        Array(ejerciciosPorDia).fill(null).map(() => ({
          ejercicio: "",
          semana: "",
          series: "",
          repeticiones: "",
          kilos: "",
          descanso: "",
          video: "",
        }))
      )
    );
  }, [diasRutina, ejerciciosPorDia]);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.palette.secondary.main }}>
          Crear Nueva Rutina
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField 
              fullWidth 
              label="Nombre del Alumno" 
              value={nombreAlumno} 
              onChange={(e) => setNombreAlumno(e.target.value)} 
              sx={{ mb: 2 }}
              error={errors.nombreAlumno}
              helperText={errors.nombreAlumno ? "El nombre del alumno es requerido" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField 
              fullWidth 
              label="Código de Alumno" 
              value={codigoAlumno} 
              inputProps={{ maxLength: 6 }}  
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => {
                        const digitosAleatorios = Math.floor(10 + Math.random() * 90).toString();
                        setCodigoAlumno(prev => {
                          const nuevoCodigo = prev.slice(0, 4) + digitosAleatorios;
                          return nuevoCodigo.slice(0, 6);
                        });
                      }}
                      edge="end"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Días de Rutina"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 7 } }}
              value={diasRutina}
              onChange={(e) => setDiasRutina(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Ejercicios por Día"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              value={ejerciciosPorDia}
              onChange={(e) => setEjerciciosPorDia(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>

        {/* Galería de Videos */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Galería de Videos
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              height: '230px', 
              overflowY: 'auto',
              justifyContent: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 2
            }}
          >
            {VIDEOS.map((video) => (
              <Box 
                key={video} 
                sx={{ 
                  width: '100px', 
                  height: '100px', 
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.5)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    zIndex: 10
                  }
                }}
              >
                <video 
                  src={`/videos/${video}`} 
                  width="100" 
                  height="100" 
                  style={{ 
                    objectFit: 'cover', 
                    borderRadius: 8,
                    filter: 'brightness(1) contrast(1)',
                    transition: 'filter 0.3s ease'
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(video, e)}
                  preload="metadata"
                />
              </Box>
            ))}
          </Box>
        </Box>

        {ejercicios.map((dia, diaIndex) => (
          <Box key={diaIndex} sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Día {diaIndex + 1}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '25%' }}>Ejercicio</TableCell>
                    <TableCell sx={{ width: '10%' }}>Semana</TableCell>
                    <TableCell sx={{ width: '10%' }}>Series</TableCell>
                    <TableCell sx={{ width: '10%' }}>Repeticiones</TableCell>
                    <TableCell sx={{ width: '10%' }}>Kilos</TableCell>
                    <TableCell sx={{ width: '10%' }}>Descanso</TableCell>
                    <TableCell sx={{ width: '10%' }}>Video</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dia.map((ejercicio, ejercicioIndex) => (
                    <TableRow key={ejercicioIndex}>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          value={ejercicio.ejercicio} 
                          onChange={(e) => handleEjercicioChange(diaIndex, ejercicioIndex, "ejercicio", e.target.value)}
                          placeholder="Nombre del ejercicio"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          type="number"
                          InputProps={{ inputProps: { min: 1 } }}
                          value={ejercicio.semana} 
                          onChange={(e) => handleEjercicioChange(diaIndex, ejercicioIndex, "semana", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          type="number"
                          InputProps={{ inputProps: { min: 1 } }}
                          value={ejercicio.series} 
                          onChange={(e) => handleEjercicioChange(diaIndex, ejercicioIndex, "series", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          type="number"
                          InputProps={{ inputProps: { min: 1 } }}
                          value={ejercicio.repeticiones} 
                          onChange={(e) => handleEjercicioChange(diaIndex, ejercicioIndex, "repeticiones", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          type="number"
                          InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                          value={ejercicio.kilos} 
                          onChange={(e) => handleEjercicioChange(diaIndex, ejercicioIndex, "kilos", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={ejercicio.descanso} 
                          onChange={(e) => handleEjercicioChange(diaIndex, ejercicioIndex, "descanso", e.target.value)}
                        />
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          textAlign: 'center',
                          transition: 'background-color 0.3s ease' 
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(diaIndex, ejercicioIndex, e)}
                      >
                        {ejercicio.video ? (
                          <video 
                            src={`/videos/${ejercicio.video}`} 
                            width="80" 
                            height="80" 
                            style={{ 
                              objectFit: 'cover', 
                              borderRadius: 8 
                            }}
                          />
                        ) : (
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                          >
                            Arrastra un video aquí
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        {errors.ejercicios && (
          <Typography 
            variant="body2" 
            color="error" 
            sx={{ mt: 2, textAlign: 'center' }}
          >
            Debe completar al menos un ejercicio con todos sus datos
          </Typography>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancelar}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGuardarRutina}
            sx={{ color: 'white' }}
          >
            Guardar Rutina
          </Button>
        </Box>

        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={3000} 
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog
          open={openCancelDialog}
          onClose={() => setOpenCancelDialog(false)}
        >
          <DialogTitle>Cancelar Creación de Rutina</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que deseas cancelar? Se perderán todos los cambios.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCancelDialog(false)} color="primary">
              No, continuar
            </Button>
            <Button onClick={confirmCancelar} color="secondary" autoFocus>
              Sí, cancelar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo para mostrar código de alumno */}
        <Dialog
          open={openCodigoDialog}
          onClose={() => setOpenCodigoDialog(false)}
          aria-labelledby="codigo-alumno-dialog"
        >
          <DialogTitle id="codigo-alumno-dialog">
            Código de Alumno Generado
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              El código para el alumno <strong>{nombreAlumno}</strong> es:
            </DialogContentText>
            <Typography 
              variant="h4" 
              align="center" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold', 
                my: 2,
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: 2
              }}
            >
              {codigoAlumno}
            </Typography>
            <DialogContentText>
              Por favor, comunique este código al alumno. 
              Le servirá para acceder a su rutina.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                // Copiar al portapapeles
                navigator.clipboard.writeText(codigoAlumno);
                setSnackbarMessage('Código copiado al portapapeles');
                setOpenSnackbar(true);
              }} 
              color="primary"
            >
              Copiar Código
            </Button>
            <Button 
              onClick={() => setOpenCodigoDialog(false)} 
              color="secondary"
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
