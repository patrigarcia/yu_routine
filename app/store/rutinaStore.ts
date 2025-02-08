import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Rutina, Alumno } from '../types';

interface RutinaState {
  rutinas: Rutina[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  isSearchFiltered: boolean;
  selectedRutina: Rutina | null;
  selectedAlumno: Alumno | null;
}

interface RutinaActions {
  fetchRutinas: () => Promise<void>;
  searchRutinas: (term: string) => Promise<void>;
  resetRutinas: () => void;
  setSelectedRutina: (rutina: Rutina | null) => void;
  setSelectedAlumno: (alumno: Alumno | null) => void;
  setSearchTerm: (term: string) => void;
  updateRutina: (rutina: Rutina) => Promise<void>;
  deleteRutina: (id: string) => Promise<void>;
}

export const useRutinaStore = create<RutinaState & RutinaActions>()(
  devtools(
    (set, get) => ({
      rutinas: [],
      loading: false,
      error: null,
      searchTerm: '',
      isSearchFiltered: false,
      selectedRutina: null,
      selectedAlumno: null,

      fetchRutinas: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/rutinas");
          const data = await response.json();

          if (data.status === "success" && Array.isArray(data.rutinas)) {
            set({ 
              rutinas: data.rutinas, 
              loading: false,
              isSearchFiltered: false,
              error: null
            });
          } else {
            set({ 
              error: data.message || "Error al cargar rutinas", 
              loading: false,
            });
          }
        } catch (error) {
          set({ 
            error: "Error al cargar rutinas", 
            loading: false 
          });
        }
      },

      searchRutinas: async (term) => {
        set({ loading: true, error: null, searchTerm: term });
        try {
          const response = await fetch(`/api/rutinas/search?term=${encodeURIComponent(term)}`);
          const data = await response.json();

          if (data.status === "success" && Array.isArray(data.rutinas)) {
            set({ 
              rutinas: data.rutinas, 
              loading: false,
              isSearchFiltered: true,
              error: null
            });
          } else {
            set({ 
              error: data.message || "Error al buscar rutinas", 
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            error: "Error al buscar rutinas", 
            loading: false 
          });
        }
      },

      resetRutinas: () => {
        const { fetchRutinas } = get();
        set({ searchTerm: '', isSearchFiltered: false });
        fetchRutinas();
      },

      setSelectedRutina: (rutina) => set({ selectedRutina: rutina }),

      setSelectedAlumno: (alumno) => set({ selectedAlumno: alumno }),

      setSearchTerm: (term) => set({ searchTerm: term }),

      updateRutina: async (rutina) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/rutinas/${rutina._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rutina),
          });

          const data = await response.json();

          if (data.status === "success") {
            const { fetchRutinas } = get();
            await fetchRutinas();
          } else {
            set({ 
              error: data.message || "Error al actualizar la rutina", 
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            error: "Error al actualizar la rutina", 
            loading: false 
          });
        }
      },

      deleteRutina: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/rutinas/${id}`, {
            method: 'DELETE',
          });

          const data = await response.json();

          if (data.status === "success") {
            const { fetchRutinas } = get();
            await fetchRutinas();
          } else {
            set({ 
              error: data.message || "Error al eliminar la rutina", 
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            error: "Error al eliminar la rutina", 
            loading: false 
          });
        }
      },
    }),
    { name: 'RutinaStore' }
  )
);
