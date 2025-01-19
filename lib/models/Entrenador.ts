import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IEntrenador extends mongoose.Document {
  nombreCompleto: string;
  email: string;
  password: string;
  codigoAcceso?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const EntrenadorSchema = new mongoose.Schema<IEntrenador>({
  nombreCompleto: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  codigoAcceso: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password antes de guardar
EntrenadorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

// Método para comparar contraseñas
EntrenadorSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Entrenador = mongoose.models.Entrenador || mongoose.model<IEntrenador>('Entrenador', EntrenadorSchema);

export default Entrenador;
