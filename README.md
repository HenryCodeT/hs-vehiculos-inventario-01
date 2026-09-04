# HS Vehículos — Inventario

Sistema web de inventario vehicular para HS Vehículos. Permite registrar, editar, eliminar y filtrar vehículos, con exportación a Excel y base de datos en la nube.

## Stack

- **Next.js 14** (App Router)
- **React Query** — estado del servidor y caché
- **TailwindCSS** — estilos
- **Prisma 7 + Neon** — base de datos PostgreSQL serverless
- **react-hook-form** — formularios
- **xlsx** — exportación a Excel

## Vistas

| Ruta | Descripción |
|------|-------------|
| `/` | Tabla de inventario con filtros, búsqueda y CRUD completo |

### Filtros por tab

| Tab | Lógica |
|-----|--------|
| Registro de carros | Todos los registros |
| Carros vendidos | estado = VENDIDO |
| Separados / Financiados | estado = SEPARADO o FINANCIADO |
| Carros libres | estado = LIBRE |
| Entregados | situacion = ENTREGADO |

## API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/vehicles` | GET | Listar vehículos (soporta filtros por tab, búsqueda y rango de fechas) |
| `/api/vehicles` | POST | Crear vehículo |
| `/api/vehicles/[id]` | PATCH | Editar vehículo |
| `/api/vehicles/[id]` | DELETE | Eliminar vehículo |

## Variables de entorno

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...   # Neon pooler URL
DIRECT_URL=postgresql://...     # Neon direct URL (sin -pooler)
```

## Setup

```sh
nvm use 20          # Node 20+ requerido
pnpm install
npx prisma generate
pnpm dev            # http://localhost:3000
```

### Seed (carga inicial de datos)

```sh
node node_modules/tsx/dist/cli.mjs prisma/seed.ts
```

### Push schema a la BD

```sh
node node_modules/prisma/build/index.js db push
```

## Campos del vehículo

| Campo | Tipo |
|-------|------|
| VIN (chasis) | Texto |
| Marca | Select (JETOUR, SOUEAST, KYC, YOUTONG) |
| Modelo | Combobox dependiente de marca (permite texto libre) |
| Color | Texto |
| Cliente | Texto |
| Precio Compra / Venta | Número |
| Fecha Factura / Llegada | Fecha (DD/MM/YYYY) |
| Ubicación | Select (LAVADERO, GRUPO HS, DON PANCHO, TIENDA PRINCIPAL, TIENDA POSTERIOR, NUEVO LOCAL) |
| Asesor | Select (VLADIMIR, ALVARO, WAGNER, DIEGO, ADMINISTRACION) |
| Estado | Select (LIBRE, SEPARADO, VENDIDO, FINANCIADO) |
| Situación de entrega | Select (PENDIENTE, ENTREGADO) |
| Código | Texto |
| Observaciones | Texto largo |
