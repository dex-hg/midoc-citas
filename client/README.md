# Cliente de MiDoc

Base de React con TypeScript y Vite. Incluye Bootstrap, React Router,
TanStack Query y comprobaciones de tipos y lint. La pantalla inicial y la
página de ruta desconocida son los únicos contenidos de esta etapa.

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
npm run preview
```

La vista previa local se abre en [http://127.0.0.1:4173](http://127.0.0.1:4173).
Su proxy también necesita el backend activo. Esta vista previa no sustituye un servidor de
producción; al desplegar se deberá configurar el destino de `/api`.
