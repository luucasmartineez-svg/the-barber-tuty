import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./inicio.component.html",
})
export class InicioComponent {
  readonly auth = inject(AuthService);
}
