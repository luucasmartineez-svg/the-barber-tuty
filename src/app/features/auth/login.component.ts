import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../core/services/auth.service";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private fb = inject(FormBuilder).nonNullable;
  private auth = inject(AuthService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);
  error = "";
  readonly form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    clave: ["", [Validators.required, Validators.minLength(8)]],
  });
  cargarDemo(tipo: "admin" | "barbero"): void {
    this.form.setValue({ email: `${tipo}@tuty.com`, clave: "Demo1234!" });
    this.error = "";
  }
  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (
      !this.auth.login(
        this.form.controls.email.value,
        this.form.controls.clave.value,
      )
    ) {
      this.error =
        "Los datos ingresados no coinciden con las cuentas de demostración.";
      return;
    }
    const ruta = this.ruta.snapshot.queryParamMap.get("returnUrl");
    void this.router.navigateByUrl(
      ruta?.startsWith("/") && !ruta.startsWith("//") ? ruta : "/panel",
    );
  }
}
