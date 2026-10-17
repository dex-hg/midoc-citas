# Cliente de MiDoc

Base de React con TypeScript y Vite. Incluye Bootstrap, React Router,
TanStack Query, iconos Lucide y comprobaciones de tipos, lint y formato.
Incluye las primeras vistas navegables del portal del paciente.

## Vistas disponibles

| Ruta                    | Vista                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| `/`                   | Inicio breve del portal y preguntas frecuentes.                          |
| `/ingresar`           | Propuesta de acceso con validación de campos y enlace de demostración. |
| `/paciente/inicio`    | Resumen de consultas, próxima cita y accesos a la agenda.               |
| `/paciente/consultas` | Consultas adquiridas con búsqueda y filtros por estado.                 |
| `/paciente/citas`     | Citas próximas, atendidas y canceladas; detalle en una ventana.         |
| `/paciente/agendar`   | Selección de consulta, especialidad, sede, fecha y horario de ejemplo.  |
| `/paciente/ayuda`     | Orientación y preguntas frecuentes.                                     |

Todas las vistas utilizan datos ficticios definidos en
`src/datos/demostracion.ts`. Las fechas se calculan con referencia al día
actual en Lima. Los nombres, importes y horarios son ejemplos, no información
comprobada de la clínica. La imagen del esquema compartida por el grupo orienta
la separación entre compra, consulta y cita; estos modelos de presentación
todavía no constituyen un contrato de API ni una copia del esquema remoto.

El formulario de acceso no autentica, no transmite ni conserva credenciales.
El recorrido se abre mediante **Explorar demostración**. La selección y la
reprogramación de ejemplo no crean ni modifican citas, y no se guardan al
recargar. Las consultas vencidas, utilizadas o con pago pendiente no se
ofrecen como nuevas reservas en esta demostración. Estas condiciones y las
excepciones de reprogramación deberán ratificarse con el equipo antes de
implementar las operaciones reales.

## Desarrollo local

Se requiere Node.js 24 LTS con npm. Ejecutar desde esta carpeta:

```powershell
npm ci
npm run dev
```

El cliente se sirve en [http://127.0.0.1:5173](http://127.0.0.1:5173).
Las solicitudes a `/api` pasan por el proxy de Vite hacia el backend Flask
en [http://127.0.0.1:8080](http://127.0.0.1:8080). El servidor debe estar
en ejecución para que esas solicitudes funcionen. Su instalación y arranque
se describen en `server/README.md`.

Las vistas de demostración se pueden recorrer con el cliente únicamente:
no efectúan solicitudes a Flask ni a Supabase.

El acceso previsto a Supabase pasa por Flask. El cliente mantiene React
con TypeScript y todavía no incorpora un SDK, autenticación ni claves de
Supabase. El proxy permite trabajar en el mismo origen, sin configurar CORS.

Para cambiar el destino, copiar `.env.example` a `.env` y ajustar
`MIDOC_SERVIDOR_URL`. Esta variable se usa solo en la configuración de Vite.
Las variables con prefijo `VITE_` son públicas y no deben contener secretos.

Los alias `@/` apuntan a `src/`. El proveedor de navegación y el de consultas
se configuran en `src/Proveedores.tsx`.

## Verificación

```powershell
npm run lint
npm run typecheck
npm run build
npm run format:check
npm run preview
```

La vista previa local se abre en [http://127.0.0.1:4173](http://127.0.0.1:4173).
Su proxy también necesita el backend activo. Esta vista previa no sustituye un servidor de
producción; al desplegar se deberá configurar el destino de `/api`.

`npm run format` aplica Prettier a los componentes y estilos. Los componentes
compartidos están en `src/componentes`, las páginas en `src/vistas` y los
estilos se agrupan en `src/estilos`. La estructura se adapta a celular con
navegación lateral desplegable y registros en formato vertical.

La propuesta utiliza un inicio de acceso breve y un panel operativo. La
integración de la autenticación, disponibilidad, pagos y persistencia queda
pendiente de los contratos del backend y del modelo definitivo de Supabase.
