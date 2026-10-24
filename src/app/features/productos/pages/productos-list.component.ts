import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  BehaviorSubject,
  combineLatest,
  of,
  switchMap,
  catchError,
  map,
  finalize,
} from "rxjs";
import { Producto } from "../../../core/models/producto.interface";
import { AuthService } from "../../../core/services/auth.service";
import { BuscadorComponent } from "../../../shared/components/buscador/buscador.component";
import { VacioComponent } from "../../../shared/components/vacio/vacio.component";
import { DuracionPipe } from "../../../shared/pipes/duracion.pipe";
import { TurnosService } from "../../turnos/services/turnos.service";
import { ProductosService } from "../services/productos.service";
@Component({
  selector: "app-productos-list",
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    RouterLink,
    BuscadorComponent,
    VacioComponent,
    DuracionPipe,
  ],
  templateUrl: "./productos-list.component.html",
})
export class ProductosListComponent {
  readonly auth = inject(AuthService);
  private servicio = inject(ProductosService);
  private turnos = inject(TurnosService);
  private buscar$ = new BehaviorSubject<string>("");
  private actualizar$ = new BehaviorSubject<number>(0);
  cargando = true;
  error = "";
  accion = "";
  readonly listado$ = combineLatest([this.buscar$, this.actualizar$]).pipe(
    switchMap(([busqueda]) => {
      this.cargando = true;
      this.error = "";
      return this.servicio.listar().pipe(
        map((registros) =>
          registros.filter((p) =>
            (p.nombre + " " + p.categoria)
              .toLowerCase()
              .includes(busqueda.toLowerCase()),
          ),
        ),
        catchError(() => {
          this.error = "No se pudo consultar servicios. Comprobá MockAPI.";
          return of([] as Producto[]);
        }),
        finalize(() => (this.cargando = false)),
      );
    }),
  );
  buscar(valor: string): void {
    this.buscar$.next(valor);
  }
  recargar(): void {
    this.actualizar$.next(this.actualizar$.value + 1);
  }
  borrar(producto: Producto): void {
    if (
      !this.auth.tieneRol("admin") ||
      !confirm(`¿Eliminar el servicio ${producto.nombre}?`)
    )
      return;
    this.accion = "";
    this.turnos.listar().subscribe({
      next: (reservas) => {
        if (reservas.some((t) => t.productoId === producto.id)) {
          this.accion =
            "No se puede eliminar: el servicio está asociado a turnos. Podés desactivarlo desde Editar.";
          return;
        }
        this.servicio.eliminar(producto.id).subscribe({
          next: () => {
            this.accion = "Servicio eliminado correctamente.";
            this.recargar();
          },
          error: () => (this.accion = "No se pudo eliminar el servicio."),
        });
      },
      error: () =>
        (this.accion = "No se pudieron revisar los turnos asociados."),
    });
  }
}
