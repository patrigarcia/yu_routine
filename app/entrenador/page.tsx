import { Metadata } from "next";
import EntrenadorComponent from "../components/Entrenador";

export const metadata: Metadata = {
  title: "YuRoutine | Panel de Yuliana",
  description: "Gestiona tus rutinas y alumnos",
};

export default function PaginaEntrenador() {
  return <EntrenadorComponent />;
}
