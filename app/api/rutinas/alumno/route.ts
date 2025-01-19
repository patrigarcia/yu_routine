import { NextRequest, NextResponse } from 'next/server';
import Rutina from '@/lib/models/Rutina';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener el código de alumno de la cookie
    const codigoAlumno = request.cookies.get('codigoAlumno')?.value;

    if (!codigoAlumno) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'No se encontró el código de alumno' 
      }, { status: 401 });
    }

    // Buscar la rutina por código de alumno
    const rutina = await Rutina.findOne({ codigoAlumno });

    if (!rutina) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Rutina no encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      status: 'success', 
      rutina: {
        nombreAlumno: rutina.nombreAlumno,
        codigoAlumno: rutina.codigoAlumno,
        ejercicios: rutina.ejercicios
      }
    });

  } catch (error) {
    console.error('Error al obtener rutina de alumno:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'No se pudo obtener la rutina' 
    }, { status: 500 });
  }
}
