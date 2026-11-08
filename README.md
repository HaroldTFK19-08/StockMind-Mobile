# StockMind · App móvil

Gestor de inventario del SENA construido con Expo Router y NativeWind.

## Puesta en marcha

```bash
npm install
npx expo start --clear
```

La integración de datos se dejó sin configurar intencionalmente. Las funciones de
los servicios de negocio en `src/modules/*/*.service.js` lanzan un error explícito
hasta que se implemente la nueva conexión. El inicio de sesión cuenta con un modo
demo local para validar los portales por rol mientras se integra el backend.

## Arquitectura

```text
app/       Rutas de Expo Router.
src/core/  Persistencia local de sesión y utilidades base.
src/shared/ UI, hooks, tema y utilidades reutilizables.
src/modules/ Dominios de negocio, pantallas y contratos de servicio.
```

Las pantallas consumen los servicios de su dominio. Mientras se integra el
backend, el inicio de sesión usa cuatro cuentas demo locales para probar la
navegación por rol. No son credenciales reales ni deben usarse en producción:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@stockmind.test` | `Admin123!` |
| Instructor | `instructor@stockmind.test` | `Instructor123!` |
| Cuentadante | `cuentadante@stockmind.test` | `Cuentadante123!` |
| Aprendiz | `aprendiz@stockmind.test` | `Aprendiz123!` |

Las cuentas están definidas en `src/modules/auth/auth.service.js` y deben
reemplazarse por la integración real del backend antes de publicar la app.
