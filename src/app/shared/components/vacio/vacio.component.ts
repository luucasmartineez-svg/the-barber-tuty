import { Component, Input } from '@angular/core';
@Component({selector:'app-vacio',standalone:true,template:`<div class="empty"><div class="empty__icon">✂</div><h3>{{titulo}}</h3><p>{{descripcion}}</p></div>`})
export class VacioComponent {@Input() titulo='No hay datos'; @Input() descripcion='Probá de nuevo o agregá un registro.';}
