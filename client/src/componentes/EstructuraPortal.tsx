import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icono, Marca } from '@/componentes/Elementos'
import { pacienteEjemplo } from '@/datos/demostracion'

const opciones = [
  { ruta: '/paciente/inicio', nombre: 'Inicio', icono: 'inicio' },
  { ruta: '/paciente/consultas', nombre: 'Mis consultas', icono: 'consultas' },
  { ruta: '/paciente/citas', nombre: 'Mis citas', icono: 'citas' },
  { ruta: '/paciente/agendar', nombre: 'Agendar una cita', icono: 'agendar' },
] as const

export function EstructuraPortal() {
  const { pathname: rutaActual } = useLocation()
  const [menuAbierto, establecerMenuAbierto] = useState(false)
  const contenidoPrincipal = useRef<HTMLElement>(null)
  const etiquetaPagina = opciones.find((opcion) => opcion.ruta === rutaActual)?.nombre ?? 'Ayuda'

  useEffect(() => {
    document.title = `${etiquetaPagina} · MiDoc`
    contenidoPrincipal.current?.focus()
  }, [rutaActual, etiquetaPagina])

  useEffect(() => {
    if (!menuAbierto) return
    const desplazamientoAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function cerrarConTeclado(evento: KeyboardEvent) {
      if (evento.key === 'Escape') establecerMenuAbierto(false)
    }
    document.addEventListener('keydown', cerrarConTeclado)
    return () => {
      document.body.style.overflow = desplazamientoAnterior
      document.removeEventListener('keydown', cerrarConTeclado)
    }
  }, [menuAbierto])

  function cerrarMenu() {
    establecerMenuAbierto(false)
  }

  return (
    <div className="estructura-portal">
      <a className="enlace-salto" href="#contenido-principal">
        Ir al contenido
      </a>
      <aside className={`barra-lateral${menuAbierto ? ' barra-lateral--abierta' : ''}`}>
        <Link to="/" className="marca-enlace" aria-label="MiDoc, volver al portal">
          <Marca />
        </Link>
        <p className="nombre-portal">Portal del paciente</p>
        <div className="divisor-lateral" />
        <p className="etiqueta-navegacion">Mi atención</p>
        <nav aria-label="Navegación del paciente">
          {opciones.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              onClick={cerrarMenu}
              className={({ isActive: estaActiva }) =>
                `enlace-lateral${estaActiva ? ' activo' : ''}`
              }
            >
              <Icono nombre={opcion.icono} />
              <span>{opcion.nombre}</span>
            </NavLink>
          ))}
        </nav>
        <div className="pie-lateral">
          <NavLink
            to="/paciente/ayuda"
            onClick={cerrarMenu}
            className={({ isActive: estaActiva }) => `enlace-lateral${estaActiva ? ' activo' : ''}`}
          >
            <Icono nombre="ayuda" />
            <span>Ayuda y orientación</span>
          </NavLink>
          <Link to="/" onClick={cerrarMenu} className="enlace-lateral">
            <Icono nombre="salir" />
            <span>Salir de la demostración</span>
          </Link>
          <small>MiDoc · Portal de consultas</small>
        </div>
      </aside>
      {menuAbierto && (
        <button className="fondo-menu" onClick={cerrarMenu} aria-label="Cerrar menú" />
      )}
      <div className="zona-portal">
        <header className="cabecera-portal">
          <button
            className="boton-icono alternar-menu"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            onClick={() => establecerMenuAbierto(!menuAbierto)}
          >
            <Icono nombre={menuAbierto ? 'cerrar' : 'menu'} />
          </button>
          <div className="ruta-actual">
            <span>Portal del paciente</span>
            <Icono nombre="chevron" tamano={14} />
            <strong>{etiquetaPagina}</strong>
          </div>
          <div className="usuario-cabecera">
            <span className="etiqueta-demo">Demostración</span>
            <span className="avatar" aria-hidden="true">
              {pacienteEjemplo.iniciales}
            </span>
            <span className="nombre-usuario">
              {pacienteEjemplo.nombres} {pacienteEjemplo.apellidos}
              <small>Paciente de ejemplo</small>
            </span>
          </div>
        </header>
        <main
          id="contenido-principal"
          ref={contenidoPrincipal}
          tabIndex={-1}
          className="contenido-portal"
        >
          <div className="aviso-demostracion">
            <span className="punto-demo" />
            Datos de ejemplo. Las acciones de esta vista no generan citas reales.
          </div>
          <Outlet />
          <footer className="pie-portal">
            ¿Alguna duda? <Link to="/paciente/ayuda">Revisa la ayuda del portal</Link>
          </footer>
        </main>
      </div>
    </div>
  )
}
