import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
describe('AuthService',()=>{
 let auth:AuthService;
 beforeEach(()=>{localStorage.removeItem('tuty_sesion');TestBed.configureTestingModule({});auth=TestBed.inject(AuthService);});
 afterEach(()=>{auth.logout();});
 it('rechaza una contraseña errónea',()=>{expect(auth.login('admin@tuty.com','incorrecta')).toBeFalse();expect(auth.estaLogueado()).toBeFalse();});
 it('inicia, persiste y cierra sesión',()=>{
  expect(auth.login('admin@tuty.com','Demo1234!')).toBeTrue();
  expect(auth.estaLogueado()).toBeTrue();expect(auth.tieneRol('admin')).toBeTrue();
  expect(JSON.parse(localStorage.getItem('tuty_sesion')??'{}').rol).toBe('admin');
  auth.logout();expect(localStorage.getItem('tuty_sesion')).toBeNull();expect(auth.estaLogueado()).toBeFalse();
 });
 it('restringe funcionalidades por rol',()=>{auth.login('barbero@tuty.com','Demo1234!');expect(auth.tieneRol('barbero')).toBeTrue();expect(auth.tieneRol('admin')).toBeFalse();});
});
