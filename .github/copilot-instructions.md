# Consulta Previa Admin - AI Coding Guidelines

## 🔴 Reglas Críticas

- **Solo código solicitado**: Sin pruebas, ejemplos ni comentarios innecesarios
- **Sin archivos adicionales**: No crear README/markdown salvo solicitud explícita
- **Sentence case**: Solo primera letra mayúscula en UI
- **MCP obligatorio**: Usar sequential-thinking y mui-mcp servers

## Arquitectura

**Next.js 15** (puerto 2418 dev, 20426 prod) con Turbopack

| Carpeta | Propósito |
|---------|-----------|
| `pages/` | Rutas (api/, registros/, avance-cursos/, etc.) |
| `components/` | UI organizada por feature (Registros/, Panel/, Cursos/) |
| `hooks/` | Custom hooks (usePermission, useAvancesData, storage/) |
| `contexts/` | Context providers (CicloContext) |

## Stack Principal

- **Auth**: Clerk (`@clerk/nextjs`) - protección automática en middleware.ts
- **UI**: MUI Material v7 + Joy + X (DataGrid, Charts)
- **Data**: SWR para fetching/cache
- **Forms**: react-hook-form
- **Animaciones**: motion (framer-motion)

## Patrones Obligatorios

### Autenticación (middleware.ts)
```typescript
// Rutas públicas definidas, resto requiere auth
const isPublicRoute = createRouteMatcher(["/login(.*)"]);
```

### Permisos (hooks/usePermission)
```javascript
import usePermission from "@/hooks/usePermission";
usePermission("moodle.view_actividadescompletadas");  // Redirige si no tiene permiso
```

### API Routes → Django Backend
```javascript
// pages/api/permissions.js pattern
const { getToken } = getAuth(req);
const token = await getToken();
await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/...", {
    headers: { Authorization: `Bearer ${token}` }
});
```

### Data Fetching (SWR)
```javascript
import useSWR from "swr";
import fetcher from "@/components/fetcher";
const { data, error, isLoading } = useSWR("/api/endpoint", fetcher);
```

### MUI (SIEMPRE usar mui-mcp)
1. Llamar `useMuiDocs` para el paquete relevante
2. Llamar `fetchDocs` con URLs del contenido retornado
3. Usar contenido para implementar

## Estructura de Componentes

```
components/
├── Registros/      # Gestión de inscritos
├── Panel/          # Dashboard y estadísticas
├── Cursos/         # Administración de cursos
├── Field/          # Componentes de formulario reutilizables
├── Form/           # Formularios complejos
└── Wrapper/        # Layout wrappers
```

## Comandos

```bash
npm run dev         # Dev con Turbopack (puerto 2418)
npm run build       # Build producción
npm run start       # Producción (puerto 20426)
```

## Integración con Backend

- **Base URL**: `NEXT_PUBLIC_BASE_URL` apunta a Django (puerto 21411)
- **Auth flow**: Clerk → JWT token → Django API
- **Permisos**: Sincronizados desde Django vía `/api/autenticacion/permisos`
