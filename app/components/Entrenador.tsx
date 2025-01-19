"use client";

import React, { useState, useCallback } from "react";
import { Box, Typography, Avatar, Button, TextField, IconButton, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useRouter } from "next/navigation";

import { useRutinaStore } from "@/store/rutinaStore";
import { PasswordModal } from "./entrenador/PasswordModal";
import { AlumnoCard } from "./entrenador/AlumnoCard";
import { AlumnoModal } from "./entrenador/AlumnoModal";
import { Rutina, Alumno } from "@/types";

export default function Entrenador() {
  const theme = useTheme();
  const router = useRouter();
  const { rutinas, searchTerm, setSearchTerm, searchRutinas, isSearchFiltered, resetRutinas } = useRutinaStore();

  const [openCambiarPassword, setOpenCambiarPassword] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [openAlumnoModal, setOpenAlumnoModal] = useState(false);

  const handleCambiarPassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch("/api/entrenador/cambiar-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigoAcceso: "yuli25", // Código de acceso hardcodeado por ahora
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

  const handleEditarRutina = useCallback(() => {
    // Lógica para editar rutina
  }, []);

  const handleSelectAlumno = (alumno: Alumno) => {
    setSelectedAlumno(alumno);
    setOpenAlumnoModal(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "center" },
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 0 } }}>
          <Avatar
            alt="Yuliana Fanaro"
            src="/perfil.jpg"
            sx={{
              width: { xs: 100, sm: 120, md: 150 },
              height: { xs: 100, sm: 120, md: 150 },
              mr: { xs: 0, sm: 3 },
              mb: { xs: 2, sm: 0 },
              border: `3px solid ${theme.palette.secondary.main}`,
            }}
          />
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.secondary.main,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                justifyContent: { xs: "center", sm: "flex-start" },
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                },
              }}
            >
              Yuliana Fanaro
              <IconButton color="primary" size="small" sx={{ ml: 1 }} onClick={() => setOpenCambiarPassword(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Typography>
            <Typography variant="subtitle1">Profesora de Educación física | Personal Trainer</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCrearRutina}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: "white",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            Crear rutina
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar alumno"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: "100%", sm: "auto" },
                flexGrow: { xs: 1, sm: 0 },
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => searchRutinas(searchTerm)}
              sx={{
                width: { xs: "100%", sm: "auto" },
                mt: { xs: 1, sm: 0 },
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
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                Ver todas las rutinas
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mis rutinas creadas
        </Typography>
        {rutinas.map((rutina: Rutina) => (
          <AlumnoCard key={rutina.codigoAlumno} alumno={rutina} onEditarRutina={() => handleEditarRutina()} />
        ))}
      </Box>

      <PasswordModal open={openCambiarPassword} onClose={() => setOpenCambiarPassword(false)} onChangePassword={handleCambiarPassword} />

      {selectedAlumno && <AlumnoModal open={openAlumnoModal} onClose={() => setOpenAlumnoModal(false)} alumno={selectedAlumno} onEditRutina={handleEditarRutina} />}
    </Box>
  );
}
