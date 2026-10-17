import { Link } from 'react-router-dom'
import { Icono, Marca } from '@/componentes/Elementos'
import { PreguntasFrecuentes } from '@/vistas/Ayuda'

export function InicioPublico() {
  return (
    <div className="pagina-publica">
      <header className="cabecera-publica ancho-publico">
        <Link to="/" className="marca-enlace">
          <Marca />
        </Link>
        <nav aria-label="Navegación principal">
          <a href="#como-funciona" className="enlace-cabecera">
            Cómo funciona
          </a>
          <a href="#preguntas" className="enlace-cabecera">
            Preguntas frecuentes
          </a>
          <Link to="/ingresar" className="boton boton-primario">
            Ingresar <Icono nombre="flecha" tamano={17} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="portada-publica ancho-publico">
          <div className="texto-portada">
            <p className="antetitulo">Portal del paciente</p>
            <h1>
              Tus consultas y citas,
              <br />
              <span>en un solo lugar.</span>
            </h1>
            <p className="descripcion-portada">
              Revisa las consultas que adquiriste, encuentra un horario y ten a mano los detalles de
              tu próxima visita.
            </p>
            <Link to="/ingresar" className="boton boton-primario boton-grande">
              Ingresar al portal <Icono nombre="flecha" tamano={19} />
            </Link>
            <p className="acceso-demostracion">
              ¿Quieres conocer la propuesta?{' '}
              <Link to="/paciente/inicio">Explora la demostración</Link>
            </p>
          </div>
          <div className="orientacion-portada">
            <div className="icono-portada">
              <Icono nombre="citas" tamano={30} />
            </div>
            <h2>Tu atención, mejor organizada.</h2>
            <p>La información que necesitas antes de ir a tu consulta.</p>
            <ul>
              <li>
                <Icono nombre="confirmar" />
                <span>Consultas disponibles y su vencimiento</span>
              </li>
              <li>
                <Icono nombre="confirmar" />
                <span>Horarios por especialidad y sede</span>
              </li>
              <li>
                <Icono nombre="confirmar" />
                <span>Fecha y detalles de tus próximas citas</span>
              </li>
            </ul>
            <div className="nota-portada">
              <Icono nombre="persona" tamano={18} /> Hecho para acompañarte antes de tu visita.
            </div>
          </div>
        </section>
        <section id="como-funciona" className="seccion-como ancho-publico">
          <h2>De tu consulta a tu cita</h2>
          <div className="pasos-publicos">
            <article>
              <span>01</span>
              <h3>Revisa tus consultas</h3>
              <p>
                Identifica cuáles tienes pendientes de agendar y hasta cuándo puedes utilizarlas.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Elige un horario</h3>
              <p>Busca una especialidad, selecciona una sede y revisa las opciones de atención.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Ten todo a mano</h3>
              <p>Consulta la fecha, el profesional y la sede de tu cita antes de tu visita.</p>
            </article>
          </div>
        </section>
        <section id="preguntas" className="preguntas-publicas ancho-publico">
          <div>
            <p className="antetitulo">Te orientamos</p>
            <h2>Antes de comenzar</h2>
            <p>Resuelve algunas dudas sobre el portal.</p>
          </div>
          <PreguntasFrecuentes />
        </section>
      </main>
      <footer className="pie-publico ancho-publico">
        <span>MiDoc · Propuesta académica del portal del paciente</span>
        <a href="https://www.midoc.pe/" target="_blank" rel="noreferrer">
          Sitio de MiDoc <Icono nombre="externo" tamano={16} />
        </a>
      </footer>
    </div>
  )
}
