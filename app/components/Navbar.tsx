"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, Container, Typography, Drawer, List, ListItem, ListItemText, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "lib/store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, logout, userType } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getAreaLink = () => {
    if (!isLoggedIn) return "/login";
    switch (userType) {
      case "alumno":
        return "/alumno";
      case "entrenador":
        return "/entrenador";
      default:
        return "/login";
    }
  };

  const navItems = [
    { label: "Home", href: "/" },
    ...(isLoggedIn
      ? [
          { label: "Mi Área", href: getAreaLink() },
          { label: "Cerrar sesión", action: handleLogout },
        ]
      : [{ label: "Iniciar sesión", href: "/login" }]),
  ];

  const renderNavItems = (isMobileMenu = false) => {
    return navItems.map((item, index) =>
      item.action ? (
        <Button
          key={index}
          onClick={item.action}
          fullWidth={isMobileMenu}
          color="primary"
          sx={{
            my: 1,
            fontSize: "1.1em",
            color: "#333",
            "&:hover": {
              color: "#FF1493",
              backgroundColor: "transparent",
            },
          }}
        >
          {item.label}
        </Button>
      ) : (
        <Link href={item.href} passHref key={index}>
          <Button
            fullWidth={isMobileMenu}
            color="primary"
            onClick={() => setMobileOpen(false)}
            sx={{
              my: 1,
              fontSize: "1.1em",
              color: "#333",
              "&:hover": {
                color: "#FF1493",
                backgroundColor: "transparent",
              },
            }}
          >
            {item.label}
          </Button>
        </Link>
      )
    );
  };

  const mobileMenu = (
    <Drawer
      variant="temporary"
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 240,
          backgroundColor: "white",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>{renderNavItems(true)}</List>
    </Drawer>
  );

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

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {renderNavItems()}
          </Box>

          {/* Mobile Hamburger Menu */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          </Box>

          {mobileMenu}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
