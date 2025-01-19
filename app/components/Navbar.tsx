"use client";

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box,
  Container
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'whitesmoke', 
        height: '100px',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image 
              src="/yu.png" 
              alt="Yu-Routine Logo" 
              width={100} 
              height={50} 
              style={{ 
                objectFit: 'contain', 
                width: 'auto', 
                height: 'auto' 
              }}
            />
          </Link>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" passHref>
              <Button 
                color="primary" 
                sx={{ 
                  my: 2, 
                  mx: 1, 
                  fontSize: '1.1em',
                  color: '#333', 
                  '&:hover': { 
                    color: '#FF1493',  // Color fucsia
                    backgroundColor: 'transparent'
                  } 
                }}
              >
                Home
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button 
                color="primary" 
                sx={{ 
                  my: 2, 
                  mx: 1, 
                  fontSize: '1.1em',
                  color: '#333', 
                  '&:hover': { 
                    color: '#FF1493',  // Color fucsia
                    backgroundColor: 'transparent'
                  } 
                }}
              >
                Ingresar
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
