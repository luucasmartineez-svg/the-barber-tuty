import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Turno, TurnoInput } from '../../../core/models/turno.interface';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { DemoDataService } from '../../../core/services/demo-data.service';
@Injectable({providedIn:'root'})
export class TurnosService {
 private http=inject(HttpClient);private config=inject(ApiConfigService);private demo=inject(DemoDataService);
 listar():Observable<Turno[]> {return this.config.conectado?this.http.get<Turno[]>(this.config.endpoint('turnos')):this.demo.listar<Turno>('turnos');}
 obtener(id:string):Observable<Turno> {return this.config.conectado?this.http.get<Turno>(`${this.config.endpoint('turnos')}/${id}`):this.demo.porId<Turno>('turnos',id);}
 crear(turno:TurnoInput):Observable<Turno> {return this.config.conectado?this.http.post<Turno>(this.config.endpoint('turnos'),turno):this.demo.crear<Turno>('turnos',turno);}
 editar(id:string,turno:TurnoInput):Observable<Turno> {return this.config.conectado?this.http.put<Turno>(`${this.config.endpoint('turnos')}/${id}`,turno):this.demo.editar<Turno>('turnos',id,turno);}
 eliminar(id:string):Observable<void> {return this.config.conectado?this.http.delete<void>(`${this.config.endpoint('turnos')}/${id}`):this.demo.eliminar('turnos',id);}
}
