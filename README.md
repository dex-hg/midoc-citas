# MiDoc Backend

Backend del sistema MiDoc desarrollado con Python y Flask.

## Tecnologías

- Python
- Flask
- Flask-CORS
- python-dotenv
- Supabase SDK
- PostgreSQL (Supabase)

## Arquitectura

El backend se organiza por responsabilidades:

- `routes/`: endpoints HTTP de la API.
- `services/`: lógica de negocio.
- `repositories/`: acceso a la base de datos.
- `config/`: configuración y conexión con servicios externos.
- `tests/`: pruebas del backend.

Flujo general:

Frontend React
→ API Flask
→ Services
→ Repositories
→ Supabase
→ PostgreSQL

## Estado actual

### Completado

- Estructura inicial del backend.
- Aplicación Flask mediante Application Factory.
- Configuración de CORS.
- Endpoint general `/api/health`.
- Blueprints para:
  - Auth
  - Cliente
  - Doctor
  - Recepción
  - Promotor BCP
  - Administrador
- Endpoints iniciales de autenticación y registro.
- `AuthService` con validaciones iniciales.
- Validación de DNI.
- Validación de correo.
- Validación básica de contraseña.
- Definición de perfiles disponibles según el rol de la cuenta.
- Variables de entorno protegidas mediante `.gitignore`.

## Pendiente

### 1. Conexión con Supabase

Completar:

`app/config/supabase.py`

Utilizar las variables:

- `SUPABASE_URL`
- `SUPABASE_KEY`

Estas deben configurarse únicamente en `.env`.

NO subir `.env` ni credenciales al repositorio.

### 2. Repositories

Implementar acceso real a Supabase comenzando por:

`app/repositories/usuario_repository.py`

Operaciones iniciales sugeridas:

- buscar usuario por DNI
- buscar usuario por correo
- obtener usuario por ID
- comprobar DNI existente
- comprobar correo existente
- registrar usuario

Posteriormente implementar:

- `consulta_repository.py`
- `cita_repository.py`
- `doctor_repository.py`

### 3. Auth

Conectar `AuthService` con `UsuarioRepository` y Supabase Auth.

Completar:

- login real
- validación de existencia del DNI
- envío de código al correo
- verificación del código
- creación de cuenta

No crear usuarios falsos o lógica hardcodeada para simular la base de datos.

### 4. Servicios por rol

Implementar progresivamente:

- Cliente
- Doctor
- Recepción
- Promotor BCP
- Administrador

Mantener la separación:

Route → Service → Repository → Supabase

La lógica de negocio NO debe colocarse directamente en las rutas.

## Base de datos

La base de datos ya se encuentra creada en Supabase/PostgreSQL.

Actualmente contempla las entidades principales del sistema, incluyendo usuarios, roles, clientes, doctores, sedes, especialidades, horarios, compras, consultas, citas, reprogramaciones y notificaciones.

No se utiliza actualmente un ORM como SQLAlchemy. El acceso a los datos se realizará mediante el SDK de Supabase desde los repositories.

Antes de modificar la estructura de la base de datos, coordinar los cambios necesarios para mantener compatibilidad con los flujos definidos en el sistema.

## Ejecutar proyecto

Activar el entorno virtual:

`.venv\Scripts\Activate.ps1`

Ejecutar:

`python run.py`

El backend se ejecutará por defecto en el puerto `5000`.

## Importante

Mantener la arquitectura definida y evitar:

- lógica de negocio directamente en `routes`
- credenciales dentro del código
- datos falsos como solución definitiva
- consultas a Supabase desde las vistas/rutas
- subir `.env`