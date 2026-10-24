export interface Cliente {
 id: string;
 nombre: string;
 apellido: string;
 email: string;
 telefono: string;
 fechaRegistro: string; // ISO yyyy-mm-dd
}
export type ClienteInput = Omit<Cliente, 'id'>;
