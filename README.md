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

