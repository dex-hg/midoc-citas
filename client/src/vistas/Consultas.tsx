import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EncabezadoPagina, EstadoVacio, Icono, Insignia } from '@/componentes/Elementos'
import { consultasEjemplo, formatearFecha, formatearImporte } from '@/datos/demostracion'

const filtros = [
  { valor: 'todas', nombre: 'Todas' },
  { valor: 'disponible', nombre: 'Por agendar' },
  { valor: 'programada', nombre: 'Programadas' },
  { valor: 'utilizada', nombre: 'Utilizadas' },
  { valor: 'vencida', nombre: 'Vencidas' },
  { valor: 'pendiente', nombre: 'Pago pendiente' },
]

export function Consultas() {
  const [parametros, establecerParametros] = useSearchParams()
  const [busqueda, establecerBusqueda] = useState('')
  const filtroSolicitado = parametros.get('estado') ?? 'todas'
  const filtroActual = filtros.some((filtro) => filtro.valor === filtroSolicitado)
    ? filtroSolicitado
    : 'todas'
  const consultasVisibles = consultasEjemplo.filter((consulta) => {
    const coincideEstado =
      filtroActual === 'todas' ||
      (filtroActual === 'pendiente'
        ? consulta.pago === 'pendiente'
        : consulta.estado === filtroActual &&
          (filtroActual !== 'disponible' || consulta.pago === 'confirmado'))
    return (
      coincideEstado &&
      `${consulta.id} ${consulta.compra} consulta médica`
        .toLocaleLowerCase('es')
        .includes(busqueda.trim().toLocaleLowerCase('es'))
    )
  })

  return (
    <>
      <EncabezadoPagina
        titulo="Mis consultas"
        descripcion="Revisa tus compras, su estado y la fecha de vencimiento."
      >
        <Link to="/paciente/agendar" className="boton boton-primario">
          <Icono nombre="agendar" tamano={18} />
          Agendar una cita
        </Link>
      </EncabezadoPagina>
      <section className="panel panel-registros" aria-label="Consultas adquiridas">
        <div className="barra-registros">
          <div>
            <h2>Consultas adquiridas</h2>
            <p>{consultasEjemplo.length} consultas en tu historial de ejemplo</p>
          </div>
          <label className="buscador">
            <Icono nombre="buscar" tamano={18} />
            <input
              aria-label="Buscar consulta"
              value={busqueda}
              onChange={(evento) => establecerBusqueda(evento.target.value)}
              placeholder="Buscar código de consulta"
            />
          </label>
        </div>
        <div className="filtros" aria-label="Filtrar consultas">
          {filtros.map((filtro) => (
            <button
              key={filtro.valor}
              type="button"
              className={`filtro${filtroActual === filtro.valor ? ' seleccionado' : ''}`}
              aria-pressed={filtroActual === filtro.valor}
              onClick={() =>
                establecerParametros(filtro.valor === 'todas' ? {} : { estado: filtro.valor })
              }
            >
              {filtro.nombre}
            </button>
          ))}
        </div>
        {consultasVisibles.length ? (
          <table className="tabla-registros">
            <caption className="solo-lectores">Consultas médicas de demostración</caption>
            <thead>
              <tr>
                <th scope="col">Consulta</th>
                <th scope="col">Compra</th>
                <th scope="col">Vencimiento</th>
                <th scope="col">Estado</th>
                <th scope="col">
                  <span className="solo-lectores">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {consultasVisibles.map((consulta) => (
                <tr key={consulta.id}>
                  <td data-etiqueta="Consulta">
                    <strong className="titulo-celda">Consulta médica</strong>
                    <span className="detalle-celda">{consulta.id}</span>
                  </td>
                  <td data-etiqueta="Compra">
                    <span>{formatearFecha(consulta.fechaCompra)}</span>
                    <span className="detalle-celda">
                      {consulta.compra} · {formatearImporte(consulta.precio)}
                    </span>
                  </td>
                  <td data-etiqueta="Vencimiento">{formatearFecha(consulta.fechaVencimiento)}</td>
                  <td data-etiqueta="Estado">
                    <Insignia
                      estado={consulta.pago === 'pendiente' ? 'pendiente' : consulta.estado}
                    />
                    <span className="detalle-celda">
                      {consulta.pago === 'confirmado'
                        ? 'Pago confirmado'
                        : 'Pendiente de validación'}
                    </span>
                  </td>
                  <td className="acciones-celda">
                    {consulta.estado === 'disponible' && consulta.pago === 'confirmado' ? (
                      <Link
                        className="enlace-texto"
                        to={`/paciente/agendar?consulta=${consulta.id}`}
                      >
                        Agendar <Icono nombre="chevron" tamano={16} />
                      </Link>
                    ) : consulta.estado === 'programada' ? (
                      <Link className="enlace-texto" to="/paciente/citas">
                        Ver cita <Icono nombre="chevron" tamano={16} />
                      </Link>
                    ) : (
                      <span className="accion-no-disponible">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EstadoVacio
            titulo="No encontramos consultas"
            descripcion="Prueba otro código o cambia el filtro seleccionado."
          />
        )}
        <div className="pie-registros" role="status">
          Mostrando {consultasVisibles.length} de {consultasEjemplo.length} consultas
        </div>
      </section>
      <p className="nota-registros">
        <Icono nombre="ayuda" tamano={17} />
        Una consulta adquirida puede estar pendiente de agendar. La fecha y el horario se registran
        en la cita.
      </p>
    </>
  )
}
