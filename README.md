# StockMind · App móvil

Gestor de inventario del SENA construido con Expo Router y NativeWind.

## Puesta en marcha

```bash
npm install
npx expo start --clear
```

Los servicios en `src/modules/*/*.service.js` consumen el backend Laravel en
`EXPO_PUBLIC_API_URL` (por ejemplo `http://192.168.101.72:8000/v1`). El inicio de
sesión usa `POST /v1/auth/login` y guarda el token de Sanctum para las demás
peticiones. El registro sigue siendo local mientras se adapta al backend, así que
las cuentas creadas desde la app no sirven para entrar con el servidor.

## Arquitectura

```text
app/       Rutas de Expo Router.
src/core/  Persistencia local de sesión y utilidades base.
src/shared/ UI, hooks, tema y utilidades reutilizables.
src/modules/ Dominios de negocio, pantallas y contratos de servicio.
```

Las pantallas consumen los servicios de su dominio. Estas cuentas de prueba sí
existen en la base de datos del backend y sirven para probar los portales por
rol. No deben usarse en producción:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@stockmind.test` | `Admin123!` |
| Instructor | `instructor@stockmind.test` | `Instructor123!` |
| Cuentadante | `cuentadante@stockmind.test` | `Cuentadante123!` |
| Aprendiz | `aprendiz@stockmind.test` | `Aprendiz123!` |

Las cuentas están definidas en `src/modules/auth/auth.service.js` y deben
reemplazarse por la integración real del backend antes de publicar la app.
