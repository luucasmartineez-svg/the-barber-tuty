import { Injectable } from '@angular/core';
import { defer, Observable, of, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.interface';
import { Producto } from '../models/producto.interface';
import { Turno } from '../models/turno.interface';
type Recurso='productos'|'clientes'|'turnos';
@Injectable({providedIn:'root'})
export class DemoDataService {
 private readonly prefijo='tuty_demo_';
 private fechaEn(dias:number):string {
  const d=new Date(); d.setDate(d.getDate()+dias);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 }
 private iniciar():void {
  const productos: Producto[]=[
   {id:'1',nombre:'Corte clásico',categoria:'Corte',descripcion:'Corte a tijera o máquina, terminado prolijo.',precio:11000,duracionMinutos:30,activo:true},
   {id:'2',nombre:'Perfilado de barba',categoria:'Barba',descripcion:'Perfilado, delineado y cuidado de barba.',precio:7500,duracionMinutos:30,activo:true},
   {id:'3',nombre:'Corte + barba',categoria:'Combo',descripcion:'Experiencia completa de corte y barba.',precio:16000,duracionMinutos:60,activo:true},
   {id:'4',nombre:'Corte premium',categoria:'Tratamiento',descripcion:'Corte, lavado y peinado final.',precio:14500,duracionMinutos:45,activo:true}
  ];
  const clientes:Cliente[]=[
   {id:'1',nombre:'Juan',apellido:'Pérez',email:'juan@example.com',telefono:'1123456789',fechaRegistro:this.fechaEn(-15)},
   {id:'2',nombre:'Martín',apellido:'Gómez',email:'martin@example.com',telefono:'1167891234',fechaRegistro:this.fechaEn(-9)},
   {id:'3',nombre:'Lucas',apellido:'Fernández',email:'lucas@example.com',telefono:'1144445555',fechaRegistro:this.fechaEn(-3)}
  ];
  const turnos:Turno[]=[
   {id:'1',clienteId:'1',productoId:'1',fecha:this.fechaEn(2),hora:'10:00',estado:'confirmado',observaciones:''},
   {id:'2',clienteId:'2',productoId:'3',fecha:this.fechaEn(3),hora:'12:00',estado:'pendiente',observaciones:'Primera visita'}
  ];
  for (const [nombre,datos] of Object.entries({productos,clientes,turnos})) {
   if (localStorage.getItem(this.prefijo+nombre)===null) localStorage.setItem(this.prefijo+nombre,JSON.stringify(datos));
  }
 }
 private obtener<T extends {id:string}>(recurso:Recurso):T[] { this.iniciar(); return JSON.parse(localStorage.getItem(this.prefijo+recurso) ?? '[]') as T[]; }
 listar<T extends {id:string}>(recurso:Recurso):Observable<T[]> {return defer(()=>of(this.obtener<T>(recurso)));}
 porId<T extends {id:string}>(recurso:Recurso,id:string):Observable<T> {return defer(()=>{const encontrado=this.obtener<T>(recurso).find(x=>x.id===id);return encontrado?of(encontrado):throwError(()=>new Error('No se encontró el registro solicitado.'));});}
 crear<T extends {id:string}>(recurso:Recurso,input:Omit<T,'id'>):Observable<T> {
  return defer(()=>{const datos=this.obtener<T>(recurso);const id=String(Math.max(0,...datos.map(x=>Number(x.id)||0))+1);const item={...input,id} as T;datos.push(item);localStorage.setItem(this.prefijo+recurso,JSON.stringify(datos));return of(item);});
 }
 editar<T extends {id:string}>(recurso:Recurso,id:string,input:Omit<T,'id'>):Observable<T> {
  return defer(()=>{const datos=this.obtener<T>(recurso);const indice=datos.findIndex(x=>x.id===id);if(indice<0)return throwError(()=>new Error('No existe el registro.')); const item={...input,id} as T;datos[indice]=item;localStorage.setItem(this.prefijo+recurso,JSON.stringify(datos));return of(item);});
 }
 eliminar(recurso:Recurso,id:string):Observable<void> {
  return defer(()=>{const datos=this.obtener(recurso);if(!datos.some(x=>x.id===id))return throwError(()=>new Error('El registro ya no existe.'));localStorage.setItem(this.prefijo+recurso,JSON.stringify(datos.filter(x=>x.id!==id)));return of(undefined);});
 }
 reiniciar():void { for(const r of ['productos','clientes','turnos'])localStorage.removeItem(this.prefijo+r);this.iniciar(); }
}
