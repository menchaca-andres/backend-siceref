# BACKEND SICEREF
Este es el backend del sistema SICEFER (Sistema Centralizado de Refugios de Mascotas)

## Tecnologías

El backend está desarrollado en TypeScript con Express, PostgreSQL y Prisma.

```bash

bun run dev
```

```bash

npx prisma db push
```

## Cache con Redis

El backend cachea respuestas GET compartibles para acelerar pantallas públicas y listados del panel.

Variables de entorno:

| Variable | Descripción | Default |
| --- | --- | --- |
| `REDIS_URL` | URL de conexión Redis. Si no existe o falla, usa cache en memoria local. | - |
| `CACHE_TTL_SECONDS` | TTL default para respuestas cacheadas. | `300` |
| `CACHE_NAMESPACE` | Prefijo para separar ambientes o apps en Redis. | `siceref` |

Ejemplo:

```bash
REDIS_URL=redis://default:password@host:6379
CACHE_TTL_SECONDS=300
CACHE_NAMESPACE=siceref-prod
```

No se cachean endpoints de logs, notificaciones, conversaciones, pagos ni login.

## Estructura del proyecto

```
├── bun.lock
├── index.ts
├── package-lock.json
├── package.json
├── prisma
│   └── schema.prisma
├── prisma.config.ts
├── README.md
├── src
│   ├── app.ts
│   ├── config
│   │   ├── bd_borrador.sql
│   │   ├── cloudinary.ts
│   │   └── database.ts
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   ├── roles.middleware.ts
│   │   └── upload.middleware.ts
│   ├── modules
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.types.ts
│   │   ├── especies
│   │   │   ├── especie.controller.ts
│   │   │   ├── especie.model.ts
│   │   │   ├── especie.routes.ts
│   │   │   ├── especie.service.ts
│   │   │   └── especie.types.ts
│   │   ├── mascotas
│   │   │   ├── mascota.controller.ts
│   │   │   ├── mascota.model.ts
│   │   │   ├── mascota.routes.ts
│   │   │   ├── mascota.service.ts
│   │   │   └── mascota.types.ts
│   │   ├── permisos
│   │   │   ├── permiso.controller.ts
│   │   │   ├── permiso.model.ts
│   │   │   ├── permiso.routes.ts
│   │   │   ├── permiso.service.ts
│   │   │   └── permiso.types.ts
│   │   ├── publicaciones
│   │   │   ├── publicacion.controller.ts
│   │   │   ├── publicacion.model.ts
│   │   │   ├── publicacion.routes.ts
│   │   │   ├── publicacion.service.ts
│   │   │   └── publicacion.types.ts
│   │   ├── razas
│   │   │   ├── raza.controller.ts
│   │   │   ├── raza.model.ts
│   │   │   ├── raza.routes.ts
│   │   │   ├── raza.service.ts
│   │   │   └── raza.types.ts
│   │   ├── refugios
│   │   │   ├── refugio.controller.ts
│   │   │   ├── refugio.model.ts
│   │   │   ├── refugio.routes.ts
│   │   │   ├── refugio.service.ts
│   │   │   └── refugio.types.ts
│   │   ├── roles
│   │   │   ├── role.controller.ts
│   │   │   ├── role.model.ts
│   │   │   ├── role.routes.ts
│   │   │   ├── role.service.ts
│   │   │   └── role.types.ts
│   │   └── usuarios
│   │       ├── usuario.controller.ts
│   │       ├── usuario.model.ts
│   │       ├── usuario.routes.ts
│   │       ├── usuario.service.ts
│   │       └── usuario.types.ts
│   ├── types
│   │   └── express.d.ts
│   └── utils
│       └── date.ts
└── tsconfig.json
```
