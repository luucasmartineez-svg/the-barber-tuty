import { Routes } from '@angular/router';
import { TurnosListComponent } from './pages/turnos-list.component';
import { TurnoFormComponent } from './pages/turno-form.component';


export const TURNOS_ROUTES: Routes = [
  { path: '', component: TurnosListComponent, title: 'Turnos | The Barber Tuty' },
  { path: 'nuevo', component: TurnoFormComponent, title: 'Nuevo turno' },
  { path: 'editar/:id', component: TurnoFormComponent, title: 'Editar turno' }
];
