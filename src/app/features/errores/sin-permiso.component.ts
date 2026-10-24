import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
@Component({
  selector: "app-sin-permiso",
  standalone: true,
  imports: [RouterLink],
  template: `<section class="error-page">
    <span>403</span>
    <h1>Acceso restringido.</h1>
    <p>
      Tu rol no tiene permiso para ver esta pantalla. Ingresá con una cuenta de
      administrador.
    </p>
    <a class="btn btn--primary" routerLink="/panel">Volver al panel ↗</a>
  </section>`,
})
export class SinPermisoComponent {}
