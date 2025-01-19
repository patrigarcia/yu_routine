import { NextRequest, NextResponse } from "next/server";
import Rutina from '../../../../lib/models/Rutina';
import connectDB from '../../../../lib/mongodb';

// Type definitions for exercise and routine
interface Ejercicio {
  _id: string;
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video: string | null;
}

interface Rutina {
  nombreAlumno: string;
  codigoAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: Ejercicio[][];
}

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener el código de alumno de la cookie
    const codigoAlumno = request.cookies.get("codigoAlumno")?.value;

    if (!codigoAlumno) {
      return NextResponse.json(
        {
          status: "error",
          message: "No se encontró el código de alumno",
        },
        { status: 401 }
      );
    }

    // Buscar la rutina por código de alumno
    const rutina = await Rutina.findOne({ codigoAlumno });

    if (!rutina) {
      return NextResponse.json(
        {
          status: "error",
          message: "Rutina no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      rutina: {
        nombreAlumno: rutina.nombreAlumno,
        codigoAlumno: rutina.codigoAlumno,
        ejercicios: rutina.ejercicios,
      },
    });
  } catch (error) {
    console.error("Error al obtener rutina de alumno:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "No se pudo obtener la rutina",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener el código de alumno de la cookie
    const codigoAlumno = request.cookies.get("codigoAlumno")?.value;

    if (!codigoAlumno) {
      return NextResponse.json(
        {
          status: "error",
          message: "No se encontró el código de alumno",
        },
        { status: 401 }
      );
    }

    // Obtener los datos del ejercicio editado
    const editedExercise: Ejercicio = await request.json();
    console.log("Ejercicio recibido para editar:", editedExercise);

    // Buscar la rutina por código de alumno
    const rutina = await Rutina.findOne({ codigoAlumno });

    if (!rutina) {
      console.error("Rutina no encontrada para el código:", codigoAlumno);
      return NextResponse.json(
        {
          status: "error",
          message: "Rutina no encontrada",
        },
        { status: 404 }
      );
    }

    // Actualizar el ejercicio en la rutina
    const updatedEjercicios = rutina.ejercicios.map((dayExercises: Ejercicio[]) =>
      dayExercises.map((ejercicio: Ejercicio) => (ejercicio._id.toString() === editedExercise._id ? editedExercise : ejercicio))
    );

    // Guardar la rutina actualizada
    rutina.ejercicios = updatedEjercicios;
    await rutina.save();

    console.log("Ejercicio actualizado correctamente");

    return NextResponse.json({
      status: "success",
      message: "Ejercicio actualizado correctamente",
    });
  } catch (error) {
    console.error("Error completo al editar ejercicio:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "No se pudo editar el ejercicio",
        errorDetails: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
