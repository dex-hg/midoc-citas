# Servidor de MiDoc

Base de Spring Boot 4.1.1 con Java 21. Incluye Spring MVC, Spring Security,
Bean Validation, Spring Data JPA, el controlador PostgreSQL, Flyway con su
módulo PostgreSQL y Actuator. Las versiones de estas dependencias las
administra Spring Boot.

## Arranque sin base de datos

Con `JAVA_HOME` apuntando a JDK 21, ejecutar desde esta carpeta:

```powershell
.\mvnw.cmd spring-boot:run
```

El perfil predeterminado `local` desactiva la autoconfiguración del origen
de datos y Flyway. No sustituye PostgreSQL por una base en memoria. El
servidor escucha en `127.0.0.1:8080`; pueden cambiarse la dirección y el
puerto con `MIDOC_DIRECCION` y `MIDOC_PUERTO`.

`GET /api/estado` está disponible sin autenticación y oculta los detalles
de infraestructura. Las demás rutas están bloqueadas. CSRF permanece
habilitado, y no se generan cuentas ni contraseñas provisionales.

## Perfil PostgreSQL

Preparar una base de datos y un usuario de desarrollo. Después:

```powershell
Copy-Item .env.example .env
```

Completar `MIDOC_DB_URL`, `MIDOC_DB_USUARIO` y `MIDOC_DB_CLAVE` en `.env`.
La URL y el usuario del ejemplo son valores de referencia; este proyecto
no los crea. El archivo se carga desde el directorio de trabajo y se
interpreta como Java `.properties`: sin comillas ni prefijo `export`.
Para caracteres especiales, aplicar el escape de ese formato; por ejemplo,
una barra inversa literal se escribe como `\\`.

También pueden definirse esas variables directamente en el entorno del
proceso. No compartir ni versionar credenciales.

Activar únicamente el perfil `postgres`:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=postgres"
```

Al activar este perfil, `local` deja de aplicarse. No combinar ambos perfiles:
`local` deshabilita el origen de datos. El perfil PostgreSQL exige las
credenciales y falla si no puede conectarse.

Hibernate valida la estructura con `ddl-auto=validate`; no crea ni actualiza
tablas. Flyway será la única herramienta de migraciones y mantiene `clean`
deshabilitado. La carpeta de migraciones está preparada en
`src/main/resources/db/migration`, todavía sin scripts SQL.

Al conectar por primera vez a una base vacía, Flyway puede crear su tabla
técnica de historial. No hay entidades ni tablas del negocio en esta etapa.

## Cliente y seguridad

El cliente de desarrollo accede al servidor por el proxy de Vite en `/api`.
No se configura CORS permisivo ni se desactiva CSRF. La autenticación y los
permisos del negocio se incorporarán después.

Esta configuración está destinada al desarrollo local. Para un despliegue
se deberá preparar HTTPS, cookies seguras, secretos y el proxy de producción.

## Verificación

```powershell
.\mvnw.cmd verify
```

Las pruebas HTTP usan el perfil `local` en un puerto aleatorio. Comprueban
el estado público y los rechazos de acceso y de escrituras sin CSRF, sin
crear datos ni requerir una base de datos.
