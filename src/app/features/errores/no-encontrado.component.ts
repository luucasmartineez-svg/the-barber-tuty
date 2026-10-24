import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
@Component({
  selector: "app-no-encontrado",
  standalone: true,
  imports: [RouterLink],
  template: `<section class="error-page">
    <span>404</span>
    <h1>Esta página no existe.</h1>
    <p>
      La dirección que escribiste no corresponde a ninguna pantalla del sistema.
    </p>
    <a class="btn btn--primary" routerLink="/inicio">Volver al inicio ↗</a>
  </section>`,
})
export class NoEncontradoComponent {}
