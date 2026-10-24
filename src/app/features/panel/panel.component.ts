import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { forkJoin } from "rxjs";
import { MatCardModule } from "@angular/material/card";
import { AuthService } from "../../core/services/auth.service";
import { Cliente } from "../../core/models/cliente.interface";
import { Producto } from "../../core/models/producto.interface";
import { Turno } from "../../core/models/turno.interface";
import { ClientesService } from "../clientes/services/clientes.service";
import { ProductosService } from "../productos/services/productos.service";
import { TurnosService } from "../turnos/services/turnos.service";
import { EstadoTurnoDirective } from "../../shared/directives/estado-turno.directive";
@Component({
  selector: "app-panel",
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    DatePipe,
    EstadoTurnoDirective
],
  templateUrl: "./panel.component.html",
})
export class PanelComponent implements OnInit {
  readonly auth = inject(AuthService);
  private clientesApi = inject(ClientesService);
  private productosApi = inject(ProductosService);
  private turnosApi = inject(TurnosService);
  cargando = true;
  error = "";
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  turnos: Turno[] = [];
  ngOnInit(): void {
    this.cargar();
  }
  cargar(): void {
    this.cargando = true;
    this.error = "";
    forkJoin({
      clientes: this.clientesApi.listar(),
      productos: this.productosApi.listar(),
      turnos: this.turnosApi.listar(),
    }).subscribe({
      next: (datos) => {
        this.clientes = datos.clientes;
        this.productos = datos.productos;
        this.turnos = datos.turnos;
        this.cargando = false;
      },
      error: () => {
        this.error =
          "No se pudieron cargar los datos. Revisá la conexión de MockAPI y reintentá.";
        this.cargando = false;
      },
    });
  }
  get activos(): number {
    return this.productos.filter((p) => p.activo).length;
  }
  get pendientes(): number {
    return this.turnos.filter((t) => t.estado === "pendiente").length;
  }
  get proximos(): Turno[] {
    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    return this.turnos
      .filter(
        (t) =>
          t.fecha >= fecha &&
          t.estado !== "cancelado" &&
          t.estado !== "completado",
      )
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
      .slice(0, 5);
  }
  cliente(id: string): string {
    const c = this.clientes.find((x) => x.id === id);
    return c ? `${c.nombre} ${c.apellido}` : "Cliente no encontrado";
  }
  producto(id: string): string {
    return (
      this.productos.find((x) => x.id === id)?.nombre ??
      "Servicio no encontrado"
    );
  }
}
