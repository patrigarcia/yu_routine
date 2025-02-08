export interface Ejercicio {
  ejercicio: string;
  semana: string;
  series: string;
  repeticiones: string;
  kilos: string;
  descanso: string;
  video: string;
}

export interface Rutina {
  _id: string;
  nombreAlumno: string;
  codigoAlumno: string;
  dias: number;
  ejerciciosPorDia: number;
  ejercicios: Array<Array<{ [key: string]: Ejercicio }>>;
  fechaCreacion: string;
  entrenadorId: string;
}

export interface Alumno {
  _id: string;
  nombreAlumno: string;
  codigoAlumno: string;
  ejercicios?: Array<Array<{ [key: string]: Ejercicio }>>;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  [key: string]: any;
}
