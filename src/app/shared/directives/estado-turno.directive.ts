import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { EstadoTurno } from '../../core/models/turno.interface';
@Directive({selector:'[appEstadoTurno]',standalone:true})
export class EstadoTurnoDirective {
 constructor(private elemento:ElementRef<HTMLElement>,private renderer:Renderer2) {}
 @Input() set appEstadoTurno(estado:EstadoTurno){
  for(const c of ['badge--pendiente','badge--confirmado','badge--completado','badge--cancelado'])this.renderer.removeClass(this.elemento.nativeElement,c);
  this.renderer.addClass(this.elemento.nativeElement,'badge--'+estado);
 }
}
