import { NextRequest, NextResponse } from 'next/server';
import conectarDB from '@/lib/mongodb';
import Rutina from '@/lib/models/Rutina';

export async function POST(request: NextRequest) {
  try {
    console.log(' Iniciando proceso de login de alumno');
    
    // Conectar a la base de datos
    await conectarDB();
    console.log(' Base de datos conectada exitosamente');

    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { codigo, userType } = body;

    console.log(` Datos recibidos - Código: ${codigo}, Tipo de usuario: ${userType}`);

    // Validaciones iniciales
    if (!codigo) {
      console.warn(' Código de alumno no proporcionado');
      return NextResponse.json({ 
        success: false, 
        message: 'Código de alumno es requerido' 
      }, { status: 400 });
    }

    // Validar formato del código (más flexible)
    const codigoNormalizado = codigo.toUpperCase().trim();
    if (userType === 'alumno' && !/^[A-Z]{4}\d{2}$/i.test(codigoNormalizado)) {
      console.warn(` Código de alumno inválido: ${codigoNormalizado}`);
      return NextResponse.json({ 
        success: false, 
        message: 'Formato de código de alumno inválido. Debe ser 4 letras y 2 números.' 
      }, { status: 400 });
    }

    // Buscar TODOS los códigos de alumno para depuración
    const todosLosCodigos = await Rutina.find({}, 'codigoAlumno nombreAlumno');
    console.log(' Códigos de alumno en la base de datos:');
    todosLosCodigos.forEach(rutina => {
      console.log(` Código: ${rutina.codigoAlumno}, Nombre: ${rutina.nombreAlumno}`);
    });

    // Buscar rutina por código de alumno
    const rutina = await Rutina.findOne({ codigoAlumno: codigoNormalizado });
    
    console.log(' Resultado de búsqueda de rutina:', rutina ? ' Encontrada' : ' No encontrada');

    if (rutina) {
      console.log(` Rutina encontrada para alumno: ${rutina.nombreAlumno}`);
      return NextResponse.json({ 
        success: true, 
        nombreAlumno: rutina.nombreAlumno,
        message: 'Login exitoso' 
      });
    } else {
      console.warn(` No se encontró rutina para código de alumno: ${codigoNormalizado}`);
      return NextResponse.json({ 
        success: false, 
        message: 'Código de alumno no registrado',
        codigosDisponibles: todosLosCodigos.map(r => r.codigoAlumno)
      }, { status: 404 });
    }
  } catch (error) {
    console.error(' Error crítico en login de alumno:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
