export const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'N/A';
  
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
