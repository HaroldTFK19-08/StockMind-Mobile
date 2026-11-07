# StockMind · App móvil

Gestor de inventario del SENA construido con Expo Router y NativeWind.

## Puesta en marcha

```bash
npm install
npx expo start --clear
```

La integración de datos se dejó sin configurar intencionalmente. Las funciones de
los servicios en `src/modules/*/*.service.js` lanzan un error explícito hasta que
se implemente la nueva conexión. No hay URLs de API, mocks ni cuentas de prueba
en el proyecto.

## Arquitectura

```text
app/       Rutas de Expo Router.
src/core/  Persistencia local de sesión y utilidades base.
src/shared/ UI, hooks, tema y utilidades reutilizables.
src/modules/ Dominios de negocio, pantallas y contratos de servicio.
```

Las pantallas consumen los servicios de su dominio. La conexión nueva debe
implementarse en esos servicios sin introducir datos de demostración.
