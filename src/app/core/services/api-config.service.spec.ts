import { TestBed } from '@angular/core/testing';
import { ApiConfigService } from './api-config.service';
describe('ApiConfigService',()=>{
 let config:ApiConfigService;
 beforeEach(()=>{localStorage.removeItem('tuty_mockapi_base');TestBed.configureTestingModule({});config=TestBed.inject(ApiConfigService);});
 afterEach(()=>localStorage.removeItem('tuty_mockapi_base'));
 it('usa demo si no tiene URL',()=>{expect(config.conectado).toBeFalse();expect(config.modo).toBe('Demostración local');});
 it('guarda la URL segura y genera endpoints',()=>{config.guardar('https://prueba.mockapi.io/api/v1/');expect(config.conectado).toBeTrue();expect(config.endpoint('registros')).toBe('https://prueba.mockapi.io/api/v1/registros');});
 it('rechaza URL que no es MockAPI',()=>{expect(()=>config.guardar('http://evil.com')).toThrow();});
});
