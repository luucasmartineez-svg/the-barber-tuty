import { generarHorarios, horarioDisponible } from './horarios.util';
import { Producto } from '../../../core/models/producto.interface';
import { Turno } from '../../../core/models/turno.interface';
describe('Horarios y disponibilidad',()=>{
 const producto:Producto={id:'1',nombre:'Corte',categoria:'Corte',descripcion:'Corte básico',precio:12000,duracionMinutos:60,activo:true};
 const productos=[producto];
 const futuro='2099-06-15'; // Lunes; deliberadamente futuro para pruebas deterministas
 const ahora=new Date('2026-01-01T10:00:00');
 it('genera intervalos de treinta minutos',()=>{const horarios=generarHorarios();expect(horarios[0]).toBe('09:00');expect(horarios.at(-1)).toBe('18:30');expect(horarios.length).toBe(20);});
 it('rechaza una reserva que se cruza con una existente',()=>{
  const turnos:Turno[]=[{id:'t1',clienteId:'c1',productoId:'1',fecha:futuro,hora:'10:00',estado:'confirmado',observaciones:''}];
  expect(horarioDisponible(futuro,'10:30',producto,turnos,productos,null,ahora)).toBeFalse();
  expect(horarioDisponible(futuro,'11:00',producto,turnos,productos,null,ahora)).toBeTrue();
 });
 it('ignora reservas canceladas y la reserva que estamos editando',()=>{
  const turnos:Turno[]=[{id:'t1',clienteId:'c1',productoId:'1',fecha:futuro,hora:'10:00',estado:'cancelado',observaciones:''}];
  expect(horarioDisponible(futuro,'10:00',producto,turnos,productos,null,ahora)).toBeTrue();
  turnos[0].estado='confirmado';expect(horarioDisponible(futuro,'10:00',producto,turnos,productos,'t1',ahora)).toBeTrue();
 });
 it('rechaza turnos que sobrepasan las 19 y horarios del pasado',()=>{
  expect(horarioDisponible(futuro,'18:30',producto,[],productos,null,ahora)).toBeFalse();
  expect(horarioDisponible('2020-10-20','09:00',producto,[],productos,null,ahora)).toBeFalse();
 });
});
