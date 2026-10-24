import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiConfigService } from "../../../core/services/api-config.service";
import { DemoDataService } from "../../../core/services/demo-data.service";
import { Cliente, ClienteInput } from "../../../core/models/cliente.interface";
// Ambos tipos se almacenan en el único recurso /registros de MockAPI.
// "tipo" permite diferenciarlos conservando todos los CRUD por HTTP.
type Registro = Cliente & { tipo: "cliente" };
@Injectable({ providedIn: "root" })
export class ClientesService {
  private http = inject(HttpClient);
  private config = inject(ApiConfigService);
  private demo = inject(DemoDataService);

  listar(): Observable<Cliente[]> {
    return this.config.conectado
      ? this.http
          .get<Registro[]>(this.config.endpoint("registros"))
          .pipe(
            map((registros) =>
              registros.filter((registro) => registro.tipo === "cliente"),
            ),
          )
      : this.demo.listar<Cliente>("clientes");
  }

  obtener(id: string): Observable<Cliente> {
    return this.config.conectado
      ? this.http
          .get<Registro>(`${this.config.endpoint("registros")}/${id}`)
          .pipe(
            map((registro) => {
              if (registro.tipo !== "cliente")
                throw new Error("El registro no corresponde a cliente.");
              return registro;
            }),
          )
      : this.demo.porId<Cliente>("clientes", id);
  }

  crear(dato: ClienteInput): Observable<Cliente> {
    return this.config.conectado
      ? this.http.post<Registro>(this.config.endpoint("registros"), {
          ...dato,
          tipo: "cliente",
        })
      : this.demo.crear<Cliente>("clientes", dato);
  }

  editar(id: string, dato: ClienteInput): Observable<Cliente> {
    return this.config.conectado
      ? this.http.put<Registro>(`${this.config.endpoint("registros")}/${id}`, {
          ...dato,
          tipo: "cliente",
        })
      : this.demo.editar<Cliente>("clientes", id, dato);
  }

  eliminar(id: string): Observable<void> {
    return this.config.conectado
      ? this.http.delete<void>(`${this.config.endpoint("registros")}/${id}`)
      : this.demo.eliminar("clientes", id);
  }
}
