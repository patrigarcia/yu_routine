import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PasswordChangeParams {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

interface AuthState {
  isLoggedIn: boolean;
  userType: 'alumno' | 'entrenador' | null;
  changePassword: (params: PasswordChangeParams) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userType: null,

      changePassword: async ({ passwordActual, nuevaPassword, confirmarPassword }) => {
        // Validaciones
        if (!passwordActual || !nuevaPassword || !confirmarPassword) {
          return { success: false, message: "Por favor, complete todos los campos" };
        }

        if (!/^\d{6}$/.test(nuevaPassword)) {
          return { success: false, message: "La nueva contraseña debe ser de 6 dígitos" };
        }

        if (nuevaPassword !== confirmarPassword) {
          return { success: false, message: "Las contraseñas no coinciden" };
        }

        try {
          const response = await fetch('/api/entrenador/cambiar-password', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              codigoAcceso: 'yuli25', // Código de acceso hardcodeado por ahora
              nuevaContrasena: nuevaPassword
            })
          });

          const data = await response.json();

          if (data.status === 'success') {
            return { success: true, message: 'Contraseña actualizada exitosamente' };
          } else {
            return { success: false, message: data.message || 'Error al cambiar la contraseña' };
          }
        } catch (error) {
          console.error('Error al cambiar contraseña:', error);
          return { success: false, message: 'Error al cambiar la contraseña' };
        }
      },

      logout: () => {
        set({ isLoggedIn: false, userType: null });
      },
    }),
    {
      name: 'auth-storage', // nombre para el almacenamiento local
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userType: state.userType
      })
    }
  )
);
