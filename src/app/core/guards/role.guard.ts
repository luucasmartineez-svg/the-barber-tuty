import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Rol } from "../models/sesion.interface";
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data["roles"] as Rol[] | undefined) ?? [];
  if (!auth.estaLogueado()) return router.createUrlTree(["/login"]);
  return auth.tieneRol(...roles)
    ? true
    : router.createUrlTree(["/sin-permiso"]);
};
