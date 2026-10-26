# StockMind · App móvil

Gestor de inventario del SENA (Expo SDK 56 + Expo Router + NativeWind).

## Puesta en marcha

```bash
npm install
npx expo install expo-secure-store   # asegura la versión exacta para el SDK
cp .env.example .env                 # configura la URL del backend
npx expo start --clear               # limpia la caché (necesario tras cambiar .env)
```

Sin backend, deja `EXPO_PUBLIC_USE_MOCKS=true`: la app funciona con datos de prueba en memoria
y en el login aparecen botones para entrar con cada rol.

| Rol          | Correo                        | Contraseña     |
|--------------|-------------------------------|----------------|
| Administrador| adminsena@soy.sena.edu        | admin123       |
| Instructor   | instructorsena@soy.sena.edu   | instructor124  |
| Cuentadante  | dantesena@soy.sena.edu        | dante321       |
| Aprendiz     | aprendizsena@soy.sena.edu     | aprendiz2026   |

## Arquitectura modular por dominios

```
app/                     Solo rutas (Expo Router). Archivos de 1-5 líneas que montan pantallas.
  _layout.jsx            Providers + redirección según la sesión
  auth/ admin/ instructor/ cuentaDante/ aprendiz/
src/
  core/                  Infraestructura, sin UI
    config/env.js        Variables EXPO_PUBLIC_*
    api/httpClient.js    axios + timeout + errores
    api/endpoints.js     ★ Todas las rutas del backend en un solo lugar
    api/mapping.js       Helpers para mappers (pick, relName…)
    api/mockCollection.js CRUD en memoria para modo demo
    storage/             Token en SecureStore (localStorage en web)
  shared/                Reutilizable por cualquier dominio
    ui/                  Design system: Button, TextField, SelectField, BottomSheet, ResourceList…
    hooks/               useResource, useMutation, useFilteredList
    utils/ theme/
  navigation/            Portales por rol: pestañas, header, menú lateral
  modules/               ★ Un módulo por dominio de negocio
    auth/ usuarios/ centros/ ambientes/ elementos/
    asignaciones/ traslados/ reportes/ notificaciones/ dashboard/
```

Cada módulo sigue la misma forma:

```
modules/elementos/
  elementos.service.js   Casos de uso (list, create, update…). Decide mock vs. API.
  elementos.mapper.js    Traduce backend ⇄ app. ★ Aquí se adapta si tu API usa otros nombres.
  elementos.mock.js      Datos de demostración
  elementos.constants.js Estados, categorías, íconos
  components/            Card, Detail, Form del dominio
  screens/               Pantallas completas, configurables por props
  index.js               API pública del módulo
```

Reglas: `app/` no contiene lógica; las pantallas nunca llaman a `fetch`, siempre a un `*.service.js`;
los componentes trabajan con el modelo de la app (camelCase) y solo el mapper conoce el formato del backend.

## Conectar el backend (Laravel + Sanctum)

La capa HTTP usa **axios** (`src/core/api/httpClient.js`): una sola instancia con `baseURL`, timeout,
`Accept: application/json`, log de depuración y errores normalizados (`ApiError`). Por ahora no envía token:
el login todavía no existe en Laravel y funciona de forma local con las cuentas demo.

1. **URL** en `.env` (`EXPO_PUBLIC_API_URL`), sin `/` al final. Nunca `localhost` en el celular: usa la IP
   del PC (`ipconfig` → IPv4). Celular y PC en la misma Wi-Fi.
   - XAMPP con Apache apuntando a `public/`: `http://<IP>/v1`
   - `php artisan serve --host=0.0.0.0 --port=8000`: `http://<IP>:8000/api/v1`
2. **Modo mixto** mientras el backend se completa:
   - `EXPO_PUBLIC_USE_MOCKS=true` + `EXPO_PUBLIC_API_MODULES=centros` → centros va a Laravel y el resto usa datos demo.
   - Agrega módulos a la lista a medida que existan sus rutas (`centros,usuarios`…).
   - `EXPO_PUBLIC_USE_MOCKS=false` → todos los módulos van a Laravel.
   - En código: `env.isMock("centros")` decide en cada `*.service.js`.
3. **Login**: es local (`auth.service.js`). Cuando Laravel tenga Sanctum, se cambia ese archivo y se agrega
   el token en el interceptor de `httpClient.js` (ya está el comentario de dónde va).
4. Reinicia siempre con `npx expo start --clear` después de cambiar `.env`.
5. Con `EXPO_PUBLIC_API_DEBUG=true` la consola de Metro muestra cada petición y respuesta (las contraseñas se ocultan).
6. Rutas distintas → `src/core/api/endpoints.js`. Campos distintos → el `*.mapper.js` del módulo.
7. Archivos (fotos): `http.upload(ruta, formData, { method: "PUT" })` envía POST + `_method`, como lo exige Laravel.
8. Para probar en **web**, habilita CORS en Laravel (`config/cors.php`, `paths` debe incluir tus rutas, p. ej. `v1/*`).
   En el celular no hace falta CORS.
9. En un **APK de producción** Android bloquea `http://`: publica la API con `https://`
   (en Expo Go y en desarrollo funciona con `http`).

Las respuestas pueden venir como arreglo directo o envueltas en `{ data }` (incluida la paginación de Laravel),
`{ results }` o `{ items }`. Los errores se leen de `message`, `mensaje`, `error` o `detail`; en validaciones
(422) se muestran los mensajes de `errors` y quedan por campo en `error.fieldErrors`.

### Contrato esperado (sugerido)

Hoy solo existe **centros** en Laravel, sin autenticación. El resto de la tabla es la propuesta para cuando se construya
(las rutas de `/auth` y el token `Bearer` llegarán cuando se haga el login).

| Método | Ruta | Cuerpo / respuesta |
|---|---|---|
| POST | `/auth/login` | `{ correo, contrasena }` → `{ token, user }` |
| POST | `/auth/register` | `{ nombre, documento, correo, contrasena, rol }` → `{ user }` (o `{ token, user }`) |
| GET | `/auth/me` | usuario autenticado |
| GET | `/dashboard/resumen` | contadores según el rol del token (ver `dashboard.mapper.js`) |
| GET | `/usuarios?rol=aprendiz` | lista de usuarios |
| GET / POST | `/centros` | `{ nombre, ubicacion, direccion, telefono? }` |
| GET | `/ambientes?centro_id=` | lista de ambientes |
| GET / POST | `/elementos?estado=&ambiente_id=` | `{ nombre, placa?, marca?, categoria, estado, descripcion, ambiente_id }` |
| PATCH | `/elementos/:id` | campos parciales, p. ej. `{ estado }` |
| GET / POST | `/asignaciones` | `{ aprendiz_id, elemento_id, fecha_inicio, fecha_fin, observaciones? }` |
| GET | `/asignaciones/mias` | asignaciones del aprendiz autenticado |
| PATCH | `/asignaciones/:id` | `{ estado: "Finalizada" }` |
| GET / POST | `/traslados` | `{ elemento_id, ambiente_destino_id, fecha_salida, fecha_llegada, motivo }` |
| PATCH | `/traslados/:id` | `{ estado: "En tránsito" \| "Entregado" }` |
| GET / POST | `/reportes` | `{ elemento_id, tipo, descripcion }` |
| GET | `/reportes/mios` | reportes creados por el usuario autenticado |
| PATCH | `/reportes/:id` | `{ estado, respuesta? }` |
| GET | `/notificaciones` | lista |
| PATCH | `/notificaciones/:id/leida` · `/notificaciones/leer-todas` | — |

Fechas en formato ISO `AAAA-MM-DD`. Roles aceptados en cualquier forma
(`ADMIN`, `Administrador`, `cuenta_dante`, `{ nombre: "Instructor" }`…); los normaliza `auth/roles.js`.

## Agregar un dominio nuevo

1. Crea `src/modules/<dominio>/` copiando la forma de `centros/` (el más simple).
2. Agrega sus rutas en `src/core/api/endpoints.js`.
3. Crea el archivo de ruta en `app/<rol>/<pantalla>.jsx` y, si es pestaña, regístrala en `src/navigation/portals.js`.
