"use client";

import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Typography, useTheme, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

// Componente de input memoizado para evitar re-renders
const EjercicioInput = memo(
  ({ value, onChange, placeholder, type = "text", inputProps }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: "text" | "number"; inputProps?: any }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <TextField
        fullWidth
        type={type}
        variant="outlined"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        size="small"
        inputProps={{
          ...inputProps,
          autoComplete: "off",
          autoCorrect: "off",
          spellCheck: "false",
        }}
      />
    );
  }
);

interface Ejercicio {
  id?: string;
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video?: string;
}

const VIDEOS = Array.from({ length: 52 }, (_, i) => `${i + 1}.mp4`);

interface TablaEjerciciosProps {
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: Ejercicio[][];
  setEjercicios: React.Dispatch<React.SetStateAction<Ejercicio[][]>>;
  videosDisponibles: string[];
}

export default function TablaEjercicios({ diasRutina, ejerciciosPorDia, ejercicios, setEjercicios, videosDisponibles }: TablaEjerciciosProps) {
  const theme = useTheme();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Actualizar ejercicio con copia profunda para evitar re-renders
  const updateEjercicio = useCallback((diaIndex: number, ejercicioIndex: number, field: keyof Omit<Ejercicio, "video">, value: string) => {
    setEjercicios((prevEjercicios) => {
      const nuevosEjercicios: Ejercicio[][] = prevEjercicios.map((dia) => [...dia]);
      nuevosEjercicios[diaIndex] = [...nuevosEjercicios[diaIndex]];
      nuevosEjercicios[diaIndex][ejercicioIndex] = {
        ...nuevosEjercicios[diaIndex][ejercicioIndex],
        [field]: value,
      };
      return nuevosEjercicios;
    });
  }, []);

  const addEjercicio = useCallback((diaIndex: number) => {
    setEjercicios((prevEjercicios) => {
      const nuevosEjercicios: Ejercicio[][] = prevEjercicios.map((dia) => [...dia]);
      nuevosEjercicios[diaIndex].push({
        id: `${diaIndex}-${nuevosEjercicios[diaIndex].length}`,
        ejercicio: "",
        semana: "1",
        series: "",
        repeticiones: "",
        kilos: "",
        descanso: "",
        video: "",
      });
      return nuevosEjercicios;
    });
  }, []);

  const removeEjercicio = useCallback((diaIndex: number, ejercicioIndex: number) => {
    setEjercicios((prevEjercicios) => {
      const nuevosEjercicios: Ejercicio[][] = prevEjercicios.map((dia) => [...dia]);
      nuevosEjercicios[diaIndex].splice(ejercicioIndex, 1);
      return nuevosEjercicios;
    });
  }, []);

  // Configurar sensores para drag and drop
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const videoName = (active.id as string).replace("draggable-video-", "");
    setActiveVideo(videoName);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const destId = over.id as string;
        const match = destId.match(/droppable-ejercicio-(\d+)-(\d+)/);

        if (match) {
          const [, destDiaIndex, destEjercicioIndex] = match.map(Number);

          setEjercicios((prevEjercicios) => {
            const nuevosEjercicios: Ejercicio[][] = prevEjercicios.map((dia) => [...dia]);
            const videoName = (active.id as string).replace("draggable-video-", "");

            nuevosEjercicios[destDiaIndex][destEjercicioIndex] = {
              ...nuevosEjercicios[destDiaIndex][destEjercicioIndex],
              video: videoName,
            };

            return nuevosEjercicios;
          });

          setActiveVideo(null);
        }
      }
    },
    [setEjercicios]
  );

  // Inicializar ejercicios
  useEffect(() => {
    const nuevosEjercicios = Array.from({ length: diasRutina }, () =>
      Array.from({ length: ejerciciosPorDia }, (_, ejercicioIndex) => ({
        id: `${ejerciciosPorDia}-${ejercicioIndex}`,
        ejercicio: "",
        semana: "1",
        series: "",
        repeticiones: "",
        kilos: "",
        descanso: "",
        video: "",
      }))
    );
    setEjercicios(nuevosEjercicios);
  }, [diasRutina, ejerciciosPorDia, setEjercicios]);

  // Componente de video arrastrable memoizado
  const DraggableVideo = useMemo(
    () =>
      ({ video }: { video: string }) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
          id: `draggable-video-${video}`,
        });

        const style = transform
          ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              zIndex: 100,
            }
          : undefined;

        return (
          <Box
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={{
              cursor: "grab",
              userSelect: "none",
              width: 100,
              height: 100,
              position: "relative",
              ...style,
            }}
          >
            <video
              src={`/videos/${video}`}
              width="100"
              height="100"
              style={{
                objectFit: "cover",
                borderRadius: 8,
                pointerEvents: "none",
              }}
            />
          </Box>
        );
      },
    []
  );

  // Memoizar la galería de videos
  const VideoGallery = useMemo(
    () => (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          height: "230px",
          overflowY: "auto",
          justifyContent: "center",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
          mb: 3,
        }}
      >
        {VIDEOS.map((video) => (
          <DraggableVideo key={video} video={video} />
        ))}
      </Box>
    ),
    [theme, DraggableVideo]
  );

  // Componente de celda droppable
  const EjercicioDroppable = useCallback(({ diaIndex, ejercicioIndex, children }: { diaIndex: number; ejercicioIndex: number; children: React.ReactNode }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: `droppable-ejercicio-${diaIndex}-${ejercicioIndex}`,
    });

    return (
      <TableCell
        ref={setNodeRef}
        sx={{
          backgroundColor: isOver ? "rgba(0, 0, 255, 0.1)" : "inherit",
          transition: "background-color 0.2s ease",
        }}
      >
        {children}
      </TableCell>
    );
  }, []);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
          Configuración de ejercicios
        </Typography>

        {/* Galería de Videos */}
        {VideoGallery}

        {/* Tabla de Ejercicios */}
        {ejercicios.map((dia, diaIndex) => (
          <TableContainer key={`dia-${diaIndex}`} component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5%", textAlign: "left" }}>Video</TableCell>
                  <TableCell sx={{ width: "25%", textAlign: "left" }}>Ejercicio</TableCell>
                  <TableCell sx={{ width: "5%", textAlign: "left" }}>Semana</TableCell>
                  <TableCell sx={{ width: "5%", textAlign: "left" }}>Series</TableCell>
                  <TableCell sx={{ width: "5%", textAlign: "left" }}>Repeticiones</TableCell>
                  <TableCell sx={{ width: "15%", textAlign: "left" }}>Kilos (por lado)</TableCell>
                  <TableCell sx={{ width: "5%", textAlign: "left" }}>Descanso</TableCell>
                  <TableCell sx={{ width: "1%", textAlign: "center" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dia.map((ejercicio, ejercicioIndex) => (
                  <TableRow key={`${diaIndex}-${ejercicioIndex}`}>
                    <EjercicioDroppable diaIndex={diaIndex} ejercicioIndex={ejercicioIndex}>
                      {ejercicio.video ? (
                        <video
                          src={`/videos/${ejercicio.video}`}
                          width="100"
                          height="100"
                          style={{
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        <Tooltip title="Arrastra un video aquí">
                          <VideoLibraryIcon
                            sx={{
                              color: theme.palette.primary.light,
                              opacity: 0.6,
                              fontSize: 48,
                            }}
                          />
                        </Tooltip>
                      )}
                    </EjercicioDroppable>
                    <EjercicioDroppable diaIndex={diaIndex} ejercicioIndex={ejercicioIndex}>
                      <EjercicioInput value={ejercicio.ejercicio} onChange={(value) => updateEjercicio(diaIndex, ejercicioIndex, "ejercicio", value)} placeholder="Nombre del ejercicio" />
                    </EjercicioDroppable>
                    <EjercicioDroppable diaIndex={diaIndex} ejercicioIndex={ejercicioIndex}>
                      <EjercicioInput type="number" value={ejercicio.semana} onChange={(value) => updateEjercicio(diaIndex, ejercicioIndex, "semana", value)} inputProps={{ min: 1, max: 4 }} />
                    </EjercicioDroppable>
                    <EjercicioDroppable diaIndex={diaIndex} ejercicioIndex={ejercicioIndex}>
                      <EjercicioInput type="number" value={ejercicio.series} onChange={(value) => updateEjercicio(diaIndex, ejercicioIndex, "series", value)} />
                    </EjercicioDroppable>
                    <EjercicioDroppable diaIndex={diaIndex} ejercicioIndex={ejercicioIndex}>
                      <EjercicioInput type="number" value={ejercicio.repeticiones} onChange={(value) => updateEjercicio(diaIndex, ejercicioIndex, "repeticiones", value)} />
                    </EjercicioDroppable>
                    <EjercicioDroppable diaIndex={diaIndex} ejercicioIndex={ejercicioIndex}>
                      <EjercicioInput type="number" value={ejercicio.kilos} onChange={(value) => updateEjercicio(diaIndex, ejercicioIndex, "kilos", value)} />
                    </EjercicioDroppable>
                    <EjercicioDroppable diaIndex={diaIndex} ejercicioIndex={ejercicioIndex}>
                      <EjercicioInput type="number" value={ejercicio.descanso} onChange={(value) => updateEjercicio(diaIndex, ejercicioIndex, "descanso", value)} />
                    </EjercicioDroppable>
                    <TableCell>
                      {dia.length > 1 && ejercicioIndex > 0 && (
                        <Tooltip title="Eliminar ejercicio">
                          <IconButton size="small" color="error" onClick={() => removeEjercicio(diaIndex, ejercicioIndex)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      </Box>

      {/* Renderizar el video arrastrado */}
      {activeVideo && (
        <DragOverlay>
          <video
            src={`/videos/${activeVideo}`}
            width="100"
            height="100"
            style={{
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </DragOverlay>
      )}
    </DndContext>
  );
}
