# Importante: versión gratuita de MockAPI (2 recursos)

Esta versión fue adaptada para **DOS recursos externos**: `registros` y `turnos`.
La explicación previa del README sobre 3 recursos ya no aplica. Consultá primero
`MOCKAPI_DOS_RECURSOS.md` para crear el esquema y conectar la URL.

---

# ✂ THE BARBER TUTY
### Proyecto Final · Algoritmos y Estructuras de Datos III

Aplicación frontend Angular para la gestión de una barbería, basada en la consigna y en las clases suministradas: componentes **standalone**, routing, lazy loading, servicios con inyección de dependencias, HttpClient, CRUD, Reactive Forms, Angular Material, pipes, directivas, localStorage, roles y Guards.

## 1. Cómo abrir el proyecto

**Requisitos:** Node.js (versión LTS compatible con Angular 19), npm, Internet para la primera instalación, Visual Studio Code opcional.

1. Descomprimir `the-barber-tuty.zip`.
2. Abrir la **carpeta `the-barber-tuty`** en Visual Studio Code (`Archivo > Abrir carpeta`).
3. Abrir una terminal integrada (`Terminal > Nueva terminal`).
4. Ejecutar:

```bash
npm install
npm start
```

Se abrirá `http://localhost:4200`. Si no abre automáticamente, pegar esa dirección en Chrome. Para detener el servidor, presionar `Ctrl+C` en la terminal.

> **Importante:** no se incluye `node_modules` ni `package-lock.json`. Se generan durante `npm install`. En el entorno de preparación no fue posible descargar dependencias de npm, por lo que **el build y las pruebas de Angular quedan pendientes de ejecución en un equipo con acceso a Internet**.

## 2. Cuentas de práctica

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin@tuty.com` | `Demo1234!` | Administrador |
| `barbero@tuty.com` | `Demo1234!` | Barbero |

**Administrador:** gestiona clientes, servicios y turnos. **Barbero:** puede navegar por panel, catálogo (lectura) y agenda; puede crear/editar/eliminar turnos. No puede entrar a gestión de clientes ni administración de servicios. Si intenta ingresar escribiendo la URL directamente, el Guard redirige a `sin-permiso`.

**Aclaración de seguridad:** este login es **simulado para la materia**. Las cuentas están escritas en código frontend; `localStorage` no es una autenticación segura y los Guards no protegen la API por sí solos. No utilizar datos reales o sensibles. Para un sistema real se necesita autenticación y autorización verificadas por un servidor.

## 3. Modo demostración (sin configurar API)

La app viene con ejemplos de servicios, clientes y turnos. **Se guardan en localStorage** del navegador, para que se pueda probar el CRUD de inmediato. No reemplaza al requisito de persistencia mediante API REST para la entrega final.

Si `src/environments/environment.ts` tiene `mockApiBaseUrl` vacío y no hay una URL guardada previamente en el navegador, la app usa datos locales de prueba. En «Panel», se muestra un resumen actualizado.

## 4. Configurar tu proyecto de MockAPI (REQUISITO PARA LA ENTREGA)

1. Abrir [mockapi.io](https://mockapi.io/) y crear cuenta y proyecto.
2. Crear **tres recursos** con estos nombres **exactos**:

   **`productos`**
   - `id`: generado automáticamente por MockAPI, string.
   - `nombre`: string. Ej. `Corte clásico`.
   - `categoria`: string. Valores usados: `Corte`, `Barba`, `Combo`, `Tratamiento`.
   - `descripcion`: string.
   - `precio`: number. Ej. `12000`.
   - `duracionMinutos`: number. Ej. `30`.
   - `activo`: boolean. Ej. `true`.

   **`clientes`**
   - `id`: generado automáticamente por MockAPI, string.
   - `nombre`: string.
   - `apellido`: string.
   - `email`: string.
   - `telefono`: string. (NO number: puede tener 0 al inicio y símbolos).
   - `fechaRegistro`: string con formato `2026-10-19`.

   **`turnos`**
   - `id`: generado automáticamente por MockAPI, string.
   - `clienteId`: string, debe coincidir con un ID de `clientes`.
   - `productoId`: string, debe coincidir con un ID de `productos`.
   - `fecha`: string con formato `AAAA-MM-DD` (ej. `2026-10-19`).
   - `hora`: string `HH:mm` (ej. `10:30`).
   - `estado`: string: `pendiente`, `confirmado`, `completado` o `cancelado`.
   - `observaciones`: string.

3. Dejar habilitados los métodos **GET, POST, PUT, DELETE**.
4. Copiar la **URL base** de MockAPI. Ej. `https://xxxxxxxx.mockapi.io/api/v1`. No pegar el sufijo `/turnos`.
5. En `src/environments/environment.ts`, pegar esa URL en `mockApiBaseUrl` entre las comillas. La pantalla API se eliminó del menú a pedido; la conexión HTTP se conserva.
6. Comprobar que `productos`, `clientes` y `turnos` existen. Pueden estar vacíos; en ese caso, cargar primero servicios y clientes y por último turnos desde la aplicación.
7. Probar crear, listar, editar y eliminar, **recargar la página** y comprobar que los datos permanecen en MockAPI.

Para cambiar el valor predeterminado entre modo local y remoto, borrar/poner la URL en `src/environments/environment.ts` y reiniciar Angular. Si el navegador ya había guardado una URL con la versión anterior, esa URL de `localStorage` tendrá prioridad; se puede borrar la clave `tuty_mockapi_base` para volver a usar el valor del archivo. Los datos locales y remotos son separados; no se sincronizan. No se incluyó ninguna URL inventada.

## 5. Navegación y features

```
src/app/
├── core/
│   ├── guards/                  auth.guard.ts y role.guard.ts
│   ├── models/                  interfaces Cliente, Producto, Turno y Sesion
│   └── services/                Auth, ApiConfig y DemoData (compartidos)
├── shared/
│   ├── components/              Buscador (@Input/@Output) y Vacio
│   ├── directives/              EstadoTurnoDirective
│   └── pipes/                   DuracionPipe
├── features/
│   ├── inicio/                  landing pública
│   ├── auth/                    login
│   ├── panel/                   resumen (dashboard)
│   ├── productos/               catálogo CRUD y ProductosService
│   ├── clientes/                clientes CRUD y ClientesService
│   ├── turnos/                  turnos CRUD, TurnosService y util de horarios
│   └── errores/                 403 y 404
├── app.routes.ts                configuración central de rutas y lazy loading
├── app.config.ts                provideRouter, provideHttpClient, animaciones
└── app.component.*              navegación global, router-outlet y logout
```

**Rutas:** `inicio`, `login`, `panel`, `productos`, `productos/nuevo`, `productos/editar/:id`, `clientes`, `clientes/nuevo`, `clientes/editar/:id`, `turnos`, `turnos/nuevo`, `turnos/editar/:id`, `sin-permiso`, y `**` (404). Desde cualquier feature se puede volver a su listado y navegar desde el menú global. Las rutas de listas e interiores se cargan con `loadChildren` y `loadComponent` bajo demanda.

**Datos por servicio HTTP:** `ProductosService`, `ClientesService` y `TurnosService` usan `HttpClient` con GET/POST/PUT/DELETE si hay una URL válida. De lo contrario, llaman a `DemoDataService` local.

**Validaciones:** campos obligatorios; correo (`Validators.email`); teléfono (`Validators.pattern`); precio/duración (`Validators.min/max`); longitudes (`minLength/maxLength`). Los horarios se seleccionan de un listado generado de 30 en 30 minutos, de lunes a sábado, que excluye el pasado y evita solapamientos con otros servicios. Una reserva cancelada libera su franja. Verifica de nuevo la disponibilidad antes de enviar la reserva.

> **Límite técnico:** la comprobación de choques en un frontend y con MockAPI no garantiza exclusión mutua si dos personas reservan exactamente a la vez; una versión real requiere control transaccional en backend.

## 6. Pruebas

```bash
npm test
```

Se incluyen tests Jasmine/Karma de: generación de horarios y solapamientos, inicio/cierre de sesión, roles, validación de URL MockAPI y operaciones HTTP CRUD simuladas con `HttpTestingController`.

`npm test` usa ChromeHeadless. Si falla porque no se encuentra Chrome, configurá un navegador Chrome local o ejecutá `npx ng test --watch=false --browsers=Chrome`.

**Prueba funcional manual recomendada:**

1. Ingresar como admin; comprobar mensaje de bienvenida, rol y datos del panel.
2. Crear servicio; editar precio y duración; verificar lista y pipes de moneda/duración.
3. Crear cliente; intentar enviar email incorrecto y teléfono inválido; corregir y guardar.
4. Agendar turno con ese cliente y servicio; seleccionar fecha y hora disponible.
5. Intentar reservar otro turno sobre la misma franja: **debe impedirlo**.
6. Editar estado a cancelado; comprobar que ese espacio vuelva a estar disponible.
7. Probar eliminar turno; después eliminar cliente y servicio (si no tienen turnos asociados).
8. Ingresar como barbero; comprobar que puede ver y gestionar turnos, pero no clientes ni administrar servicios. Probar URL `/clientes` escrita directamente.
9. Cerrar sesión; probar `/panel` sin estar logueado y verificar redirección a login.
10. Verificar F5, navegación atrás/adelante, rutas internas `/:id`, enlace inexistente (404), tamaño móvil y consola sin errores.
11. Con MockAPI conectado, observar GET/POST/PUT/DELETE en Network F12 y repetir el CRUD.
12. Comprobar que el menú y las rutas ya no tienen «API» ni «Feriados» y que el pie no presenta «Demostración local».

## 7. Compilar y publicar

```bash
npm run build
```

El output del builder `application` se generará en `dist/the-barber-tuty/browser/`. Revisar el mensaje de la consola para confirmar la ruta exacta.

**GitHub (desde la carpeta del proyecto):**

```bash
git init
git add .
git commit -m "Proyecto final The Barber Tuty"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Creá el repositorio vacío en GitHub antes de agregar el remote y reemplazá el ejemplo por la URL real.

**Vercel:** importar el repositorio; framework Angular, build `npm run build`, directorio de salida `dist/the-barber-tuty/browser` si no se autodetecta. `vercel.json` incluye rewrite a `index.html` para poder abrir `/turnos/nuevo` directamente. Revisar que el build haya generado el `index.html` en esa carpeta. También se incluye `public/_redirects` para Netlify.

**Antes de entregar:** verificar npm install, build y tests; conectar MockAPI real; probar el deploy publicado con recarga F5; subir a GitHub y entregar URL pública + repositorio. El ZIP, por sí solo, no cumple con la parte de deploy/repo de la consigna.

## 8. Material para la defensa

Leer `GUIA_DEFENSA.md`: explica qué es un servicio, dónde está cada servicio, dónde se usa Angular Material, flujo de CRUD, Router/Guards/lazy loading, formularios, MockAPI, seguridad y ejemplos de preguntas del profesor. Leer también `CHECKLIST_PRUEBAS.md`.
