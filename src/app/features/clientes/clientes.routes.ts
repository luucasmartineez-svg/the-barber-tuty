import { Routes } from "@angular/router";
import { ClientesListComponent } from "./pages/clientes-list.component";
import { ClienteFormComponent } from "./pages/cliente-form.component";

export const CLIENTES_ROUTES: Routes = [
  {
    path: "",
    component: ClientesListComponent,
    title: "Clientes | The Barber Tuty",
  },
  { path: "nuevo", component: ClienteFormComponent, title: "Nuevo cliente" },
  {
    path: "editar/:id",
    component: ClienteFormComponent,
    title: "Editar cliente",
  },
];
