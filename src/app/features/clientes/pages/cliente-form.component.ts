import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ClienteInput } from "../../../core/models/cliente.interface";
import { ClientesService } from "../services/clientes.service";
@Component({
  selector: "app-cliente-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./cliente-form.component.html",
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder).nonNullable;
  private service = inject(ClientesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly id = this.route.snapshot.paramMap.get("id");
  cargando = !!this.id;
  guardando = false;
  error = "";
  private hoy(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  readonly form = this.fb.group({
    nombre: [
      "",
      [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
    ],
    apellido: [
      "",
      [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
    ],
    email: ["", [Validators.required, Validators.email]],
    telefono: [
      "",
      [Validators.required, Validators.pattern(/^\+?[0-9 ()-]{8,18}$/)],
    ],
    fechaRegistro: [this.hoy(), Validators.required],
  });
  ngOnInit(): void {
    if (this.id)
      this.service.obtener(this.id).subscribe({
        next: (c) => {
          this.form.patchValue(c);
          this.cargando = false;
        },
        error: () => {
          this.error = "No se encontró el cliente.";
          this.cargando = false;
        },
      });
  }
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const dato: ClienteInput = {
      nombre: v.nombre.trim(),
      apellido: v.apellido.trim(),
      email: v.email.trim().toLowerCase(),
      telefono: v.telefono.trim(),
      fechaRegistro: v.fechaRegistro,
    };
    this.guardando = true;
    this.error = "";
    const peticion = this.id
      ? this.service.editar(this.id, dato)
      : this.service.crear(dato);
    peticion.subscribe({
      next: () => void this.router.navigate(["/clientes"]),
      error: () => {
        this.error = "No se pudo guardar. Verificá los datos y la conexión.";
        this.guardando = false;
      },
    });
  }
}
