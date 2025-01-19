import mongoose from 'mongoose';
import Rutina from './models/Rutina';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'yu-routine' 
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then(async (mongoose) => {
      try {
        // Obtener códigos de alumno para depuración
        const rutinas = await Rutina.find({}, 'codigoAlumno nombreAlumno');
        console.log('Códigos de alumno en la base de datos:');
        rutinas.forEach(rutina => {
          console.log(`Código: ${rutina.codigoAlumno}, Nombre: ${rutina.nombreAlumno}`);
        });
      } catch (error) {
        console.error('Error al obtener códigos de alumno:', error);
      }
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default connectDB;
