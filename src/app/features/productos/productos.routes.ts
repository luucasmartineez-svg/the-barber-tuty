import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guards/role.guard";
import { ProductosListComponent } from "./pages/productos-list.component";
import { ProductoFormComponent } from "./pages/producto-form.component";

export const PRODUCTOS_ROUTES: Routes = [
  {
    path: "",
    component: ProductosListComponent,
    title: "Servicios | The Barber Tuty",
  },
  {
    path: "nuevo",
    canActivate: [roleGuard],
    data: { roles: ["admin"] },
    component: ProductoFormComponent,
    title: "Nuevo servicio",
  },
  {
    path: "editar/:id",
    canActivate: [roleGuard],
    data: { roles: ["admin"] },
    component: ProductoFormComponent,
    title: "Editar servicio",
  },
];
