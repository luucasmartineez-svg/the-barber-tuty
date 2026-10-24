export type EstadoTurno = 'pendiente' | 'confirmado' | 'completado' | 'cancelado';
export interface Turno {
 id: string;
 clienteId: string;
 productoId: string;
 fecha: string; // yyyy-mm-dd local, sin conversión UTC
 hora: string; // HH:mm, elegido de una lista de horarios válidos
 estado: EstadoTurno;
 observaciones: string;
}
export type TurnoInput = Omit<Turno, 'id'>;
