import { NextRequest, NextResponse } from 'next/server';
import Rutina from '@/lib/models/Rutina';
import connectDB from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    const rutina = await request.json();

    // Validar los datos recibidos
    if (!rutina.codigoAlumno) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Código de alumno es requerido' 
      }, { status: 400 });
    }

    // Actualizar la rutina en la base de datos
    const updatedRutina = await Rutina.findOneAndUpdate(
      { codigoAlumno: rutina.codigoAlumno },
      {
        nombreAlumno: rutina.nombreAlumno,
        ejercicios: rutina.ejercicios,
        // Opcional: actualizar fecha de modificación
        fechaModificacion: new Date()
      },
      { 
        new: true,  // Devolver el documento actualizado
        runValidators: true  // Ejecutar validadores del esquema
      }
    );

    if (!updatedRutina) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Rutina no encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      status: 'success', 
      rutina: updatedRutina 
    });

  } catch (error) {
    console.error('Error al actualizar rutina:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'No se pudo actualizar la rutina' 
    }, { status: 500 });
  }
}
