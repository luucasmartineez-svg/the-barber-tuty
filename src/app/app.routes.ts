import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { roleGuard } from "./core/guards/role.guard";

import { InicioComponent } from "./features/inicio/inicio.component";
import { LoginComponent } from "./features/auth/login.component";
import { PanelComponent } from "./features/panel/panel.component";
import { SinPermisoComponent } from "./features/errores/sin-permiso.component";
import { NoEncontradoComponent } from "./features/errores/no-encontrado.component";
import { PRODUCTOS_ROUTES } from "./features/productos/productos.routes";
import { CLIENTES_ROUTES } from "./features/clientes/clientes.routes";

 // import { PruebaComponent } from './features/prueba/prueba.component';


export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "inicio" },
  {
    path: "inicio",
    component: InicioComponent,
    title: "Inicio | The Barber Tuty",
  },
  {
    path: "login",
    component: LoginComponent,
    title: "Ingresar | The Barber Tuty",
  },
  {
    path: "panel",
    canActivate: [authGuard],
    component: PanelComponent,
    title: "Panel | The Barber Tuty",
  },
  { path: "productos", canActivate: [authGuard], children: PRODUCTOS_ROUTES },
  {
    path: "clientes",
    canActivate: [authGuard, roleGuard],
    data: { roles: ["admin"] },
    children: CLIENTES_ROUTES,
  },
 { 
  path: "turnos",
  canActivate: [authGuard],
  loadChildren: () =>
    import("./features/turnos/turnos.routes")
      .then(m => m.TURNOS_ROUTES)
},
  { path: "sin-permiso", component: SinPermisoComponent },
//   {
//   path: 'prueba',
//   component: PruebaComponent
// }, 
  { path: "**", component: NoEncontradoComponent },
];
