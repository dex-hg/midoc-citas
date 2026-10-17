import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { EstructuraPortal } from '@/componentes/EstructuraPortal'
import { Marca } from '@/componentes/Elementos'
import { Acceso } from '@/vistas/Acceso'
import { Agendar } from '@/vistas/Agendar'
import { Ayuda } from '@/vistas/Ayuda'
import { Citas } from '@/vistas/Citas'
import { Consultas } from '@/vistas/Consultas'
import { InicioPublico } from '@/vistas/InicioPublico'
import { PanelPaciente } from '@/vistas/PanelPaciente'

export function Aplicacion() {
  const { pathname: rutaActual, search: busquedaActual } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (!rutaActual.startsWith('/paciente/'))
      document.title = `${rutaActual === '/ingresar' ? 'Ingresar' : 'Portal del paciente'} · MiDoc`
  }, [rutaActual, busquedaActual])

  return (
    <Routes>
      <Route path="/" element={<InicioPublico />} />
      <Route path="/ingresar" element={<Acceso />} />
      <Route path="/paciente" element={<EstructuraPortal />}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio" element={<PanelPaciente />} />
        <Route path="consultas" element={<Consultas />} />
        <Route path="citas" element={<Citas />} />
        <Route path="agendar" element={<Agendar key={`${rutaActual}${busquedaActual}`} />} />
        <Route path="ayuda" element={<Ayuda />} />
      </Route>
      <Route
        path="*"
        element={
          <main className="pagina-no-encontrada">
            <Marca />
            <h1>Página no encontrada</h1>
            <p>Revisa la dirección o vuelve al inicio del portal.</p>
            <Link to="/" className="boton boton-primario">
              Volver al inicio
            </Link>
          </main>
        }
      />
    </Routes>
  )
}
