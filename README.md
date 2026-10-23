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
- Módulo de doctor con consulta de agenda y citas, filtros y preparación
  validada de estados. La autenticación y la persistencia siguen pendientes.

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

## Módulo de doctor

La lógica está en `app/services/doctor_service.py` y las rutas en
`app/routes/doctor_routes.py`. Este módulo no importa Supabase ni depende de
un esquema de base de datos. Define el puerto de lectura `RepositorioDoctor`
para que pueda conectarse posteriormente al almacenamiento elegido.

### Rutas y filtros

| Método | Ruta | Operación |
| --- | --- | --- |
| GET | `/api/doctores/health` | Comprobar el módulo sin consultar datos ni requerir sesión. |
| GET | `/api/doctores/agenda?fecha=2026-10-20` | Consultar las citas de un día del doctor autenticado. |
| GET | `/api/doctores/citas?fecha=2026-10-20&estado=AGENDADA` | Consultar sus citas y combinar filtros opcionales. |
| POST | `/api/doctores/citas/<id_cita>/preparar-estado` | Validar la preparación de ATENDIDA o NO_ASISTIO. |

`fecha` acepta exclusivamente fechas existentes con formato `AAAA-MM-DD`.
La agenda utiliza el día actual de Lima (UTC-5) si se omite la fecha. La
consulta de citas sin fecha incluye todos los días disponibles en el
proveedor. Ambas consultas admiten `estado`, se ordenan por fecha y hora y
devuelven `id_doctor`, `filtros`, `total` y `citas`. La agenda incluye además
`fecha`. Una búsqueda válida sin coincidencias devuelve una lista vacía.

Los estados reconocidos son `AGENDADA`, `ATENDIDA`, `CANCELADA` y
`NO_ASISTIO`. Se normalizan las mayúsculas y los espacios de los extremos.
Los filtros vacíos, repetidos o desconocidos se rechazan; `PENDIENTE` no es
un estado de cita. Los identificadores admiten enteros positivos, UUID o
códigos de hasta 64 letras ASCII, números, guiones y guiones bajos.

### Preparación del resultado de atención

El POST recibe un objeto JSON con un único campo:

```json
{"estado": "ATENDIDA"}
```

Para preparar una inasistencia, se envía `{"estado": "NO_ASISTIO"}`.
Se comprueba que la cita exista, pertenezca al doctor autenticado y se
encuentre en `AGENDADA`. Los estados `ATENDIDA`, `NO_ASISTIO` y `CANCELADA`
no pueden modificarse mediante esta operación, ni siquiera para repetir
el resultado existente.

Una preparación válida responde 200 con `id_doctor`, `id_cita`,
`estado_actual`, `estado_solicitado`, `preparado: true`, `persistido: false`
y un mensaje que indica que el registro está pendiente. No actualiza la
cita ni la consulta adquirida, no consume reprogramaciones y no envía
notificaciones. El puerto solo expone lecturas.

La preparación no reserva la cita ni garantiza una actualización futura.
Cuando se implemente la escritura, deberá volver a comprobarse el estado
y la propiedad de la cita y realizarse el cambio de forma atómica. Las
condiciones temporales para registrar atención o inasistencia, como la
espera posterior al horario de la cita, quedan por validar con la clínica.

### Identidad y almacenamiento pendientes de integración

Las rutas de negocio requieren `g.usuario_autenticado`, establecido por
un futuro middleware del servidor después de verificar la sesión. Ese
contexto debe contener `id_doctor`, `rol: "DOCTOR"` y `activo: true`.
No se acepta la identidad del doctor desde cabeceras, parámetros o el
cuerpo enviado por el cliente. Esta validación del contexto no implementa
todavía el inicio de sesión ni la verificación de tokens.

El futuro adaptador debe cumplir `RepositorioDoctor`:

- `listar_citas(id_doctor)`: entregar una secuencia de `CitaDoctor` del doctor.
- `obtener_cita(id_doctor, id_cita)`: entregar su cita o `None` si no existe.

`CitaDoctor` es un contrato interno inmutable, independiente de las tablas.
Contiene `id_cita`, `id_doctor`, `paciente`, `especialidad`, `sede`, `fecha`
como `datetime.date`, `hora` como `datetime.time` local de Lima sin zona,
`duracion_minutos` como entero positivo y `estado`. Las respuestas HTTP
serializan la fecha como `AAAA-MM-DD` y la hora como `HH:MM:SS`.

Para conectar el adaptador, se registrará una instancia
`ServicioDoctor(repositorio_doctor)` en
`aplicacion.extensions["servicio_doctor"]`. El servicio vuelve a comprobar
la propiedad de las citas aunque el adaptador ya filtre por doctor. Ante
fallos del almacenamiento, el adaptador debe lanzar
`RepositorioDoctorNoDisponible`; los errores de conexión derivados de
`OSError`, incluido `TimeoutError`, también se traducen a indisponibilidad.

En la aplicación actual, las rutas de negocio responden 401 porque todavía
no existe autenticación. Con una identidad válida pero sin adaptador,
responden 503. No se utilizan cuentas ni citas de demostración dentro de
la aplicación para sustituir esas dependencias.

| Código HTTP | Significado |
| --- | --- |
| 400 | Fecha, estado, identificador, filtros o cuerpo JSON inválidos. |
| 401 | No existe una identidad autenticada en el contexto del servidor. |
| 403 | La cuenta no es un doctor activo o no tiene doctor asociado. |
| 404 | La cita no existe para ese doctor; tampoco revela citas ajenas. |
| 409 | La cita dejó de estar AGENDADA y no admite la transición. |
| 415 | La preparación no se envió con tipo de contenido JSON. |
| 503 | El almacenamiento no está configurado, falló o entregó datos inválidos. |
| 500 | Error inesperado; la respuesta no expone detalles internos. |

### Pruebas del módulo

Con Flask y Flask-CORS instalados en el entorno virtual, ejecutar desde la
raíz del backend:

```powershell
.\.venv\Scripts\python.exe -B -m unittest discover -s tests -v
```

Las pruebas usan el cliente HTTP de Flask y datos sintéticos exclusivamente
en `tests/`. Comprueban filtros, orden, aislamiento por doctor, control de
acceso, validación de entradas, transiciones y ausencia de escritura.
No acreditan integración con una base de datos ni autenticación real.

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
