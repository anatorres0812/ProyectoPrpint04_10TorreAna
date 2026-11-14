export interface Proveedor {
  id: number;
  empresa: string;
  contacto: string;
  telefono: string;
  correo: string;
  ruc: string;
  estado: 'Activo' | 'Inactivo';
}