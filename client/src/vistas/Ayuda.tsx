import { EncabezadoPagina, Icono } from '@/componentes/Elementos'

const preguntas = [
  {
    titulo: '¿Cuál es la diferencia entre una consulta y una cita?',
    respuesta:
      'La consulta es el servicio que adquiriste. La cita es la fecha y el horario que eliges para utilizar ese servicio. Puedes tener una consulta pendiente de agendar.',
  },
  {
    titulo: '¿Dónde encuentro las consultas que puedo utilizar?',
    respuesta:
      'En Mis consultas puedes revisar el estado, la fecha de vencimiento y el pago. El filtro Por agendar muestra las consultas disponibles del ejemplo.',
  },
  {
    titulo: '¿Qué significa pago pendiente?',
    respuesta:
      'El pago todavía está pendiente de validación. En esta demostración, esas consultas no permiten seleccionar un horario.',
  },
  {
    titulo: '¿Se guarda lo que hago en esta demostración?',
    respuesta:
      'No. Todos los nombres, horarios, importes y registros son ficticios. La selección de un horario sirve para revisar el recorrido y no genera una cita real.',
  },
]

export function PreguntasFrecuentes() {
  return (
    <div className="preguntas-frecuentes">
      {preguntas.map((pregunta) => (
        <details key={pregunta.titulo}>
          <summary>
            {pregunta.titulo}
            <Icono nombre="chevron" tamano={17} />
          </summary>
          <p>{pregunta.respuesta}</p>
        </details>
      ))}
    </div>
  )
}

export function Ayuda() {
  return (
    <>
      <EncabezadoPagina
        titulo="Ayuda y orientación"
        descripcion="Encuentra tu información y conoce el recorrido del portal."
      />
      <section className="panel panel-ayuda">
        <h2>Preguntas frecuentes</h2>
        <PreguntasFrecuentes />
      </section>
      <div className="orientacion-sencilla">
        <Icono nombre="ayuda" />
        <p>
          Para conocer los canales de atención de la clínica, visita el{' '}
          <a href="https://www.midoc.pe/" target="_blank" rel="noreferrer">
            sitio oficial de MiDoc
          </a>
          .
        </p>
      </div>
    </>
  )
}
