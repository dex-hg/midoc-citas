import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'

const clienteConsultas = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
})

export function Proveedores({ children: contenido }: PropsWithChildren) {
  return (
    <QueryClientProvider client={clienteConsultas}>
      <BrowserRouter>{contenido}</BrowserRouter>
    </QueryClientProvider>
  )
}
