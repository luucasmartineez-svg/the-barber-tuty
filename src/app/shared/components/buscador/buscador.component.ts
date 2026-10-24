import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({selector:'app-buscador',standalone:true,template:`<label class="buscador"><span>⌕</span><input type="search" [placeholder]="placeholder" [value]="valor" (input)="cambio.emit($any($event.target).value)" aria-label="Buscar registros"></label>`})
export class BuscadorComponent { @Input() placeholder='Buscar...';@Input() valor='';@Output() cambio=new EventEmitter<string>(); }
