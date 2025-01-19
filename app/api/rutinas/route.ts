import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Rutina from '../../../lib/models/Rutina';

// Interfaces para tipado
interface Ejercicio {
  ejercicio: string;
  semana?: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video?: string | null;
}

interface DatosRutina {
  nombreAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: Ejercicio[][];
  entrenadorId?: string;
  fechaCreacion?: Date;
  codigoAlumno?: string;
}

// Función para generar código de alumno
function generarCodigoAlumno(nombreAlumno: string): string {
  // Tomar las primeras 4 letras del nombre (o menos si es más corto), en mayúsculas
  const prefijo = nombreAlumno.slice(0, 4).toUpperCase().padEnd(4, 'X');
  
  // Generar un número basado en el hash del nombre
  const hash = nombreAlumno.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Usar los últimos dos dígitos del hash, asegurando que sean entre 10 y 99
  const numeroHash = Math.abs(hash % 90) + 10;
  
  return `${prefijo}${numeroHash}`;
}

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener datos de la solicitud
    const body: DatosRutina = await request.json();

    // Log de datos recibidos con más detalle
    console.error('Datos recibidos para crear rutina:', JSON.stringify(body, null, 2));

    // Validar datos de entrada
    if (!body.nombreAlumno) {
      console.error('Nombre de alumno es requerido');
      return NextResponse.json({
        status: 'error',
        message: 'Nombre de alumno es requerido'
      }, { status: 400 });
    }

    // Validar ejercicios
    if (!body.ejercicios || !Array.isArray(body.ejercicios)) {
      console.error('Ejercicios inválidos:', body.ejercicios);
      return NextResponse.json({
        status: 'error',
        message: 'Ejercicios son requeridos y deben ser un array'
      }, { status: 400 });
    }

    // Validar estructura de ejercicios
    const ejerciciosValidos = body.ejercicios.every(dia => 
      Array.isArray(dia) && 
      dia.every(ejercicio => 
        ejercicio.ejercicio && 
        ejercicio.series && 
        ejercicio.repeticiones && 
        ejercicio.kilos && 
        ejercicio.descanso
      )
    );

    if (!ejerciciosValidos) {
      console.error('Estructura de ejercicios inválida:', body.ejercicios);
      return NextResponse.json({
        status: 'error',
        message: 'Estructura de ejercicios inválida'
      }, { status: 400 });
    }

    // Preparar datos para guardar
    const datosRutina: DatosRutina = {
      nombreAlumno: body.nombreAlumno,
      codigoAlumno: generarCodigoAlumno(body.nombreAlumno),
      diasRutina: body.diasRutina || 1,
      ejerciciosPorDia: body.ejerciciosPorDia || 1,
      ejercicios: body.ejercicios.map(dia => 
        dia.map(ejercicio => {
          const ejercicioMapeado: Ejercicio = {
            ejercicio: ejercicio.ejercicio,
            semana: ejercicio.semana || '1',
            series: ejercicio.series,
            repeticiones: ejercicio.repeticiones,
            kilos: ejercicio.kilos,
            descanso: ejercicio.descanso,
            // Manejar video de manera explícita
            video: (ejercicio.video && ejercicio.video.trim() !== '') 
              ? ejercicio.video 
              : null
          };

          return ejercicioMapeado;
        })
      ),
      entrenadorId: 'default_trainer',
      fechaCreacion: new Date()
    };

    // Log de datos antes de guardar
    console.error('Datos de rutina a guardar:', JSON.stringify(datosRutina, null, 2));

    // Crear nueva rutina
    const nuevaRutina = new Rutina(datosRutina);

    try {
      // Guardar rutina en la base de datos
      await nuevaRutina.save();

      // Devolver respuesta de éxito con el código de alumno generado
      return NextResponse.json({
        status: 'success',
        message: 'Rutina creada exitosamente',
        codigoAlumno: datosRutina.codigoAlumno
      });

    } catch (saveError) {
      console.error('Error al guardar rutina:', saveError);
      return NextResponse.json({
        status: 'error',
        message: 'Error al guardar la rutina',
        errorDetails: saveError instanceof Error ? saveError.message : 'Error desconocido'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error completo al crear rutina:', error);
    
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

    // Obtener rutinas filtradas por nombre de alumno, ordenadas por fecha de creación
    const rutinas = await Rutina.find(query)
      .sort({ fechaCreacion: -1 });

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
