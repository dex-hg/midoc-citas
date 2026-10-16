# midoc-citas

Sistema web de MiDoc para la gestión administrativa de consultas y citas
médicas, desarrollado para Análisis y Diseño de Sistemas de Información.

Esta etapa prepara el entorno de desarrollo. El cliente muestra una pantalla
inicial y una página para rutas desconocidas. El servidor expone únicamente
la comprobación de estado; las demás rutas permanecen bloqueadas.

## Organización

| Carpeta | Contenido |
| --- | --- |
| `client` | React, TypeScript, Vite, Bootstrap, React Router y TanStack Query. |
| `server` | Java 21, Spring Boot 4.1.1, Spring Security, validación, JPA, PostgreSQL y Flyway. |
| `db` | Indicaciones de trabajo con la base de datos; todavía no hay tablas del negocio. |

El código se mantiene en `C:\Proyectos\midoc-citas`. Los informes, diagramas,
videos y entregables del curso corresponden a la carpeta académica
`Análisis y Diseño de Sistemas de Información\Avance de Proyecto Final 2`.

## Requisitos

- JDK 21 y `JAVA_HOME` apuntando a su instalación.
- Node.js 24 LTS recomendado; también se admite Node.js 22.12 o posterior de la rama 22.
- npm 10 o posterior.
- PostgreSQL cuando se active el perfil `postgres`.

El Maven Wrapper está incluido en `server`; descarga la distribución
configurada durante su primera ejecución. No se necesita instalar Maven
globalmente. La primera instalación requiere acceso a Maven Central y npm.

## Arranque local

En una terminal de PowerShell:

```powershell
Set-Location C:\Proyectos\midoc-citas\server
.\mvnw.cmd spring-boot:run
```

El perfil predeterminado `local` arranca sin conectarse a PostgreSQL. La
comprobación de estado está en
[http://127.0.0.1:8080/api/estado](http://127.0.0.1:8080/api/estado).
Un resultado `UP` en este perfil confirma el proceso web, sin acreditar
una conexión a base de datos.

En otra terminal:

```powershell
Set-Location C:\Proyectos\midoc-citas\client
npm ci
npm run dev
```

Abrir [http://127.0.0.1:5173](http://127.0.0.1:5173). Las solicitudes a
`/api` pasan al backend mediante el proxy de Vite. Los puertos son fijos:
si están ocupados, el proceso informa el conflicto.

## Conexión a PostgreSQL

El perfil `postgres` requiere una base y un usuario ya preparados. Para
configurarlo, consultar `server/README.md`. No se han creado credenciales,
usuarios, tablas, registros ni migraciones del negocio.

Los archivos `.env` están excluidos de Git. Sus ejemplos sin secretos sí
se versionan. El `.env` del servidor se interpreta como `.properties`;
no es un script de PowerShell ni un archivo para ejecutar.

## Comprobaciones

Desde `server`:

```powershell
.\mvnw.cmd verify
```

Desde `client`:

```powershell
npm run lint
npm run typecheck
npm run build
```

Las pruebas del servidor levantan HTTP en un puerto aleatorio y comprueban
el estado público, el bloqueo de rutas y el rechazo de escrituras sin CSRF.
No requieren PostgreSQL. La conexión del perfil `postgres` deberá verificarse
cuando se disponga de la base y sus credenciales.

## Referencias técnicas

- [Configuración externa de Spring Boot](https://docs.spring.io/spring-boot/reference/features/external-config.html).
- [Inicialización con Flyway](https://docs.spring.io/spring-boot/how-to/data-initialization.html).
- [Guía de Vite](https://vite.dev/guide/).

La autenticación, los permisos por rol y los módulos de pacientes, consultas,
pagos, disponibilidad y citas se implementarán en las siguientes etapas.
