"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  useTheme,
  Grid,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ViewListIcon from "@mui/icons-material/ViewList";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

import { useRutinaStore } from "@/store/rutinaStore";
import { PasswordModal } from "./entrenador/PasswordModal";
import { AlumnoCard } from "./entrenador/AlumnoCard";
import { AlumnoModal } from "./entrenador/AlumnoModal";
import { Rutina, Alumno } from "@/types";

export default function Entrenador() {
  const theme = useTheme();
  const router = useRouter();
  const {
    rutinas,
    searchTerm,
    setSearchTerm,
    searchRutinas,
    isSearchFiltered,
    resetRutinas,
    loading,
    error,
    fetchRutinas,
    deleteRutina,
    updateRutina,
  } = useRutinaStore();

  const [openCambiarPassword, setOpenCambiarPassword] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [openAlumnoModal, setOpenAlumnoModal] = useState(false);

  useEffect(() => {
    fetchRutinas();
  }, [fetchRutinas]);

  const handleCambiarPassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch("/api/entrenador/cambiar-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigoAcceso: "yuli25",
          nuevaContrasena: newPassword,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Contraseña actualizada exitosamente");
        setOpenCambiarPassword(false);
      } else {
        alert(data.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      alert("Error al cambiar la contraseña");
    }
  };

  const handleCrearRutina = () => {
    router.push("/crear-rutina");
  };

  const handleSaveRutina = async (rutina: Rutina) => {
    try {
      await updateRutina(rutina);
      await fetchRutinas();
    } catch (error) {
      console.error("Error al actualizar la rutina:", error);
      alert("Error al actualizar la rutina");
    }
  };

  const handleSelectAlumno = (alumno: Alumno) => {
    setSelectedAlumno(alumno);
    setOpenAlumnoModal(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      resetRutinas();
    } else {
      searchRutinas(value);
    }
  };

  const handleDeleteRutina = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta rutina?")) {
      try {
        await deleteRutina(id);
        await fetchRutinas();
      } catch (error) {
        console.error("Error al eliminar la rutina:", error);
        alert("Error al eliminar la rutina");
      }
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
      }}
    >
      {/* Perfil del Entrenador */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
        }}
      >
        {/* Línea superior: Avatar, textos y búsqueda */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 2,
          }}
        >
          {/* Avatar y Nombre */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: { xs: "1 1 100%", md: "0 1 auto" },
            }}
          >
            <Avatar
              alt="Yuliana Fanaro"
              src="/perfil.jpg"
              sx={{
                width: 80,
                height: 80,
                border: `4px solid ${theme.palette.secondary.main}`,
              }}
            />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.secondary.main,
                    fontSize: { xs: "1.1em", md: "1.2em" },
                  }}
                >
                  Yuliana Fanaro
                </Typography>
                <IconButton color="primary" size="small" onClick={() => setOpenCambiarPassword(true)}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Profesora de Educación física | Personal Trainer
              </Typography>
            </Box>
          </Box>

          {/* Componente de búsqueda */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flex: { xs: "1 1 100%", md: "0 1 auto" },
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar alumno por nombre"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                flex: 1,
                minWidth: { xs: "auto", sm: "280px" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => searchRutinas(searchTerm)}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Buscar
            </Button>
            {isSearchFiltered && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={resetRutinas}
                startIcon={<ViewListIcon />}
              >
                Ver todas
              </Button>
            )}
          </Box>
        </Box>

        {/* Línea inferior: Botón crear rutina */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCrearRutina}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              whiteSpace: "nowrap",
            }}
          >
            Crear nueva rutina
          </Button>
        </Box>
      </Box>

      {/* Grid de Rutinas */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: theme.palette.primary.main,
          }}
        >
          Mis rutinas creadas
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {loading ? (
            <Typography>Cargando rutinas...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : rutinas.length === 0 ? (
            <Typography>No hay rutinas disponibles</Typography>
          ) : (
            rutinas.map((rutina) => (
              <AlumnoCard
                key={rutina._id}
                alumno={rutina}
                onDelete={handleDeleteRutina}
                onSave={handleSaveRutina}
              />
            ))
          )}
        </Box>
      </Box>

      <PasswordModal
        open={openCambiarPassword}
        onClose={() => setOpenCambiarPassword(false)}
        onChangePassword={handleCambiarPassword}
      />

      {selectedAlumno && (
        <AlumnoModal
          open={openAlumnoModal}
          onClose={() => setOpenAlumnoModal(false)}
          alumno={selectedAlumno}
          onEditRutina={handleSaveRutina}
        />
      )}
    </Box>
  );
}
