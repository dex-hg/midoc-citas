import { useEffect, useRef } from 'react'
import type { PropsWithChildren } from 'react'
import {
  ArrowRight as Flecha,
  ArrowUpRight as FlechaExterna,
  CalendarDays as Calendario,
  CalendarPlus as Agendar,
  Check as Confirmar,
  ChevronRight as Chevron,
  CircleHelp as Ayuda,
  Clock3 as Reloj,
  CreditCard as Pago,
  Eye as Ver,
  EyeOff as Ocultar,
  House as Inicio,
  LogOut as Salir,
  MapPin as Ubicacion,
  Menu,
  Search as Buscar,
  ShieldCheck as Escudo,
  Ticket as Consulta,
  UserRound as Persona,
  X as Cerrar,
} from 'lucide-react'

const iconos = {
  inicio: Inicio,
  consultas: Consulta,
  citas: Calendario,
  agendar: Agendar,
  ayuda: Ayuda,
  flecha: Flecha,
  externo: FlechaExterna,
  chevron: Chevron,
  reloj: Reloj,
  pago: Pago,
  ubicacion: Ubicacion,
  salir: Salir,
  menu: Menu,
  cerrar: Cerrar,
  buscar: Buscar,
  confirmar: Confirmar,
  persona: Persona,
  ver: Ver,
  ocultar: Ocultar,
  escudo: Escudo,
}

export function Icono({ nombre, tamano = 20 }: { nombre: keyof typeof iconos; tamano?: number }) {
  const Componente = iconos[nombre]
  return <Componente size={tamano} strokeWidth={1.7} aria-hidden="true" />
}

export function Marca() {
  return (
    <span className="marca" aria-label="MiDoc">
      mi<span>Doc</span>
      <b aria-hidden="true">+</b>
    </span>
  )
}

export function Insignia({ estado }: { estado: string }) {
  const etiquetas: Record<string, string> = {
    disponible: 'Por agendar',
    programada: 'Programada',
    utilizada: 'Utilizada',
    vencida: 'Vencida',
    pendiente: 'Pago pendiente',
    confirmado: 'Pago confirmado',
    atendida: 'Atendida',
    cancelada: 'Cancelada',
  }
  return <span className={`insignia insignia--${estado}`}>{etiquetas[estado] ?? estado}</span>
}

export function EncabezadoPagina({
  titulo,
  descripcion,
  children: contenido,
}: PropsWithChildren<{ titulo: string; descripcion: string }>) {
  return (
    <div className="encabezado-pagina">
      <div>
        <h1>{titulo}</h1>
        <p>{descripcion}</p>
      </div>
      {contenido}
    </div>
  )
}

export function EstadoVacio({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  return (
    <div className="estado-vacio" role="status">
      <Icono nombre="citas" tamano={30} />
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
    </div>
  )
}

export function VentanaModal({
  titulo,
  cerrar,
  children: contenido,
}: PropsWithChildren<{ titulo: string; cerrar: () => void }>) {
  const referencia = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const ventana = referencia.current
    ventana?.showModal()
    return () => ventana?.close()
  }, [])

  return (
    <dialog
      ref={referencia}
      className="ventana-modal"
      aria-labelledby="titulo-modal"
      onCancel={cerrar}
    >
      <div className="cabecera-modal">
        <h2 id="titulo-modal">{titulo}</h2>
        <button className="boton-icono" onClick={cerrar} aria-label="Cerrar detalle">
          <Icono nombre="cerrar" />
        </button>
      </div>
      {contenido}
    </dialog>
  )
}
