---
applyTo: '/home/jr0237/Documentos/consulta-previa-registro/consulta-previa-admin/**'
---

# Consulta Previa - AI Coding Guidelines

## 🔴 REGLAS CRÍTICAS - NO OMITIR 🔴

### ⚠️ CUMPLIMIENTO OBLIGATORIO ⚠️

- **GENERAR O EDITAR ÚNICAMENTE LO SOLICITADO**: Evitar generar código innecesario como código con pruebas, códigos de ejemplo, o comentarios innecesarios, ni archivos con instrucciones a menos que se solicite explícitamente, en especial con archivos markdown.
- **SOLO EL CÓDIGO NECESARIO**: No crear archivos README, markdown, ni datos de prueba a menos que sea explícitamente solicitado.
- **ENFOQUE MINIMALISTA**: Producir únicamente el código funcional requerido para cumplir la solicitud específica.
- **CAPITALIZACIÓN DE COMPONENTES**: Usar sentence case en títulos, botones y otros componentes; sólo la primera letra de la frase en mayúscula y el resto en minúsculas.
- **USO DE SERVIDORES MCP**: Los servidores MCP que siempre debes usar son sequential-thinking. Siempre debes de hacerlo.

---

## Architecture Overview

This is a multi-component educational platform for managing Moodle course completions and generating reports:

- **Django Backend** (`consulta_previa_django/`): REST API on port 21411
- **React Frontend** (`consulta-previa/`): Vite app (port 7153) → builds to `consulta-previa-proxy/`
- **Next.js Admin** (`consulta-previa-admin/`): Management panel on port 2418
- **Infrastructure**: PostgreSQL + Redis for background tasks

## Component-Specific Guidelines

### Django Backend (`consulta_previa_django/`)

#### Tech Stack
- Django 5.1.1 + DRF
- PostgreSQL + Redis
- JWT Authentication (`djangorestframework_simplejwt`)
- OpenPyXL for Excel exports
- Simple History for audit trails

#### Critical Patterns

**Permission System**
Always use the custom permission decorator:
```python
@method_decorator(check_permissions("moodle.view_actividadescompletadas"))
def post(self, request):
```

**Database Query Optimization**
ALWAYS use:
- `select_related()` for FK relationships (ciudad, etnia, tipo_cliente)
- `prefetch_related()` with `Prefetch()` for reverse FKs
- `only()` fields when loading large datasets
- Bulk operations over loops

Example pattern:
```python
personas = Persona.objects.filter(...).select_related('ciudad', 'etnia').prefetch_related(
    Prefetch('actividadescompletadas_set', queryset=...)
)
```

**Task Management**
Background processes use Redis-based TaskManager:
```python
process_manager.add_task(procesar_informacion, (data, process_manager._process_task))
```

**Excel Export Pattern**
Use `openpyxl` with the custom `ajustar_ancho_columnas()` utility for consistent formatting.

#### Apps Structure
- `autenticacion/`: Auth & permissions
- `moodle/`: Core course/activity management 
- `inscripcion/`: Registration logic
- `usuario/`: User profiles & locations

#### Key Models & Relationships
- `Persona` → `ActividadesCompletadas` → `Actividades` → `Modulos`
- `MiembrosGrupo` for course groups (courses 3,4 only)
- Custom `get_filtro()` function builds dynamic query filters

### React Frontend (`consulta-previa/`)

#### Tech Stack
- Vite build system (port 7153)
- React 18 + React Router DOM
- Material-UI Joy + Material UI
- SWR for data fetching
- React Hook Form
- Builds to `../consulta-previa-proxy`

#### Development Patterns

**State Management**
- Use SWR for server state management
- Custom hooks with SWR for API calls
- Local state with useState/useReducer for UI state

**Form Handling**
- React Hook Form for all forms
- Material-UI Joy components for UI
- Custom validation patterns

**Routing**
- React Router DOM for navigation
- Protected routes with authentication checks

**Build Process**
```bash
npm run build  # Outputs to ../consulta-previa-proxy
```

### Next.js Admin (`consulta-previa-admin/`)

#### Tech Stack
- Next.js 15 with Turbopack
- Material-UI components
- Iron Session for authentication
- SWR for data fetching
- Port 2418

#### Development Patterns

**Authentication**
- Iron Session for secure session management
- JWT integration with Django backend
- Permission-based access control

**Data Management**
- SWR for caching and data fetching
- Material-UI X Data Grid for tables
- Material-UI X Charts for analytics

**Component Structure**
- Organized by feature in `/components`
- Reusable UI components
- Custom hooks in `/hooks`

## Performance Guidelines

### Database Optimization
- Use `select_related()` and `prefetch_related()` consistently
- Implement pagination for large datasets
- Use database indexes for frequently queried fields
- Bulk operations for multiple records

### Frontend Performance
- Code splitting with React.lazy()
- SWR caching strategies
- Optimize bundle size with Vite
- Image optimization

### API Design
- RESTful endpoints with proper HTTP methods
- Consistent error handling
- Pagination for list endpoints
- Field filtering with `only()` for large responses

## Development Workflows

### Start Development Environment
```bash
# Backend
cd consulta_previa_django && bash start.sh

# Frontend  
cd consulta-previa && npm run dev

# Admin
cd consulta-previa-admin && npm run dev
```

### Database Setup
```bash
docker-compose up -d  # PostgreSQL + Redis
python manage.py migrate
```

### Build & Deploy
```bash
# Frontend build
cd consulta-previa && npm run build

# Backend production
cd consulta_previa_django && python production.py
```

## Integration Points

### Moodle Data Flow
CSV uploads → `procesar_informacion()` → bulk insert `ActividadesCompletadas`

### Authentication Flow
- Django JWT tokens
- Frontend SWR authentication
- Admin Iron Session management

### File Handling
- Static files: `/var/www/consulta_previa/static/`
- Media uploads: Django MEDIA_ROOT
- Excel exports: OpenPyXL with custom formatting

## Code Style & Conventions

### Python (Django)
- PEP 8 compliance
- Class-based views for complex logic
- Function-based views for simple operations
- Custom managers for complex queries

### JavaScript/React
- ES6+ syntax
- Functional components with hooks
- Custom hooks for reusable logic
- Consistent naming conventions

### CSS/Styling
- Material-UI theming system
- Consistent spacing using theme values
- Responsive design patterns
- Accessibility considerations

## Environment Detection & Configuration

### Django Settings
- Use `socket.gethostname()` for dev/prod detection
- Environment-specific database configurations
- Debug settings based on environment

### Frontend Configuration
- Vite environment variables
- API endpoint configuration
- Build optimizations for production

## Critical Performance Views

`ReporteResumen` and `ExportarResumen` handle large datasets - they use optimized bulk queries and avoid N+1 patterns.

## Security Considerations

### Authentication
- JWT token validation
- Session security in admin panel
- CORS configuration for cross-origin requests

### Data Protection
- Input validation and sanitization
- SQL injection prevention through ORM
- XSS protection in frontend components

## Testing Guidelines

### Backend Testing
- Unit tests for models and utilities
- Integration tests for API endpoints
- Performance tests for large datasets

### Frontend Testing
- Component testing with React Testing Library
- Integration tests for user flows
- E2E testing for critical paths

---

Follow these guidelines consistently to maintain code quality, performance, and security across all components of the Consulta Previa platform.