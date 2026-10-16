import { Link, Route, Routes } from 'react-router-dom'

export function Aplicacion() {
  return (
    <main className="container py-5">
      <div className="bg-white border rounded-3 p-4 mx-auto contenido-inicial">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="h2">MiDoc</h1>
                <p className="mb-0 text-secondary">
                  Gestión de consultas y citas médicas.
                </p>
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <h1 className="h2">Página no encontrada</h1>
                <Link to="/">Volver al inicio</Link>
              </>
            }
          />
        </Routes>
      </div>
    </main>
  )
}
