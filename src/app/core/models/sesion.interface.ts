export type Rol = 'admin' | 'barbero';
export interface Sesion { nombre: string; email: string; rol: Rol; inicio: string; }
