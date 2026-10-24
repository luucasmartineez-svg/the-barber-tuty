import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  Producto,
  ProductoInput,
} from "../../../core/models/producto.interface";
import { ProductosService } from "../services/productos.service";
@Component({
  selector: "app-producto-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: "./producto-form.component.html",
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder).nonNullable;
  private service = inject(ProductosService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  readonly id = this.ruta.snapshot.paramMap.get("id");
  cargando = !!this.id;
  guardando = false;
  error = "";
  readonly form = this.fb.group({
    nombre: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(70)],
    ],
    categoria: ["Corte" as Producto["categoria"], Validators.required],
    descripcion: [
      "",
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(250),
      ],
    ],
    precio: [11000, [Validators.required, Validators.min(100)]],
    duracionMinutos: [
      30,
      [Validators.required, Validators.min(15), Validators.max(180)],
    ],
    activo: [true],
  });
  ngOnInit(): void {
    if (this.id)
      this.service.obtener(this.id).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.cargando = false;
        },
        error: () => {
          this.error = "No se encontró el servicio.";
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
    const dato: ProductoInput = {
      nombre: v.nombre.trim(),
      categoria: v.categoria,
      descripcion: v.descripcion.trim(),
      precio: Number(v.precio),
      duracionMinutos: Number(v.duracionMinutos),
      activo: v.activo,
    };
    this.guardando = true;
    this.error = "";
    const peticion = this.id
      ? this.service.editar(this.id, dato)
      : this.service.crear(dato);
    peticion.subscribe({
      next: () => void this.router.navigate(["/productos"]),
      error: () => {
        this.error =
          "No se pudo guardar. Revisá la conexión e intentá de nuevo.";
        this.guardando = false;
      },
    });
  }
}
