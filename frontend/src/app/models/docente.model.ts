export interface Docente {
  id: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  direccion: string; // En el contexto del docente, esto es "Oficina/Cubiculo"
  rol: 'docente' | 'personal';
  foto?: string;
  // Añade aquí cualquier otro campo que venga del backend
}