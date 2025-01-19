import mongoose from 'mongoose';
import Entrenador from '@/lib/models/Entrenador';
import connectDB from '@/lib/mongodb';

async function seedEntrenador() {
  try {
    await connectDB();

    // Verificar si ya existe un entrenador
    const existingEntrenador = await Entrenador.findOne({ email: 'yuliana@example.com' });
    
    if (existingEntrenador) {
      console.log('El entrenador ya existe');
      return;
    }

    // Crear nuevo entrenador
    const nuevoEntrenador = new Entrenador({
      nombreCompleto: 'Yuliana Rodriguez',
      email: 'yuliana@example.com',
      password: 'tu_contraseña_segura', // Cambiar por una contraseña segura
      codigoAcceso: 'yuli25' // Código de acceso especial
    });

    await nuevoEntrenador.save();
    console.log('Entrenador creado exitosamente');

  } catch (error) {
    console.error('Error al crear entrenador:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedEntrenador();
