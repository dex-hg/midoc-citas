# Base de datos de MiDoc

PostgreSQL será la base de datos del sistema. En esta etapa solo se han
preparado el controlador, JPA, Flyway y el perfil de conexión del servidor.
No se ha creado el modelo de datos ni se han ejecutado operaciones en una
base existente.

La base de desarrollo y su usuario se prepararán antes de activar el perfil
`postgres`, según `server/README.md`. Las credenciales se mantienen en el
entorno o en el archivo privado `server/.env`.

Las migraciones versionadas del esquema tendrán una única ubicación:
`server/src/main/resources/db/migration`. Su nomenclatura será
`V1__descripcion_del_cambio.sql`, `V2__descripcion_del_cambio.sql`, etc.
No se duplicarán aquí ni se mezclarán con `schema.sql` o `data.sql`.

Esta carpeta podrá contener instrucciones de administración y restauración
cuando sean necesarias. Las copias de seguridad con datos reales no deben
incorporarse al repositorio.
