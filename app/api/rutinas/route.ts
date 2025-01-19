import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Rutina from '../../../lib/models/Rutina';

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener datos de la solicitud
    const body = await request.json();

    // Validar datos de entrada
    if (!body.nombreAlumno || !body.ejercicios) {
      return NextResponse.json({
        status: 'error',
        message: 'Datos incompletos. Nombre de alumno y ejercicios son requeridos.'
      }, { status: 400 });
    }

    // Crear nueva rutina
    const nuevaRutina = new Rutina({
      ...body,
      entrenadorId: 'default_trainer', // Cambiar por ID real cuando haya autenticación
      fechaCreacion: new Date()
    });

    // Guardar rutina
    const rutinaGuardada = await nuevaRutina.save();

    return NextResponse.json({
      status: 'success',
      message: 'Rutina creada exitosamente',
      rutina: rutinaGuardada
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear rutina:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'No se pudo crear la rutina',
      errorDetails: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener rutinas
    const rutinas = await Rutina.find()
      .sort({ fechaCreacion: -1 })
      .limit(50); // Limitar a 50 rutinas recientes

    return NextResponse.json({
      status: 'success',
      rutinas: rutinas
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'No se pudieron obtener las rutinas',
      errorDetails: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
