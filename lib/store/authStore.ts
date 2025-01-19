import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  userType: 'alumno' | 'entrenador' | null;
  login: (type: 'alumno' | 'entrenador') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userType: null,
      login: (type) => set({ isLoggedIn: true, userType: type }),
      logout: () => set({ isLoggedIn: false, userType: null }),
    }),
    {
      name: 'auth-storage', // nombre para el almacenamiento local
      getStorage: () => localStorage, // usa localStorage para persistir
    }
  )
);
