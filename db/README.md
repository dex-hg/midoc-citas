# Base de datos de MiDoc

La base de datos será PostgreSQL administrado por Supabase. El backend Flask
dispone del SDK oficial de Python y de un modo de configuración que prepara
el cliente. Esta etapa no crea un proyecto remoto, tablas, usuarios,
políticas ni datos del negocio.

Para preparar el acceso se necesita la URL del proyecto y una clave
publicable de Supabase. Sus valores se configuran en el entorno del servidor
o en el archivo privado `server/.env`, siguiendo `server/README.md`.
El modo `local` permite desarrollar sin conexión al servicio.

Cuando se defina el modelo, el esquema y las políticas RLS se versionarán
mediante migraciones de Supabase. La CLI y sus migraciones todavía no se
han inicializado. El acceso a las filas depende de los permisos y de las
políticas RLS; ambos se definirán junto con cada tabla.

La comprobación `GET /api/estado` solo informa del proceso Flask; no valida
el acceso remoto. La integración real se comprobará cuando estén disponibles
el proyecto, las credenciales y el esquema.

Esta carpeta conservará las instrucciones de administración y las futuras
migraciones. Las copias de seguridad con datos reales y las claves no se
incorporan al repositorio.

[Documentación de Supabase](https://supabase.com/docs).
