# Servidor de MiDoc

Base de Python con Flask, python-dotenv y el SDK oficial de Supabase.
Incluye una fábrica de aplicación, configuración externa, un punto de
entrada WSGI y respuestas HTTP de error en JSON. Solo está implementada
la comprobación pública `GET /api/estado`.

## Instalación

Se recomienda Python 3.14; se admiten las versiones 3.12 a 3.14. La
verificación local se realizó con Python 3.14.7. Desde esta carpeta:

```powershell
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock -e ".[dev]"
```

Los comandos usan directamente el Python del entorno virtual. Las
dependencias se declaran en `pyproject.toml`; `requirements.lock` conserva
las versiones resueltas del entorno de desarrollo, incluidas sus dependencias
transitivas. Las herramientas de desarrollo son pytest y Ruff.

## Arranque local

```powershell
.\.venv\Scripts\python.exe -m flask run
```

`.flaskenv` configura `wsgi:aplicacion`, la dirección `127.0.0.1`, el puerto
8080 y el depurador desactivado. El entorno del proceso y los argumentos
de la CLI pueden sobrescribir esos valores. El servidor incluido en Flask
se utiliza para desarrollo; el despliegue requerirá un servidor WSGI y HTTPS.

El modo `local`, predeterminado, permite arrancar sin Supabase. La ruta
[http://127.0.0.1:8080/api/estado](http://127.0.0.1:8080/api/estado) responde
`{"status":"UP"}`. Este resultado informa del proceso web y no comprueba
acceso a Supabase. Las rutas no implementadas devuelven 404 y los métodos
no admitidos devuelven 405, ambos en JSON.

## Configuración de Supabase

Preparar un proyecto en Supabase y obtener su URL y su clave publicable
`sb_publishable_...`. Crear el archivo privado de configuración si no existe:

```powershell
if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
}
```

Completar en `.env`:

```dotenv
MIDOC_MODO=supabase
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

El archivo es leído por python-dotenv. La fábrica utiliza explícitamente
`server/.env`, y las variables existentes del proceso tienen prioridad.
La URL debe usar HTTPS, sin rutas ni credenciales. Se permite HTTP para
`localhost`, `127.0.0.1` y `::1` si se utiliza una instancia local de Supabase.

Reiniciar Flask después de modificar la configuración:

```powershell
.\.venv\Scripts\python.exe -m flask run
```

En modo `supabase`, la fábrica exige ambas variables y prepara el SDK con
tiempos de espera de 10 segundos, sin persistir sesiones ni refrescar tokens.
El cliente está disponible internamente en `aplicacion.extensions["supabase"]`.
La inicialización no envía consultas y no demuestra que la URL o la clave
sean válidas en el servicio remoto.

Esta base acepta una clave publicable y rechaza claves privilegiadas.
Una clave publicable identifica la aplicación; los permisos de los usuarios
deberán implementarse con autenticación y políticas RLS. El cliente preparado
todavía no tiene sesión de usuario ni se comparte como sesión autenticada.

La conexión real se verificará cuando se disponga de un proyecto configurado
y un esquema definido. Esta etapa no crea tablas, usuarios, migraciones ni
registros remotos.

## Cliente y seguridad

El cliente de desarrollo accede al servidor por el proxy de Vite en `/api`,
sin requerir CORS. Las claves se configuran en el servidor y no se envían al
cliente React. Los archivos `.env` y `.venv` están excluidos de Git.

La autenticación, la autorización y la protección CSRF de las futuras
operaciones se definirán al implementar el acceso. Los rechazos 404 o 405
actuales solo reflejan que esas rutas y métodos no están implementados.

## Verificación

```powershell
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m ruff format --check .
.\.venv\Scripts\python.exe -m pip check
```

Las pruebas aíslan las variables de entorno y emplean el cliente de pruebas
de Flask. Comprueban los modos de configuración, las entradas inválidas,
los errores HTTP y la inicialización local del SDK. No consultan Supabase.

Después de cambiar dependencias, actualizar el entorno, regenerar
`requirements.lock` con `pip freeze --exclude-editable` y repetir las
comprobaciones. El archivo generado no debe contener rutas locales ni
credenciales.

## Referencias

- [Fábrica de aplicaciones Flask](https://flask.palletsprojects.com/en/stable/patterns/appfactories/).
- [SDK Python de Supabase](https://supabase.com/docs/reference/python/initializing).
- [Claves de API y roles de Supabase](https://supabase.com/docs/guides/api/api-keys).
