import { Link } from 'react-router-dom'
import { EncabezadoPagina, Icono, Insignia } from '@/componentes/Elementos'
import {
  citasEjemplo,
  consultasDisponibles,
  consultasEjemplo,
  fechaRelativa,
  formatearFecha,
  pacienteEjemplo,
} from '@/datos/demostracion'

export function PanelPaciente() {
  const proximaCita = citasEjemplo.find((cita) => cita.estado === 'programada')
  const pagosPendientes = consultasEjemplo.filter(
    (consulta) => consulta.pago === 'pendiente',
  ).length

  return (
    <>
      <EncabezadoPagina
        titulo={`Hola, ${pacienteEjemplo.nombres}`}
        descripcion="Revisa tus consultas y organiza tu próxima visita."
      >
        <span className="fecha-hoy">
          {formatearFecha(fechaRelativa(0), { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </EncabezadoPagina>
      <section className="resumen-cifras" aria-label="Resumen de tus atenciones">
        <Link to="/paciente/consultas?estado=disponible" className="cifra">
          <div>
            <span>Por agendar</span>
            <strong>
              {consultasDisponibles.length}
              <small>consultas disponibles</small>
            </strong>
          </div>
          <span className="fondo-icono">
            <Icono nombre="consultas" tamano={23} />
          </span>
        </Link>
        <Link to="/paciente/citas" className="cifra">
          <div>
            <span>Próximas citas</span>
            <strong>
              {citasEjemplo.filter((cita) => cita.estado === 'programada').length}
              <small>atención programada</small>
            </strong>
          </div>
          <span className="fondo-icono">
            <Icono nombre="citas" tamano={23} />
          </span>
        </Link>
        <Link to="/paciente/consultas?estado=pendiente" className="cifra">
          <div>
            <span>Pago pendiente</span>
            <strong>
              {pagosPendientes}
              <small>consulta por validar</small>
            </strong>
          </div>
          <span className="fondo-icono fondo-icono--arena">
            <Icono nombre="pago" tamano={23} />
          </span>
        </Link>
      </section>
      <div className="columnas-panel">
        <div className="columna-principal">
          <section className="panel panel-proxima">
            <div className="titulo-seccion">
              <h2>Tu próxima cita</h2>
              <Link to="/paciente/citas" className="enlace-texto">
                Ver todas <Icono nombre="chevron" tamano={16} />
              </Link>
            </div>
            {proximaCita && (
              <>
                <div className="cita-destacada">
                  <div className="fecha-destacada">
                    <span>{formatearFecha(proximaCita.fecha, { month: 'short' })}</span>
                    <strong>{formatearFecha(proximaCita.fecha, { day: '2-digit' })}</strong>
                    <small>{formatearFecha(proximaCita.fecha, { weekday: 'short' })}</small>
                  </div>
                  <div className="informacion-cita">
                    <Insignia estado="programada" />
                    <h3>{proximaCita.especialidad}</h3>
                    <p>{proximaCita.profesional}</p>
                    <div className="metadatos">
                      <span>
                        <Icono nombre="reloj" tamano={16} />
                        {proximaCita.hora} h · {proximaCita.duracion} min
                      </span>
                      <span>
                        <Icono nombre="ubicacion" tamano={16} />
                        Sede {proximaCita.sede}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pie-proxima">
                  <span>
                    Consulta asociada <strong>{proximaCita.idConsulta}</strong>
                  </span>
                  <Link
                    to={`/paciente/citas?detalle=${proximaCita.id}`}
                    className="boton boton-secundario boton-pequeno"
                  >
                    Ver detalle <Icono nombre="chevron" tamano={16} />
                  </Link>
                </div>
              </>
            )}
          </section>
          <section className="panel">
            <div className="titulo-seccion">
              <div>
                <h2>Consultas por agendar</h2>
                <p>Elige cuándo utilizar tus consultas disponibles.</p>
              </div>
              <Link to="/paciente/consultas" className="enlace-texto">
                Ver todas <Icono nombre="chevron" tamano={16} />
              </Link>
            </div>
            <div className="lista-disponibles">
              {consultasDisponibles.map((consulta) => (
                <div key={consulta.id} className="fila-disponible">
                  <span className="icono-consulta">
                    <Icono nombre="consultas" />
                  </span>
                  <div>
                    <h3>Consulta médica</h3>
                    <p>
                      {consulta.id} <span className="separacion-texto">·</span> Vence el{' '}
                      {formatearFecha(consulta.fechaVencimiento, { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  <Link to={`/paciente/agendar?consulta=${consulta.id}`} className="enlace-texto">
                    Agendar <Icono nombre="flecha" tamano={17} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="columna-orientacion">
          <section className="panel panel-accion">
            <span className="fondo-icono">
              <Icono nombre="agendar" tamano={25} />
            </span>
            <h2>Encuentra tu horario</h2>
            <p>Revisa las opciones por especialidad y sede.</p>
            <Link to="/paciente/agendar" className="boton boton-primario ancho-completo">
              Agendar una cita <Icono nombre="flecha" tamano={17} />
            </Link>
          </section>
          <section className="panel panel-recordatorio">
            <h2>Antes de tu visita</h2>
            <ul>
              <li>
                <Icono nombre="confirmar" tamano={17} />
                <span>Revisa la sede y el horario de tu cita.</span>
              </li>
              <li>
                <Icono nombre="confirmar" tamano={17} />
                <span>Ten a mano tu documento de identidad.</span>
              </li>
              <li>
                <Icono nombre="confirmar" tamano={17} />
                <span>Consulta el estado de tu pago.</span>
              </li>
            </ul>
            <Link to="/paciente/ayuda" className="enlace-texto">
              Tengo una duda <Icono nombre="chevron" tamano={16} />
            </Link>
          </section>
          <p className="nota-sedes">
            <Icono nombre="ubicacion" tamano={17} />
            Sedes de referencia: Pro e Izaguirre.
          </p>
        </aside>
      </div>
    </>
  )
}
