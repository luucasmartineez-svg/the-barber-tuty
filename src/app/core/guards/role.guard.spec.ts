import { TestBed } from "@angular/core/testing";
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { roleGuard } from "./role.guard";
describe("roleGuard", () => {
  let auth: AuthService;
  let router: Router;
  beforeEach(() => {
    localStorage.removeItem("tuty_sesion");
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });
  afterEach(() => auth.logout());
  const evaluar = () =>
    TestBed.runInInjectionContext(() =>
      roleGuard(
        { data: { roles: ["admin"] } } as unknown as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
  it("redirige al login sin sesión", () => {
    const result = evaluar();
    expect(result instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(result as UrlTree)).toBe("/login");
  });
  it("bloquea al barbero y permite al admin", () => {
    auth.login("barbero@tuty.com", "Demo1234!");
    expect(router.serializeUrl(evaluar() as UrlTree)).toBe("/sin-permiso");
    auth.login("admin@tuty.com", "Demo1234!");
    expect(evaluar()).toBeTrue();
  });
});
