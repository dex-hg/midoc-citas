import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icono, Marca } from '@/componentes/Elementos'

export function Acceso() {
  const [mostrarClave, establecerMostrarClave] = useState(false)
  const [mensaje, establecerMensaje] = useState('')

  return (
    <div className="pagina-publica pagina-acceso">
      <header className="cabecera-publica ancho-publico">
        <Link to="/" className="marca-enlace">
          <Marca />
        </Link>
        <Link to="/" className="enlace-texto">
          Volver al inicio
        </Link>
      </header>
      <main className="contenido-acceso">
        <div className="introduccion-acceso">
          <p className="antetitulo">Portal del paciente</p>
          <h2>Bienvenido a MiDoc.</h2>
          <p>Tu próxima cita empieza con la información en orden.</p>
          <div className="detalle-acceso">
            <Icono nombre="consultas" tamano={24} />
            <div>
              <strong>Tus consultas, a la vista</strong>
              <p>Disponibilidad, vencimiento y estado de pago.</p>
            </div>
          </div>
          <div className="detalle-acceso">
            <Icono nombre="citas" tamano={24} />
            <div>
              <strong>Tu agenda, más clara</strong>
              <p>Horarios y detalles de cada atención.</p>
            </div>
          </div>
          <small>Propuesta de interfaz · MiDoc</small>
        </div>
        <section className="formulario-acceso" aria-labelledby="titulo-acceso">
          <span className="etiqueta-demo">Vista preliminar</span>
          <h1 id="titulo-acceso">Ingresa a tu cuenta</h1>
          <p>Consulta y organiza tus atenciones médicas.</p>
          <div className="aviso-formulario">
            Esta es una demostración. No ingreses datos personales ni tu contraseña real.
          </div>
          <form
            autoComplete="off"
            onSubmit={(evento) => {
              evento.preventDefault()
              establecerMensaje(
                'El acceso real todavía no está habilitado. Puedes recorrer el portal con el botón de demostración.',
              )
              evento.currentTarget.reset()
            }}
          >
            <label htmlFor="documento">Documento de identidad (DNI)</label>
            <input
              id="documento"
              name="documentoDemostracion"
              className="campo"
              inputMode="numeric"
              pattern="[0-9]{8}"
              maxLength={8}
              required
              placeholder="8 dígitos"
              autoComplete="off"
              title="Ingresa los 8 dígitos del DNI de prueba."
            />
            <div className="etiqueta-clave">
              <label htmlFor="clave">Contraseña</label>
              <button
                type="button"
                className="boton-texto"
                onClick={() =>
                  establecerMensaje(
                    'La recuperación de contraseña aún no está disponible en esta demostración.',
                  )
                }
              >
                ¿La olvidaste?
              </button>
            </div>
            <div className="campo-clave">
              <input
                id="clave"
                name="claveDemostracion"
                className="campo"
                type={mostrarClave ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Tu contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="boton-icono"
                aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={mostrarClave}
                onClick={() => establecerMostrarClave(!mostrarClave)}
              >
                <Icono nombre={mostrarClave ? 'ocultar' : 'ver'} />
              </button>
            </div>
            {mensaje && (
              <p className="mensaje-formulario" role="status">
                {mensaje}
              </p>
            )}
            <button type="submit" className="boton boton-primario ancho-completo">
              Ingresar
            </button>
          </form>
          <div className="separador-texto">
            <span>Conoce el portal</span>
          </div>
          <Link to="/paciente/inicio" className="boton boton-secundario ancho-completo">
            Explorar demostración <Icono nombre="flecha" tamano={17} />
          </Link>
          <p className="nota-formulario">El recorrido de ejemplo está disponible sin una cuenta.</p>
        </section>
      </main>
    </div>
  )
}
