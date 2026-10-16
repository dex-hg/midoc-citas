import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/estilos.css'
import { Aplicacion } from '@/Aplicacion'
import { Proveedores } from '@/Proveedores'

const contenedorRaiz = document.getElementById('raiz')

if (!contenedorRaiz) {
  throw new Error('No se encontró el contenedor principal de MiDoc.')
}

createRoot(contenedorRaiz).render(
  <StrictMode>
    <Proveedores>
      <Aplicacion />
    </Proveedores>
  </StrictMode>,
)
