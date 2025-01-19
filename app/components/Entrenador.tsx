"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Avatar,
  useTheme,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  Modal,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ViewListIcon from "@mui/icons-material/ViewList";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Ejercicio {
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video?: string | null;
}

interface Rutina {
  nombreAlumno: string;
  codigoAlumno: string;
  fechaCreacion: string;
  ejercicios: Ejercicio[][];
}

interface Alumno {
  id: string;
  nombreAlumno: string;
  codigoAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: Ejercicio[][];
  fechaCreacion: string;
  entrenadorId: string;
}

export default function Entrenador() {
  const theme = useTheme();
  const router = useRouter();

  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [isSearchFiltered, setIsSearchFiltered] = useState(false);
  const [selectedRutina, setSelectedRutina] = useState<Rutina | null>(null);

  // Estados para cambiar contraseña
  const [openCambiarPassword, setOpenCambiarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Función para abrir modal de cambiar contraseña
  const handleCambiarPassword = () => {
    setOpenCambiarPassword(true);
  };

  // Función para cerrar modal de cambiar contraseña
  const handleCloseCambiarPassword = () => {
    setOpenCambiarPassword(false);
    // Limpiar campos
    setPasswordActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
  };

  // Función para guardar nueva contraseña
  const handleGuardarPassword = async () => {
    // Validar campos
    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      alert("Por favor, complete todos los campos");
      return;
    }

    // Validar longitud de la nueva contraseña
    if (!/^\d{6}$/.test(nuevaPassword)) {
      alert("La nueva contraseña debe ser de 6 dígitos");
      return;
    }

    // Validar que las contraseñas coincidan
    if (nuevaPassword !== confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch('/api/entrenador/cambiar-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigoAcceso: 'yuli25', // Código de acceso hardcodeado por ahora
          nuevaContrasena: nuevaPassword
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Contraseña actualizada exitosamente');
        setOpenCambiarPassword(false);
      } else {
        alert(data.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert('Error al cambiar la contraseña');
    }
  };

  // Función para obtener rutinas
  const fetchRutinas = async () => {
    try {
      const response = await fetch("/api/rutinas");
      const data = await response.json();

      if (data.status === "success") {
        setRutinas(data.rutinas);
        setLoading(false);
      } else {
        setError(data.message || "Error al cargar rutinas");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching routines:", err);
      setError("No se pudieron cargar las rutinas");
      setLoading(false);
    }
  };

  // Función para buscar rutinas por nombre de alumno
  const fetchRutinasBySearch = async (searchTerm: string) => {
    try {
      const response = await fetch(`/api/rutinas?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      console.log("Respuesta de búsqueda de rutinas:", data);

      if (data.status === "success") {
        setRutinas(data.rutinas);
        setLoading(false);
        setIsSearchFiltered(true); // Marcar que se está usando un filtro de búsqueda
      } else {
        setError(data.message || "Error al buscar rutinas");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error searching routines:", err);
      setError("No se pudieron buscar las rutinas");
      setLoading(false);
    }
  };

  // Función para obtener alumnos
  const fetchAlumnos = async () => {
    try {
      const response = await fetch("/api/alumnos");
      const data = await response.json();

      console.log("Respuesta de API de alumnos:", data);

      if (data.status === "success") {
        console.log("Alumnos cargados:", data.alumnos);
        setAlumnos(data.alumnos);
      } else {
        console.error("Error al cargar alumnos:", data.message);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Función para buscar alumnos
  const fetchAlumnosBySearch = async (searchTerm: string) => {
    try {
      const response = await fetch(`/api/alumnos?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      console.log("Respuesta de búsqueda de alumnos:", data);

      if (data.status === "success" && data.alumnos.length > 0) {
        console.log("Alumno encontrado:", data.alumnos[0]);
        // Seleccionar el primer alumno encontrado
        setSelectedAlumno(data.alumnos[0]);
      } else {
        console.error("Error al buscar alumnos:", data.message);
        alert("No se encontró ningún alumno con ese nombre");
        setSelectedAlumno(null);
      }
    } catch (err) {
      console.error("Error searching students:", err);
      alert("Hubo un error al buscar el alumno");
      setSelectedAlumno(null);
    }
  };

  const handleSearchAlumno = () => {
    console.log("Buscando alumno:", searchTerm);

    if (searchTerm.trim() === "") {
      // Si el término de búsqueda está vacío, cargar todas las rutinas
      fetchRutinas();
      setIsSearchFiltered(false); // Desactivar el filtro de búsqueda
    } else {
      // Buscar rutinas con el término ingresado
      fetchRutinasBySearch(searchTerm);
    }
  };

  const handleMostrarTodasRutinas = () => {
    fetchRutinas();
    setIsSearchFiltered(false);
    setSearchTerm(""); // Limpiar el término de búsqueda
  };

  const handleCrearRutina = () => {
    router.push("/crear-rutina");
  };

  const handleCloseModal = () => {
    setSelectedAlumno(null);
  };

  const handleEditarRutina = () => {
    if (selectedRutina) {
      // Navegar a la página de edición de rutina con el código del alumno
      router.push(`/editar-rutina?codigoAlumno=${selectedRutina.codigoAlumno}`);
    }
  };

  const handleVerRutina = (rutina: Rutina) => {
    setSelectedRutina(rutina);
  };

  const handleCloseRutinaModal = () => {
    setSelectedRutina(null);
  };

  // Función para formatear fecha en DD-MM-AAAA
  const formatearFecha = (fecha: Date | string) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, "0");
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const año = fechaObj.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  useEffect(() => {
    fetchRutinas();
    fetchAlumnos();
  }, []);

  return (
    <Container
      sx={{
        mt: 4, // Añadir margin-top de 4 unidades (32px por defecto en Material-UI)
        maxWidth: "lg", // Opcional: establecer un ancho máximo para una mejor legibilidad
        width: "100%",
      }}
    >
      {/* Información del Perfil */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt="Yuliana Fanaro"
            src="/perfil.jpg"
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              border: `3px solid ${theme.palette.secondary.main}`,
            }}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: theme.palette.secondary.main, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              Yuliana Fanaro
              <IconButton 
                color="primary" 
                size="small" 
                sx={{ ml: 1 }}
                onClick={handleCambiarPassword}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Typography>
            <Typography variant="subtitle1">Profesora de Educación física | Personal Trainer</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCrearRutina}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: "white",
              mt: 2,
              width: "auto",
              minWidth: 100,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            Crear rutina
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField variant="outlined" size="small" placeholder="Buscar alumno" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="secondary" onClick={handleSearchAlumno}>
              Buscar
            </Button>
            {isSearchFiltered && (
              <Button variant="contained" color="primary" onClick={handleMostrarTodasRutinas}>
                Mostrar todas las rutinas
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Modal de Alumno */}
      <Modal
        open={!!selectedAlumno}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 4,
            width: "80%",
            maxWidth: 600,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {selectedAlumno && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">
                  {selectedAlumno.nombreAlumno}
                </Typography>
                <Box>
                  <IconButton onClick={handleEditarRutina}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleCloseModal}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="subtitle1">Código de Alumno: {selectedAlumno.codigoAlumno}</Typography>
              <Typography variant="subtitle1">Días de Rutina: {selectedAlumno.diasRutina}</Typography>
              <Typography variant="subtitle1">Ejercicios por Día: {selectedAlumno.ejerciciosPorDia}</Typography>
              <Typography variant="subtitle1">Fecha de Creación: {formatearFecha(selectedAlumno.fechaCreacion)}</Typography>

              {/* Listado de Ejercicios del Alumno */}
              {selectedAlumno.ejercicios && selectedAlumno.ejercicios.length > 0 ? (
                selectedAlumno.ejercicios.map((diaEjercicios, index) => (
                  <Accordion key={index} sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Día {index + 1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Ejercicio</TableCell>
                              <TableCell>Semana</TableCell>
                              <TableCell>Series</TableCell>
                              <TableCell>Repeticiones</TableCell>
                              <TableCell>Kilos</TableCell>
                              <TableCell>Descanso</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {diaEjercicios.map((ejercicio, ejercicioIndex) => (
                              <TableRow key={ejercicioIndex}>
                                <TableCell>{ejercicio.ejercicio}</TableCell>
                                <TableCell>{ejercicio.semana}</TableCell>
                                <TableCell>{ejercicio.series}</TableCell>
                                <TableCell>{ejercicio.repeticiones}</TableCell>
                                <TableCell>{ejercicio.kilos}</TableCell>
                                <TableCell>{ejercicio.descanso}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  No hay ejercicios registrados para este alumno
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>

      {/* Modal de Rutina */}
      {selectedRutina && (
        <Modal
          open={!!selectedRutina}
          onClose={handleCloseRutinaModal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "90%",
              maxWidth: 800,
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" color="primary">
                Detalles de Rutina
              </Typography>
              <Box>
                <IconButton color="primary" onClick={handleEditarRutina} sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={handleCloseRutinaModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2, alignItems: "center", height: "100%" }}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.primary.light + "20",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Nombre del alumno
                  </Typography>
                  <Typography variant="h6">{selectedRutina.nombreAlumno}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.secondary.light + "20",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" color="secondary" gutterBottom>
                    Código de alumno
                  </Typography>
                  <Typography variant="h6">{selectedRutina.codigoAlumno}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.success.light + "20",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" color="success" gutterBottom>
                    Fecha de Creación
                  </Typography>
                  <Typography variant="h6">{formatearFecha(selectedRutina.fechaCreacion)}</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Listado de Ejercicios */}
            {selectedRutina.ejercicios.map((dia: Ejercicio[], diaIndex: number) => (
              <Accordion
                key={diaIndex}
                sx={{
                  mb: 2,
                  "&:before": { display: "none" },
                  borderRadius: 2,
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: theme.palette.primary.light + "10",
                    "&:hover": {
                      bgcolor: theme.palette.primary.light + "20",
                    },
                  }}
                >
                  <Typography variant="subtitle1" color="primary">
                    Día {diaIndex + 1}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Ejercicio</TableCell>
                          <TableCell>Series</TableCell>
                          <TableCell>Repeticiones</TableCell>
                          <TableCell>Kilos</TableCell>
                          <TableCell>Descanso</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dia.map((ejercicio: Ejercicio, ejercicioIndex: number) => (
                          <TableRow
                            key={ejercicioIndex}
                            hover
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{ejercicio.ejercicio}</TableCell>
                            <TableCell>{ejercicio.series}</TableCell>
                            <TableCell>{ejercicio.repeticiones}</TableCell>
                            <TableCell>{ejercicio.kilos}</TableCell>
                            <TableCell>{ejercicio.descanso}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Modal>
      )}

      {/* Modal de Cambiar Contraseña */}
      <Modal
        open={openCambiarPassword}
        onClose={handleCloseCambiarPassword}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
            p: 4,
            width: "90%",
            maxWidth: 500,
            maxHeight: "80vh",
            overflowY: "auto",
            border: '1px solid rgba(0,0,0,0.1)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 10,
              background: 'linear-gradient(to right, #FF6B35, #FF9F1C)',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 600, 
              color: '#333', 
              textAlign: 'center',
              letterSpacing: -0.5 
            }}
          >
            Cambiar Contraseña
          </Typography>
          <TextField
            fullWidth
            label="Contraseña Actual"
            type="password"
            variant="outlined"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B35',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FF6B35',
              }
            }}
          />
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            variant="outlined"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B35',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FF6B35',
              }
            }}
          />
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            type="password"
            variant="outlined"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B35',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FF6B35',
              }
            }}
          />
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleGuardarPassword}
            sx={{
              backgroundColor: '#FF6B35',
              color: 'white',
              borderRadius: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#FF9F1C'
              }
            }}
          >
            Guardar Cambios
          </Button>
        </Box>
      </Modal>

      {/* Sección de Rutinas */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Mis rutinas creadas
          </Typography>
          {isSearchFiltered && (
            <Button variant="outlined" color="primary" size="small" onClick={handleMostrarTodasRutinas} startIcon={<ViewListIcon />}>
              Ver todas las rutinas
            </Button>
          )}
        </Box>

        {loading && (
          <Typography variant="body1" color="textSecondary">
            Cargando rutinas...
          </Typography>
        )}

        {!loading && rutinas.length === 0 && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Aún no has creado ninguna rutina
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCrearRutina}>
              Crear primera rutina
            </Button>
          </Paper>
        )}

        {rutinas.map((rutina, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              mb: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                mb: 2,
                alignItems: "center",
                height: "100%",
              }}
            >
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle1">
                  {rutina.nombreAlumno}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Código: {rutina.codigoAlumno}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  {formatearFecha(rutina.fechaCreacion)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  my: 0,
                }}
              >
                <Button
                  variant="text"
                  sx={{
                    color: "#ffa04d",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                  }}
                  onClick={() => handleVerRutina(rutina)}
                >
                  Ver rutina
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
