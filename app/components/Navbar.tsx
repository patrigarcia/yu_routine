"use client";

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container
} from '@mui/material';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <SportsGymnasticsIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                letterSpacing: '.1rem',
              }}
            >
              Yu-Routine
            </Typography>
          </Link>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/" passHref>
              <Button color="inherit" sx={{ my: 2, mx: 1 }}>
                Home
              </Button>
            </Link>
            <Link href="/alumno" passHref>
              <Button color="inherit" sx={{ my: 2, mx: 1 }}>
                Alumno
              </Button>
            </Link>
            <Link href="/entrenador" passHref>
              <Button color="inherit" sx={{ my: 2, mx: 1 }}>
                Entrenador
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
