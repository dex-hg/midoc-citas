import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  EncabezadoPagina,
  EstadoVacio,
  Icono,
  Insignia,
  VentanaModal,
} from '@/componentes/Elementos'
import { citasEjemplo, formatearFecha } from '@/datos/demostracion'

export function Citas() {
  const [filtro, establecerFiltro] = useState('programada')
  const [parametros, establecerParametros] = useSearchParams()
  const citaSeleccionada = citasEjemplo.find((cita) => cita.id === parametros.get('detalle'))
  const citasVisibles = citasEjemplo.filter((cita) => cita.estado === filtro)

  return (
    <>
      <EncabezadoPagina
        titulo="Mis citas"
        descripcion="Encuentra los detalles de tus próximas visitas y tus atenciones anteriores."
      >
        <Link to="/paciente/agendar" className="boton boton-primario">
          <Icono nombre="agendar" tamano={18} />
          Agendar una cita
        </Link>
      </EncabezadoPagina>
      <div className="filtros filtros-citas" aria-label="Filtrar citas">
        {[
          { valor: 'programada', nombre: 'Próximas' },
          { valor: 'atendida', nombre: 'Atendidas' },
          { valor: 'cancelada', nombre: 'Canceladas' },
        ].map((opcion) => (
          <button
            key={opcion.valor}
            className={`filtro${opcion.valor === filtro ? ' seleccionado' : ''}`}
            onClick={() => establecerFiltro(opcion.valor)}
            aria-pressed={opcion.valor === filtro}
          >
            {opcion.nombre}
            <span className="contador-filtro">
              {citasEjemplo.filter((cita) => cita.estado === opcion.valor).length}
            </span>
          </button>
        ))}
      </div>
      <div className="lista-citas">
        {citasVisibles.map((cita) => (
          <article className="panel tarjeta-cita" key={cita.id}>
            <div className="fecha-destacada">
              <span>{formatearFecha(cita.fecha, { month: 'short' })}</span>
              <strong>{formatearFecha(cita.fecha, { day: '2-digit' })}</strong>
              <small>{formatearFecha(cita.fecha, { weekday: 'short' })}</small>
            </div>
            <div className="cuerpo-tarjeta-cita">
              <div className="titulo-tarjeta-cita">
                <h2>{cita.especialidad}</h2>
                <Insignia estado={cita.estado} />
              </div>
              <p>{cita.profesional}</p>
              <div className="metadatos">
                <span>
                  <Icono nombre="reloj" tamano={16} />
                  {cita.hora} h · {cita.duracion} min
                </span>
                <span>
                  <Icono nombre="ubicacion" tamano={16} />
                  Sede {cita.sede}
                </span>
              </div>
              <span className="detalle-celda">
                {cita.id} · Consulta {cita.idConsulta}
              </span>
            </div>
            <div className="acciones-cita">
              <button
                className="boton boton-secundario boton-pequeno"
                onClick={() => establecerParametros({ detalle: cita.id })}
              >
                Ver detalle
              </button>
              {cita.estado === 'programada' && (
                <Link className="enlace-texto" to={`/paciente/agendar?cita=${cita.id}`}>
                  Reprogramar
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
      {!citasVisibles.length && (
        <section className="panel">
          <EstadoVacio
            titulo="No hay citas en esta sección"
            descripcion="Tus citas aparecerán aquí de acuerdo con su estado."
          />
        </section>
      )}
      {citaSeleccionada && (
        <VentanaModal titulo="Detalle de tu cita" cerrar={() => establecerParametros({})}>
          <Insignia estado={citaSeleccionada.estado} />
          <h3 className="titulo-detalle">{citaSeleccionada.especialidad}</h3>
          <p>{citaSeleccionada.profesional}</p>
          <dl className="lista-detalle">
            <div>
              <dt>Fecha</dt>
              <dd>
                {formatearFecha(citaSeleccionada.fecha, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
            <div>
              <dt>Horario</dt>
              <dd>
                {citaSeleccionada.hora} h · {citaSeleccionada.duracion} minutos
              </dd>
            </div>
            <div>
              <dt>Sede</dt>
              <dd>MiDoc {citaSeleccionada.sede}</dd>
            </div>
            <div>
              <dt>Consulta asociada</dt>
              <dd>{citaSeleccionada.idConsulta}</dd>
            </div>
            <div>
              <dt>Código de cita</dt>
              <dd>{citaSeleccionada.id}</dd>
            </div>
            <div>
              <dt>Reprogramaciones</dt>
              <dd>{citaSeleccionada.reprogramaciones}</dd>
            </div>
          </dl>
          <p className="nota-formulario">Los nombres y datos de esta atención son ficticios.</p>
          {citaSeleccionada.estado === 'programada' && (
            <Link
              to={`/paciente/agendar?cita=${citaSeleccionada.id}`}
              className="boton boton-primario ancho-completo"
            >
              Elegir otro horario <Icono nombre="flecha" tamano={17} />
            </Link>
          )}
        </VentanaModal>
      )}
    </>
  )
}
