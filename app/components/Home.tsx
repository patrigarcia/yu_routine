"use client";

import React from "react";
import { Container, Typography, Box, Grid, Button, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const theme = useTheme();
  
  const galleryImages = [
    { src: "/1.png", alt: "Imagen 1" },
    { src: "/2.png", alt: "Imagen 2" },
    { src: "/3.png", alt: "Imagen 3" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "background.default",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Círculos decorativos */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          backgroundColor: `${theme.palette.secondary.main}20`, // fucsia con opacidad
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          backgroundColor: `${theme.palette.primary.main}20`, // naranja con opacidad
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 350,
          height: 350,
          borderRadius: "50%",
          backgroundColor: `${theme.palette.secondary.main}20`, // fucsia con opacidad
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          backgroundColor: `${theme.palette.primary.main}20`, // naranja con opacidad
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: 4,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Sección de Presentación */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: "bold", 
                color: theme.palette.secondary.main,
                fontSize: {
                  xs: '2.5rem',   // Tamaño para móviles
                  sm: '3rem',     // Tamaño para tablets pequeñas
                  md: '4rem'      // Tamaño para escritorio
                },
                lineHeight: 1.2
              }}
            >
              Tus ejercicios, <br /> en la palma de tu mano
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: "normal",
                fontSize: {
                  xs: '1rem',     // Tamaño para móviles
                  sm: '1.125rem', // Tamaño para tablets pequeñas
                  md: '1.25rem'   // Tamaño para escritorio
                }
              }}
            >
              Visualiza tus rutinas en cualquier momento, completa los pesos y repeticiones de tus ejercicios, tu entrenadora te ayudará a mejorar tu rendimiento!
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Link href="/login" passHref>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    color: 'white', // Añadido color blanco para el texto
                  }}
                >
                  EMPEZAR
                </Button>
              </Link>
            </Box>
          </Grid>

          {/* Galería de Imágenes */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                height: "100%",
                alignItems: "center",
              }}
            >
              {galleryImages.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 3,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
