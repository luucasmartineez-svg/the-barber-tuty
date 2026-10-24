import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiConfigService } from "../../../core/services/api-config.service";
import {
  Producto,
  ProductoInput,
} from "../../../core/models/producto.interface";
import { ProductosService } from "./productos.service";
describe("ProductosService HTTP", () => {
  let servicio: ProductosService;
  let http: HttpTestingController;
  const base = "https://prueba.mockapi.io/api/v1";
  const dato: ProductoInput = {
    nombre: "Corte clásico",
    categoria: "Corte",
    descripcion: "Corte de prueba",
    precio: 10000,
    duracionMinutos: 30,
    activo: true,
  };
  const producto: Producto = { id: "1", ...dato };
  beforeEach(() => {
    localStorage.setItem("tuty_mockapi_base", base);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(ProductosService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
    localStorage.removeItem("tuty_mockapi_base");
  });
  it("GET: consulta un listado tipado", () => {
    servicio.listar().subscribe((res) => expect(res).toEqual([producto]));
    const req = http.expectOne(`${base}/registros`);
    expect(req.request.method).toBe("GET");
    req.flush([
      { ...producto, tipo: "producto" },
      { id: "10", nombre: "Juan", tipo: "cliente" },
    ]);
  });
  it("POST: crea un servicio", () => {
    servicio.crear(dato).subscribe((res) => expect(res.id).toBe("1"));
    const req = http.expectOne(`${base}/registros`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ ...dato, tipo: "producto" });
    req.flush(producto);
  });
  it("PUT: modifica un servicio", () => {
    servicio.editar("1", dato).subscribe((res) => expect(res.id).toBe("1"));
    const req = http.expectOne(`${base}/registros/1`);
    expect(req.request.method).toBe("PUT");
    req.flush(producto);
  });
  it("DELETE: elimina un servicio", () => {
    servicio.eliminar("1").subscribe();
    const req = http.expectOne(`${base}/registros/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});



