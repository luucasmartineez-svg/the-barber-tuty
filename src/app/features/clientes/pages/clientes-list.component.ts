import { Component, inject } from "@angular/core";
import { DatePipe, AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  BehaviorSubject,
  combineLatest,
  switchMap,
  map,
  of,
  catchError,
  finalize,
} from "rxjs";
import { Cliente } from "../../../core/models/cliente.interface";
import { BuscadorComponent } from "../../../shared/components/buscador/buscador.component";
import { VacioComponent } from "../../../shared/components/vacio/vacio.component";
import { TurnosService } from "../../turnos/services/turnos.service";
import { ClientesService } from "../services/clientes.service";
@Component({
  selector: "app-clientes-list",
  standalone: true,
  imports: [RouterLink, DatePipe, AsyncPipe, BuscadorComponent, VacioComponent],
  templateUrl: "./clientes-list.component.html",
})
export class ClientesListComponent {
  private service = inject(ClientesService);
  private turnos = inject(TurnosService);
  private buscar$ = new BehaviorSubject("");
  private refrescar$ = new BehaviorSubject(0);
  error = "";
  aviso = "";
  cargando = true;
  readonly clientes$ = combineLatest([this.buscar$, this.refrescar$]).pipe(
    switchMap(([busqueda]) => {
      this.cargando = true;
      this.error = "";
      return this.service.listar().pipe(
        map((clientes) =>
          clientes.filter((c) =>
            `${c.nombre} ${c.apellido} ${c.email}`
              .toLowerCase()
              .includes(busqueda.toLowerCase()),
          ),
        ),
        catchError(() => {
          this.error = "No se pudieron cargar los clientes.";
          return of([] as Cliente[]);
        }),
        finalize(() => (this.cargando = false)),
      );
    }),
  );
  buscar(s: string): void {
    this.buscar$.next(s);
  }
  actualizar(): void {
    this.refrescar$.next(this.refrescar$.value + 1);
  }
  borrar(c: Cliente): void {
    if (!confirm(`¿Eliminar a ${c.nombre} ${c.apellido}?`)) return;
    this.aviso = "";
    this.turnos.listar().subscribe({
      next: (turnos) => {
        if (turnos.some((t) => t.clienteId === c.id)) {
          this.aviso =
            "El cliente tiene turnos asociados. Antes de eliminarlo, eliminá o reasigná esos turnos.";
          return;
        }
        this.service.eliminar(c.id).subscribe({
          next: () => {
            this.aviso = "Cliente eliminado.";
            this.actualizar();
          },
          error: () => (this.aviso = "No se pudo eliminar el cliente."),
        });
      },
      error: () =>
        (this.aviso = "No se pudo revisar si existen turnos asociados."),
    });
  }
}
