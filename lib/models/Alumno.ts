import mongoose from 'mongoose';
import Rutina, { IRutina } from './Rutina';

// Interfaz para un ejercicio
export interface Ejercicio {
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video?: string | null;
}

// Interfaz para el modelo de Alumno
export interface IAlumno extends mongoose.Document {
  nombreAlumno: string;
  codigoAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: Ejercicio[][];
  fechaCreacion: Date;
  entrenadorId: string;
}

// Esquema de Alumno
const AlumnoSchema = new mongoose.Schema<IAlumno>({
  nombreAlumno: { 
    type: String, 
    required: true 
  },
  codigoAlumno: { 
    type: String, 
    required: true, 
    unique: true 
  },
  diasRutina: { 
    type: Number, 
    required: true 
  },
  ejerciciosPorDia: { 
    type: Number, 
    required: true 
  },
  ejercicios: { 
    type: [[{
      ejercicio: { type: String, required: true },
      semana: { type: String, required: true },
      series: { type: String, required: true },
      repeticiones: { type: String, required: true },
      kilos: { type: String, required: true },
      descanso: { type: String, required: true },
      video: { 
        type: String, 
        required: false,
        default: null 
      }
    }]], 
    required: true 
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  },
  entrenadorId: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Exportar el modelo
export const Alumno = mongoose.models.Alumno || mongoose.model<IAlumno>('Alumno', AlumnoSchema);
