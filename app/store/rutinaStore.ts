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
              rutinas: []
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          set({ 
            error: errorMessage || "No se pudieron cargar las rutinas", 
            loading: false,
            rutinas: []
          });
        }
      },

      searchRutinas: async (term: string) => {
        set({ loading: true, error: null, searchTerm: term });
        try {
          const response = await fetch(`/api/rutinas?search=${encodeURIComponent(term)}`);
          const data = await response.json();

          if (data.status === "success" && Array.isArray(data.rutinas)) {
            set({ 
              rutinas: data.rutinas, 
              isSearchFiltered: true,
              loading: false,
              error: null
            });
          } else {
            set({ 
              error: data.message || "Error al buscar rutinas", 
              loading: false,
              rutinas: []
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          set({ 
            error: errorMessage || "No se pudieron buscar las rutinas", 
            loading: false,
            rutinas: []
          });
        }
      },

      resetRutinas: () => {
        get().fetchRutinas();
        set({ 
          searchTerm: '', 
          isSearchFiltered: false 
        });
      },

      setSelectedRutina: (rutina) => {
        set({ selectedRutina: rutina });
      },

      setSelectedAlumno: (alumno) => {
        set({ selectedAlumno: alumno });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
      },
    }),
    { name: 'RutinaStore' }
  )
);
