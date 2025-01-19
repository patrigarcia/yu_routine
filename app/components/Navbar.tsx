"use client";

import React from "react";
import { AppBar, Toolbar, Button, Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore"; // Importar store
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuthStore(); // Usar store y agregar logout
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Llamar a la función de logout del store
    router.push('/'); // Redirigir al home después de cerrar sesión
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/yu.png"
              alt="Yu-Routine Logo"
              width={100}
              height={50}
              priority
              style={{
                objectFit: "contain",
                width: "auto",
                height: "auto",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/" passHref>
              <Button
                color="primary"
                sx={{
                  my: 2,
                  mx: 1,
                  fontSize: "1.1em",
                  color: "#333",
                  "&:hover": {
                    color: "#FF1493", // Color fucsia
                    backgroundColor: "transparent",
                  },
                }}
              >
                Home
              </Button>
            </Link>
            {!isLoggedIn && (
              <Link href="/login" passHref>
                <Button
                  color="primary"
                  sx={{
                    my: 2,
                    mx: 1,
                    fontSize: "1.1em",
                    color: "#333",
                    "&:hover": {
                      color: "#FF1493", // Color fucsia
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Ingresar
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Button
                color="primary"
                onClick={handleLogout}
                sx={{
                  my: 2,
                  mx: 1,
                  fontSize: "1.1em",
                  color: "#333",
                  "&:hover": {
                    color: "#FF1493", // Color fucsia
                    backgroundColor: "transparent",
                  },
                }}
              >
                Cerrar sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
