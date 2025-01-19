export interface Ejercicio {
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video?: string | null;
}

export interface Rutina {
  nombreAlumno: string;
  codigoAlumno: string;
  fechaCreacion: string;
  ejercicios: Ejercicio[][];
}

export interface Alumno {
  id: string;
  nombreAlumno: string;
  codigoAlumno: string;
  diasRutina: number;
  ejerciciosPorDia: number;
  ejercicios: Ejercicio[][];
  fechaCreacion: string;
  entrenadorId: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  [key: string]: any;
}
