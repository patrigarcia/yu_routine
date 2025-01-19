import { NextRequest, NextResponse } from 'next/server';
import Rutina from '@/lib/models/Rutina';
import connectDB from '@/lib/mongodb';

export async function GET(
  request: NextRequest, 
  { params }: { params: { codigoAlumno: string } }
) {
  try {
    // Conectar a la base de datos
    await connectDB();

    const { codigoAlumno } = params;

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
        diasRutina: rutina.diasRutina,
        ejerciciosPorDia: rutina.ejerciciosPorDia,
        ejercicios: rutina.ejercicios,
        fechaCreacion: rutina.fechaCreacion,
        entrenadorId: rutina.entrenadorId
      }
    });

  } catch (error) {
    console.error('Error al obtener rutina:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'No se pudo obtener la rutina' 
    }, { status: 500 });
  }
}
