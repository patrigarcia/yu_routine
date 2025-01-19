import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Rutina from '../../../../lib/models/Rutina';

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener el código de la URL
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('codigo');

    if (!codigo) {
      return NextResponse.json({
        status: 'error',
        message: 'Código no proporcionado'
      }, { status: 400 });
    }

    // Verificar si el código ya existe
    const rutinaExistente = await Rutina.findOne({ codigoAlumno: codigo });

    return NextResponse.json({
      status: 'success',
      disponible: !rutinaExistente
    }, { status: 200 });

  } catch (error) {
    console.error('Error al verificar código:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'No se pudo verificar el código',
      errorDetails: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
