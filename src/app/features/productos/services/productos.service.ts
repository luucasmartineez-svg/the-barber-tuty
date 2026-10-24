import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { DemoDataService } from '../../../core/services/demo-data.service';
import { Producto, ProductoInput } from '../../../core/models/producto.interface';
// Ambos tipos se almacenan en el único recurso /registros de MockAPI.
// "tipo" permite diferenciarlos conservando todos los CRUD por HTTP.
type Registro = Producto & { tipo: 'producto' };
@Injectable({providedIn:'root'})
export class ProductosService {
 private http = inject(HttpClient);
 private config = inject(ApiConfigService);
 private demo = inject(DemoDataService);

 listar(): Observable<Producto[]> {
  return this.config.conectado
   ? this.http.get<Registro[]>(this.config.endpoint('registros')).pipe(
      map(registros => registros.filter(registro => registro.tipo === 'producto'))
     )
   : this.demo.listar<Producto>('productos');
 }

 obtener(id: string): Observable<Producto> {
  return this.config.conectado
   ? this.http.get<Registro>(`${this.config.endpoint('registros')}/${id}`).pipe(
      map(registro => {
       if (registro.tipo !== 'producto') throw new Error('El registro no corresponde a producto.');
       return registro;
      })
     )
   : this.demo.porId<Producto>('productos', id);
 }

 crear(dato: ProductoInput): Observable<Producto> {
  return this.config.conectado
   ? this.http.post<Registro>(this.config.endpoint('registros'), { ...dato, tipo: 'producto' })
   : this.demo.crear<Producto>('productos', dato);
 }

 editar(id: string, dato: ProductoInput): Observable<Producto> {
  return this.config.conectado
   ? this.http.put<Registro>(`${this.config.endpoint('registros')}/${id}`, { ...dato, tipo: 'producto' })
   : this.demo.editar<Producto>('productos', id, dato);
 }

 eliminar(id: string): Observable<void> {
  return this.config.conectado
   ? this.http.delete<void>(`${this.config.endpoint('registros')}/${id}`)
   : this.demo.eliminar('productos', id);
 }
}
