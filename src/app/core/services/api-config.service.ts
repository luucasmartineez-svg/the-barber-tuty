import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({providedIn:'root'})
export class ApiConfigService {
 private readonly llave='tuty_mockapi_base';
 get baseUrl(): string { return (localStorage.getItem(this.llave) ?? environment.mockApiBaseUrl).trim().replace(/\/+$/,''); }
 get conectado(): boolean { return /^https:\/\/[a-zA-Z0-9.-]+\.mockapi\.io(?:\/[^\s?#]*)?$/.test(this.baseUrl); }
 get modo(): string { return this.conectado ? 'MockAPI real' : 'Demostración local'; }
 guardar(url: string): void {
  const limpio=url.trim().replace(/\/+$/,'');
  if (limpio && !/^https:\/\/[a-zA-Z0-9.-]+\.mockapi\.io(?:\/[^\s?#]*)?$/.test(limpio)) throw new Error('Ingresá la URL base HTTPS de MockAPI, sin /registros ni /turnos.');
  if (limpio) localStorage.setItem(this.llave,limpio); else localStorage.removeItem(this.llave);
 }
 endpoint(recurso:'registros'|'turnos'): string { return `${this.baseUrl}/${recurso}`; }
}
