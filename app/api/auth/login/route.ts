import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Entrenador from '../../../../lib/models/Entrenador';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, codigoAcceso } = await request.json();

    // Validar campos requeridos
    if (!email || (!password && !codigoAcceso)) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Email y contraseña o código de acceso son requeridos' 
      }, { status: 400 });
    }

    // Buscar entrenador por email o código de acceso
    const entrenador = await Entrenador.findOne({ 
      $or: [
        { email },
        { codigoAcceso }
      ]
    });

    if (!entrenador) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Credenciales inválidas' 
      }, { status: 401 });
    }

    // Verificar contraseña o código de acceso
    const isValidCredential = password 
      ? await entrenador.comparePassword(password)
      : codigoAcceso === entrenador.codigoAcceso;

    if (!isValidCredential) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Credenciales inválidas' 
      }, { status: 401 });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: entrenador._id, 
        email: entrenador.email 
      }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1d' }
    );

    // Respuesta exitosa
    return NextResponse.json({ 
      status: 'success', 
      token,
      entrenador: {
        id: entrenador._id,
        nombreCompleto: entrenador.nombreCompleto,
        email: entrenador.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Error en el servidor' 
    }, { status: 500 });
  }
}
