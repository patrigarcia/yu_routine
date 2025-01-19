import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Alumno, IAlumno } from '@/lib/models/Alumno';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('Conexión a MongoDB establecida');

    // Obtener el término de búsqueda de los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');

    // Configurar la consulta
    let query = {};
    if (searchTerm) {
      query = { 
        nombreAlumno: { 
          $regex: searchTerm, 
          $options: 'i' // Búsqueda insensible a mayúsculas/minúsculas
        } 
      };
    }

    // Obtener alumnos con el filtro de búsqueda
    const alumnos = await Alumno.find(query).select('-__v');

    console.log('Alumnos encontrados:', alumnos.length);
    console.log('Primer alumno:', alumnos[0]);

    // Transformar los datos para el frontend
    const alumnosFormateados = alumnos.map(alumno => ({
      id: alumno._id.toString(),
      nombreAlumno: alumno.nombreAlumno,
      codigoAlumno: alumno.codigoAlumno,
      diasRutina: alumno.diasRutina,
      ejerciciosPorDia: alumno.ejerciciosPorDia,
      ejercicios: alumno.ejercicios,
      fechaCreacion: alumno.fechaCreacion.toISOString(),
      entrenadorId: alumno.entrenadorId
    }));

    console.log('Alumnos formateados:', alumnosFormateados);

    return NextResponse.json({
      status: 'success',
      alumnos: alumnosFormateados
    });
  } catch (error) {
    console.error('Error completo al obtener alumnos:', error);
    return NextResponse.json({
      status: 'error',
      message: 'No se pudieron cargar los alumnos',
      errorDetails: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
