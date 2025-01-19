import mongoose from 'mongoose';

export interface INota extends mongoose.Document {
  alumnoId: string;
  ejercicioId: string;
  rutinaDiaId: string;
  contenido: string;
  fechaCreacion: Date;
  leida: boolean;
}

const NotaSchema = new mongoose.Schema({
  alumnoId: { 
    type: String, 
    required: true 
  },
  ejercicioId: { 
    type: String, 
    required: true 
  },
  rutinaDiaId: { 
    type: String, 
    required: true 
  },
  contenido: { 
    type: String, 
    required: true 
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  },
  leida: { 
    type: Boolean, 
    default: false 
  }
});

export default mongoose.models.Nota || mongoose.model<INota>('Nota', NotaSchema);
