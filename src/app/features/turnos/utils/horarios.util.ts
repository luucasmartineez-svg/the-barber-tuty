import { Producto } from '../../../core/models/producto.interface';
import { Turno } from '../../../core/models/turno.interface';
export const aMinutos=(hhmm:string):number=>{const [h,m]=hhmm.split(':').map(Number);return h*60+m;};
export const generarHorarios=():string[]=>{
 const horas:string[]=[];for(let n=9*60;n<=18*60+30;n+=30)horas.push(`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`);return horas;
};
export function horarioDisponible(fecha:string,hora:string,producto:Producto,turnos:Turno[],productos:Producto[],idEditando:string|null,ahora:Date=new Date()):boolean {
 if(!fecha||!/^\d{4}-\d{2}-\d{2}$/.test(fecha))return false;
 const inicio=new Date(`${fecha}T${hora}:00`);if(Number.isNaN(inicio.getTime())||inicio.getDay()===0||inicio.getTime()<=ahora.getTime())return false;
 const inicioMin=aMinutos(hora),finMin=inicioMin+Number(producto.duracionMinutos);
 if(finMin>19*60)return false;
 return !turnos.some(t=>{
  if(t.id===idEditando||t.fecha!==fecha||t.estado==='cancelado')return false;
  const duracion=Number(productos.find(p=>p.id===t.productoId)?.duracionMinutos??30);
  const desde=aMinutos(t.hora),hasta=desde+duracion;
  return inicioMin<hasta && desde<finMin;
 });
}
