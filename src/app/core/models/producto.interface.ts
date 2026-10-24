export interface Producto {
 id: string;
 nombre: string;
 categoria: 'Corte' | 'Barba' | 'Combo' | 'Tratamiento';
 descripcion: string;
 precio: number;
 duracionMinutos: number;
 activo: boolean;
}
export type ProductoInput = Omit<Producto, 'id'>;
