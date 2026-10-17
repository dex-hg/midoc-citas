# midoc-citas

Sistema web de MiDoc para la gestión administrativa de consultas y citas
médicas, desarrollado para Análisis y Diseño de Sistemas de Información.

Esta etapa prepara el entorno de desarrollo con React, Flask y Supabase.
El cliente incluye un inicio de acceso, la propuesta de ingreso y las primeras
vistas del portal del paciente: resumen, consultas, citas, agenda y ayuda.
Son vistas de demostración con datos ficticios y sin persistencia.
El servidor implementa únicamente la comprobación de estado del proceso web.

## Organización

| Carpeta | Contenido |
| --- | --- |
| `client` | React, TypeScript, Vite, Bootstrap, React Router, TanStack Query y Lucide. |
| `server` | Python, Flask, python-dotenv y el SDK oficial de Supabase. |
| `db` | Indicaciones para trabajar con PostgreSQL administrado por Supabase. |

El código se mantiene en `C:\Proyectos\midoc-citas`. Los informes, diagramas,
videos y entregables del curso corresponden a la carpeta académica
`Análisis y Diseño de Sistemas de Información\Avance de Proyecto Final 2`.

## Requisitos

- Python 3.14 recomendado; el proyecto admite Python 3.12 a 3.14.
- Node.js 24 LTS recomendado; también se admite Node.js 22.12 o posterior de la rama 22.
- npm 10 o posterior.
- Un proyecto de Supabase cuando se configure el acceso al servicio.

El entorno verificado usa Python 3.14.7. Las dependencias del servidor se
declaran en `server/pyproject.toml` y sus versiones resueltas se registran en
`server/requirements.lock`. La instalación inicial requiere acceso a PyPI
y npm.

## Arranque local

En una terminal de PowerShell:

```powershell
Set-Location C:\Proyectos\midoc-citas\server
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock -e ".[dev]"
.\.venv\Scripts\python.exe -m flask run
```

El modo predeterminado `local` arranca sin credenciales ni llamadas a
Supabase. La comprobación de estado está en
[http://127.0.0.1:8080/api/estado](http://127.0.0.1:8080/api/estado).
Un resultado `UP` confirma el proceso Flask, sin acreditar una conexión
con Supabase. `.flaskenv` configura la dirección local y el puerto 8080.

En otra terminal:

```powershell
Set-Location C:\Proyectos\midoc-citas\client
npm ci
npm run dev
```

Abrir [http://127.0.0.1:5173](http://127.0.0.1:5173). Las solicitudes a
`/api` pasan al backend mediante el proxy de Vite. Los puertos son fijos:
si están ocupados, el proceso informa el conflicto.

## Configuración de Supabase

El recorrido previsto es React → Flask mediante `/api` → Supabase mediante
su SDK de Python. Las variables del servidor son `MIDOC_MODO`,
`SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`. Para inicializar el SDK se
activa el modo `supabase`, según `server/README.md`.

Los archivos `.env` están excluidos de Git y sus ejemplos sin valores
reales sí se versionan. El cliente conserva React con TypeScript y el proxy
actual; todavía no utiliza directamente el SDK de Supabase.

La inicialización del SDK valida la configuración y crea el cliente local.
La conectividad real, el esquema, las políticas RLS, la autenticación y las
operaciones del negocio quedan pendientes. No se han creado recursos ni
se han realizado escrituras en Supabase.

## Comprobaciones

Desde `server`:

```powershell
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m ruff format --check .
.\.venv\Scripts\python.exe -m pip check
```

Desde `client`:

```powershell
npm run lint
npm run typecheck
npm run build
npm run format:check
```

Las pruebas del servidor comprueban la configuración, el contrato HTTP
inicial, los errores JSON y la creación local del cliente Supabase. Usan
el cliente de pruebas de Flask y valores de prueba, sin consultar el servicio.

## Referencias técnicas

- [Fábrica de aplicaciones Flask](https://flask.palletsprojects.com/en/stable/patterns/appfactories/).
- [Inicialización del SDK Python de Supabase](https://supabase.com/docs/reference/python/initializing).
- [Claves de API de Supabase](https://supabase.com/docs/guides/api/api-keys).
- [Guía de Vite](https://vite.dev/guide/).

Las vistas se pueden recorrer iniciando solo el cliente. La autenticación,
los permisos por rol y la integración real de pacientes, consultas, pagos,
disponibilidad y citas se implementarán en las siguientes etapas.
