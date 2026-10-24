import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin, of, switchMap, map, catchError, finalize } from 'rxjs';
import { Cliente } from '../../../core/models/cliente.interface';
import { Producto } from '../../../core/models/producto.interface';
import { Turno } from '../../../core/models/turno.interface';
import { BuscadorComponent } from '../../../shared/components/buscador/buscador.component';
import { VacioComponent } from '../../../shared/components/vacio/vacio.component';
import { EstadoTurnoDirective } from '../../../shared/directives/estado-turno.directive';
import { ClientesService } from '../../clientes/services/clientes.service';
import { ProductosService } from '../../productos/services/productos.service';
import { TurnosService } from '../services/turnos.service';
@Component({selector:'app-turnos-list',standalone:true,imports:[AsyncPipe,DatePipe,RouterLink,BuscadorComponent,VacioComponent,EstadoTurnoDirective],templateUrl:'./turnos-list.component.html'})
export class TurnosListComponent {
 private service=inject(TurnosService);private clientesApi=inject(ClientesService);private productosApi=inject(ProductosService);
 private buscar$=new BehaviorSubject<string>('');private refrescar$=new BehaviorSubject(0);
 clientes:Cliente[]=[];productos:Producto[]=[];cargando=true;error='';aviso='';
 readonly turnos$=combineLatest([this.buscar$,this.refrescar$]).pipe(switchMap(([filtro])=>{
  this.cargando=true;this.error='';return forkJoin({turnos:this.service.listar(),clientes:this.clientesApi.listar(),productos:this.productosApi.listar()}).pipe(
   map(datos=>{this.clientes=datos.clientes;this.productos=datos.productos;return datos.turnos.filter(t=>`${t.fecha} ${t.hora} ${t.estado} ${this.nombreCliente(t.clienteId)} ${this.nombreProducto(t.productoId)}`.toLowerCase().includes(filtro.toLowerCase())).sort((a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora));}),
   catchError(()=>{this.error='No se pudieron obtener los turnos. Revisá la conexión.';return of([] as Turno[]);}),finalize(()=>this.cargando=false));
 }));
 nombreCliente(id:string):string {const c=this.clientes.find(c=>c.id===id);return c?`${c.nombre} ${c.apellido}`:'Cliente inexistente';}
 nombreProducto(id:string):string {return this.productos.find(p=>p.id===id)?.nombre??'Servicio inexistente';}
 buscar(f:string):void{this.buscar$.next(f);}actualizar():void{this.refrescar$.next(this.refrescar$.value+1);}
 borrar(t:Turno):void{if(!confirm(`¿Eliminar el turno del ${t.fecha} a las ${t.hora}?`))return;
 this.service.eliminar(t.id).subscribe({next:()=>{this.aviso='Turno eliminado.';this.actualizar();},error:()=>this.aviso='No fue posible eliminar el turno.'});}
}
