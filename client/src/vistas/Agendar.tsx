import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EncabezadoPagina, Icono } from '@/componentes/Elementos'
import {
  citasEjemplo,
  consultasDisponibles,
  consultasEjemplo,
  especialidadesEjemplo,
  fechaRelativa,
  formatearFecha,
  horariosEjemplo,
  sedesEjemplo,
} from '@/datos/demostracion'

export function Agendar() {
  const [parametros] = useSearchParams()
  const citaAnterior = citasEjemplo.find(
    (cita) => cita.id === parametros.get('cita') && cita.estado === 'programada',
  )
  const consultasElegibles = citaAnterior
    ? consultasEjemplo.filter((consulta) => consulta.id === citaAnterior.idConsulta)
    : consultasDisponibles
  const consultaInicial =
    consultasElegibles.find((consulta) => consulta.id === parametros.get('consulta')) ??
    consultasElegibles[0]
  const [idConsulta, establecerConsulta] = useState(consultaInicial?.id ?? '')
  const [especialidad, establecerEspecialidad] = useState(citaAnterior?.especialidad ?? '')
  const [sede, establecerSede] = useState(citaAnterior?.sede ?? '')
  const [fecha, establecerFecha] = useState('')
  const [hora, establecerHora] = useState('')
  const [paso, establecerPaso] = useState(1)
  const [seleccionConfirmada, establecerSeleccionConfirmada] = useState(false)
  const consulta = consultasElegibles.find((elemento) => elemento.id === idConsulta)
  const fechasDisponibles = [2, 3, 4, 5, 6]
    .map(fechaRelativa)
    .filter((fechaDisponible) => consulta && fechaDisponible <= consulta.fechaVencimiento)
  const datosValidos = Boolean(
    consulta &&
      especialidadesEjemplo.includes(especialidad) &&
      sedesEjemplo.includes(sede) &&
      fechasDisponibles.includes(fecha) &&
      horariosEjemplo.includes(hora),
  )

  if (seleccionConfirmada)
    return (
      <section className="panel confirmacion-ejemplo" role="status">
        <span className="simbolo-confirmacion">
          <Icono nombre="confirmar" tamano={30} />
        </span>
        <p className="antetitulo">Recorrido de ejemplo completado</p>
        <h1>Ya elegiste un horario.</h1>
        <p>
          {especialidad} · Sede {sede}
          <br />
          {formatearFecha(fecha)} a las {hora} h
        </p>
        <div className="aviso-formulario">
          Esta selección es una demostración. No se ha reservado ni modificado ninguna cita real.
        </div>
        <div className="acciones-formulario">
          <Link to="/paciente/citas" className="boton boton-primario">
            Ver mis citas de ejemplo
          </Link>
          <button
            className="boton boton-secundario"
            onClick={() => {
              establecerSeleccionConfirmada(false)
              establecerPaso(1)
              establecerHora('')
            }}
          >
            Elegir otro horario
          </button>
        </div>
      </section>
    )

  return (
    <>
      <EncabezadoPagina
        titulo={citaAnterior ? 'Reprogramar una cita' : 'Agendar una cita'}
        descripcion="Elige una consulta, revisa los horarios y comprueba tu selección."
      />
      {citaAnterior && (
        <div className="aviso-reprogramacion">
          <Icono nombre="citas" />
          <p>
            Horario anterior:{' '}
            <strong>
              {formatearFecha(citaAnterior.fecha)} · {citaAnterior.hora} h
            </strong>
            . La cita de ejemplo se conserva durante este recorrido.
          </p>
        </div>
      )}
      <ol className="pasos-agenda" aria-label="Pasos del agendamiento">
        <li
          className={paso === 1 ? 'paso-activo' : 'paso-completo'}
          aria-current={paso === 1 ? 'step' : undefined}
        >
          <span>1</span>Elige tu atención
        </li>
        <li
          className={paso === 2 ? 'paso-activo' : ''}
          aria-current={paso === 2 ? 'step' : undefined}
        >
          <span>2</span>Revisa la selección
        </li>
      </ol>
      <div className="columnas-agenda">
        <section className="panel formulario-agenda">
          {paso === 1 ? (
            <>
              <h2>¿Qué atención deseas agendar?</h2>
              <p className="texto-suave">Los horarios que se muestran son solo de ejemplo.</p>
              <label htmlFor="consulta-agenda">Consulta que utilizarás</label>
              <select
                id="consulta-agenda"
                className="campo"
                value={idConsulta}
                onChange={(evento) => {
                  establecerConsulta(evento.target.value)
                  establecerFecha('')
                  establecerHora('')
                }}
              >
                {consultasElegibles.map((elemento) => (
                  <option key={elemento.id} value={elemento.id}>
                    {elemento.id} · Vence el {formatearFecha(elemento.fechaVencimiento)}
                  </option>
                ))}
              </select>
              <div className="dos-campos">
                <div>
                  <label htmlFor="especialidad-agenda">Especialidad</label>
                  <select
                    id="especialidad-agenda"
                    className="campo"
                    value={especialidad}
                    onChange={(evento) => {
                      establecerEspecialidad(evento.target.value)
                      establecerFecha('')
                      establecerHora('')
                    }}
                  >
                    <option value="">Selecciona una especialidad</option>
                    {especialidadesEjemplo.map((elemento) => (
                      <option key={elemento}>{elemento}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sede-agenda">Sede</label>
                  <select
                    id="sede-agenda"
                    className="campo"
                    value={sede}
                    onChange={(evento) => {
                      establecerSede(evento.target.value)
                      establecerFecha('')
                      establecerHora('')
                    }}
                  >
                    <option value="">Selecciona una sede</option>
                    {sedesEjemplo.map((elemento) => (
                      <option key={elemento}>{elemento}</option>
                    ))}
                  </select>
                </div>
              </div>
              <fieldset className="opciones-agenda" disabled={!especialidad || !sede || !consulta}>
                <legend>Fecha de atención</legend>
                <div className="opciones-fechas">
                  {fechasDisponibles.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      className={`opcion-fecha${fecha === opcion ? ' seleccionada' : ''}`}
                      aria-pressed={fecha === opcion}
                      onClick={() => {
                        establecerFecha(opcion)
                        establecerHora('')
                      }}
                    >
                      <small>{formatearFecha(opcion, { weekday: 'short' })}</small>
                      <strong>{formatearFecha(opcion, { day: '2-digit' })}</strong>
                      <span>{formatearFecha(opcion, { month: 'short' })}</span>
                    </button>
                  ))}
                </div>
                {(!especialidad || !sede) && (
                  <p className="ayuda-campo">
                    Elige la especialidad y la sede para seleccionar una fecha.
                  </p>
                )}
                {!fechasDisponibles.length && (
                  <p className="ayuda-campo">
                    No hay fechas de ejemplo dentro de la vigencia de esta consulta.
                  </p>
                )}
              </fieldset>
              <fieldset className="opciones-agenda" disabled={!fecha}>
                <legend>Horarios de ejemplo</legend>
                <div className="opciones-horarios">
                  {horariosEjemplo.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      className={`opcion-hora${hora === opcion ? ' seleccionada' : ''}`}
                      aria-pressed={hora === opcion}
                      onClick={() => establecerHora(opcion)}
                    >
                      {opcion} h
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="pie-formulario">
                <span>La disponibilidad real está pendiente de conexión.</span>
                <button
                  className="boton boton-primario"
                  disabled={!datosValidos}
                  onClick={() => establecerPaso(2)}
                >
                  Continuar <Icono nombre="flecha" tamano={17} />
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Revisa antes de continuar</h2>
              <p className="texto-suave">Comprueba los datos que seleccionaste.</p>
              <dl className="lista-detalle revision-agenda">
                <div>
                  <dt>Consulta</dt>
                  <dd>{idConsulta}</dd>
                </div>
                <div>
                  <dt>Especialidad</dt>
                  <dd>{especialidad}</dd>
                </div>
                <div>
                  <dt>Sede</dt>
                  <dd>MiDoc {sede}</dd>
                </div>
                <div>
                  <dt>Fecha</dt>
                  <dd>
                    {formatearFecha(fecha, { weekday: 'long', day: 'numeric', month: 'long' })}
                  </dd>
                </div>
                <div>
                  <dt>Hora</dt>
                  <dd>{hora} h</dd>
                </div>
              </dl>
              <p className="aviso-formulario">
                El siguiente botón completa el recorrido de ejemplo. No crea una reserva ni envía
                una solicitud a la clínica.
              </p>
              <div className="acciones-formulario">
                <button className="boton boton-secundario" onClick={() => establecerPaso(1)}>
                  Volver
                </button>
                <button
                  className="boton boton-primario"
                  disabled={!datosValidos}
                  onClick={() => establecerSeleccionConfirmada(true)}
                >
                  Confirmar selección de ejemplo
                </button>
              </div>
            </>
          )}
        </section>
        <aside className="panel resumen-agenda">
          <h2>Tu selección</h2>
          <span className="etiqueta-demo">Demostración</span>
          <dl>
            <div>
              <dt>Consulta</dt>
              <dd>{idConsulta || 'Sin seleccionar'}</dd>
            </div>
            <div>
              <dt>Especialidad</dt>
              <dd>{especialidad || 'Por elegir'}</dd>
            </div>
            <div>
              <dt>Sede</dt>
              <dd>{sede || 'Por elegir'}</dd>
            </div>
            <div>
              <dt>Fecha y hora</dt>
              <dd>
                {fecha ? `${formatearFecha(fecha)}${hora ? ` · ${hora} h` : ''}` : 'Por elegir'}
              </dd>
            </div>
          </dl>
          {consulta && (
            <p>
              <Icono nombre="reloj" tamano={16} />
              Tu consulta vence el {formatearFecha(consulta.fechaVencimiento)}.
            </p>
          )}
          <Link to="/paciente/ayuda" className="enlace-texto">
            Necesito orientación <Icono nombre="chevron" tamano={16} />
          </Link>
        </aside>
      </div>
    </>
  )
}
