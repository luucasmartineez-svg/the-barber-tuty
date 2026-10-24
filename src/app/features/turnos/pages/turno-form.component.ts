import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Cliente } from '../../../core/models/cliente.interface';
import { Producto } from '../../../core/models/producto.interface';
import { Turno, TurnoInput, EstadoTurno } from '../../../core/models/turno.interface';
import { ClientesService } from '../../clientes/services/clientes.service';
import { ProductosService } from '../../productos/services/productos.service';
import { TurnosService } from '../services/turnos.service';
import { generarHorarios, horarioDisponible } from '../utils/horarios.util';
@Component({selector:'app-turno-form',standalone:true,imports:[ReactiveFormsModule,RouterLink,MatButtonModule,MatFormFieldModule,MatInputModule,MatSelectModule],templateUrl:'./turno-form.component.html'})
export class TurnoFormComponent implements OnInit {
 private fb=inject(FormBuilder).nonNullable;private turnosApi=inject(TurnosService);private clientesApi=inject(ClientesService);private productosApi=inject(ProductosService);private ruta=inject(ActivatedRoute);private router=inject(Router);
 readonly id=this.ruta.snapshot.paramMap.get('id'); readonly horarios=generarHorarios();readonly hoy=this.fechaLocal(new Date());
 cargando=true;guardando=false;error='';clientes:Cliente[]=[];productos:Producto[]=[];turnos:Turno[]=[];
 readonly form=this.fb.group({clienteId:['',Validators.required],productoId:['',Validators.required],fecha:['',[Validators.required,Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],hora:['',Validators.required],estado:['pendiente' as EstadoTurno,Validators.required],observaciones:['',[Validators.maxLength(250)]]});
 private fechaLocal(d:Date):string {return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 ngOnInit():void{
  forkJoin({clientes:this.clientesApi.listar(),productos:this.productosApi.listar(),turnos:this.turnosApi.listar()}).subscribe({
   next:datos=>{this.clientes=datos.clientes;this.productos=datos.productos;this.turnos=datos.turnos;
    if(this.id){const t=this.turnos.find(x=>x.id===this.id);if(t)this.form.patchValue(t);else this.error='El turno que intentás editar ya no existe.';}
    this.cargando=false;},error:()=>{this.error='No se pudieron obtener los datos necesarios. Revisá la conexión.';this.cargando=false;}
  });
 }
 get horasDisponibles():string[]{const {fecha,productoId}=this.form.getRawValue();const producto=this.productos.find(p=>p.id===productoId);
  if(!producto||!fecha||!producto.activo&&this.id===null)return [];
  return this.horarios.filter(h=>horarioDisponible(fecha,h,producto,this.turnos,this.productos,this.id));
 }
 alCambiar():void{const h=this.form.controls.hora.value;if(h&&!this.horasDisponibles.includes(h))this.form.controls.hora.setValue('');}
 guardar():void {
  if(this.form.invalid){this.form.markAllAsTouched();return;}
  const v=this.form.getRawValue();const producto=this.productos.find(p=>p.id===v.productoId);
  if(!producto){this.error='Elegí un servicio válido.';return;}
  const anterior=this.turnos.find(t=>t.id===this.id);
  // Un turno existente en estado completado o cancelado conserva horario, pero nunca puede moverse a uno ocupado.
  const fechaHoraModificadas=!anterior||anterior.fecha!==v.fecha||anterior.hora!==v.hora||anterior.productoId!==v.productoId;
  if(fechaHoraModificadas&&!horarioDisponible(v.fecha,v.hora,producto,this.turnos,this.productos,this.id)){
   this.error='Ese horario no está disponible. Elegí otro día o servicio.';return;
  }
  this.guardando=true;this.error='';const dato:TurnoInput={clienteId:v.clienteId,productoId:v.productoId,fecha:v.fecha,hora:v.hora,estado:v.estado,observaciones:v.observaciones.trim()};
  // Reconsultamos justo antes de guardar para reducir choques con otro usuario (MockAPI NO provee transacciones).
  this.turnosApi.listar().subscribe({next:actuales=>{
   if(fechaHoraModificadas&&!horarioDisponible(dato.fecha,dato.hora,producto,actuales,this.productos,this.id)){
    this.error='Alguien ocupó ese horario. Seleccioná otro.';this.turnos=actuales;this.guardando=false;return;
   }
   const peticion=this.id?this.turnosApi.editar(this.id,dato):this.turnosApi.crear(dato);
   peticion.subscribe({next:()=>void this.router.navigate(['/turnos']),error:()=>{this.error='No se pudo guardar el turno.';this.guardando=false;}});
  },error:()=>{this.error='No se pudo verificar la disponibilidad.';this.guardando=false;}});
 }
}
