import mongoose from 'mongoose';

// Definir la interfaz para un ejercicio
interface IEjercicio {
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video: string;
}

// Definir la interfaz para la rutina
interface IRutina extends mongoose.Document {
  nombreAlumno: string;
  codigoAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: IEjercicio[][];
  fechaCreacion: Date;
  entrenadorId: string;
}

// Definir el esquema de Mongoose
const EjercicioSchema = new mongoose.Schema<IEjercicio>({
  ejercicio: { type: String, required: true },
  semana: { type: String, required: true },
  series: { type: String, required: true },
  repeticiones: { type: String, required: true },
  kilos: { type: String, required: true },
  descanso: { type: String, required: true },
  video: { type: String, required: true }
});

const RutinaSchema = new mongoose.Schema<IRutina>({
  nombreAlumno: { type: String, required: true },
  codigoAlumno: { 
    type: String, 
    required: true, 
    unique: true 
  },
  diasRutina: { type: Number, required: true },
  ejerciciosPorDia: { type: Number, required: true },
  ejercicios: { 
    type: [[EjercicioSchema]], 
    required: true 
  },
  fechaCreacion: { type: Date, default: Date.now },
  entrenadorId: { type: String, required: true }
});

// Crear o recuperar el modelo
export default mongoose.models.Rutina || mongoose.model<IRutina>('Rutina', RutinaSchema);
