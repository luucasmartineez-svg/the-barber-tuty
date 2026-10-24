import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rol, Sesion } from '../models/sesion.interface';

// DEMOSTRACIÓN ACADÉMICA: las cuentas se simulan en el frontend. NO son autenticación segura.
const CUENTAS: {email: string; clave: string; nombre: string; rol: Rol}[] = [
 {email:'admin@tuty.com', clave:'Demo1234!', nombre:'Administrador', rol:'admin'},
 {email:'barbero@tuty.com', clave:'Demo1234!', nombre:'Barbero Tuty', rol:'barbero'}
];
@Injectable({providedIn:'root'})
export class AuthService {
 private readonly llave = 'tuty_sesion';
 private readonly sujeto = new BehaviorSubject<Sesion | null>(this.recuperar());
 readonly sesion$ = this.sujeto.asObservable();
 get sesion(): Sesion | null { return this.sujeto.value; }
 estaLogueado(): boolean { return this.sesion !== null; }
 tieneRol(...roles: Rol[]): boolean { return this.sesion !== null && roles.includes(this.sesion.rol); }
 login(email: string, clave: string): boolean {
  const cuenta = CUENTAS.find(c => c.email === email.toLowerCase().trim() && c.clave === clave);
  if (!cuenta) return false;
  const sesion: Sesion = {nombre:cuenta.nombre,email:cuenta.email,rol:cuenta.rol,inicio:new Date().toISOString()};
  localStorage.setItem(this.llave,JSON.stringify(sesion)); this.sujeto.next(sesion); return true;
 }
 logout(): void { localStorage.removeItem(this.llave); this.sujeto.next(null); }
 private recuperar(): Sesion | null {
  try {
   const raw = localStorage.getItem(this.llave); if (!raw) return null;
   const dato: unknown = JSON.parse(raw);
   if (!dato || typeof dato !== 'object') return null;
   const s = dato as Partial<Sesion>;
   return typeof s.email === 'string' && typeof s.nombre === 'string' &&
    (s.rol === 'admin' || s.rol === 'barbero') && typeof s.inicio === 'string' ? s as Sesion : null;
  } catch { return null; }
 }
}
