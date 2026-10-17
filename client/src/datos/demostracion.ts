// Datos ficticios para revisar las vistas. No representan registros de Supabase.
export type EstadoConsulta = 'disponible' | 'programada' | 'utilizada' | 'vencida'
export type EstadoPago = 'confirmado' | 'pendiente'
export type EstadoCita = 'programada' | 'atendida' | 'cancelada'

export interface ConsultaEjemplo {
  id: string
  compra: string
  fechaCompra: string
  fechaVencimiento: string
  estado: EstadoConsulta
  pago: EstadoPago
  precio: number
}

export interface CitaEjemplo {
  id: string
  idConsulta: string
  especialidad: string
  profesional: string
  sede: string
  fecha: string
  hora: string
  duracion: number
  estado: EstadoCita
  reprogramaciones: number
}

const zonaHoraria = 'America/Lima'
const hoyEnLima = new Intl.DateTimeFormat('en-CA', { timeZone: zonaHoraria }).format(new Date())

export function fechaRelativa(dias: number): string {
  const fecha = new Date(`${hoyEnLima}T12:00:00-05:00`)
  fecha.setUTCDate(fecha.getUTCDate() + dias)
  return fecha.toISOString().slice(0, 10)
}

export function formatearFecha(
  fecha: string,
  opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat('es-PE', { ...opciones, timeZone: zonaHoraria }).format(
    new Date(`${fecha}T12:00:00-05:00`),
  )
}

export function formatearImporte(importe: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(importe)
}

export const pacienteEjemplo = { nombres: 'Mariana', apellidos: 'Salas', iniciales: 'MS' }

export const consultasEjemplo: ConsultaEjemplo[] = [
  {
    id: 'CON-00124',
    compra: 'CMP-00086',
    fechaCompra: fechaRelativa(-6),
    fechaVencimiento: fechaRelativa(24),
    estado: 'programada',
    pago: 'confirmado',
    precio: 45,
  },
  {
    id: 'CON-00125',
    compra: 'CMP-00086',
    fechaCompra: fechaRelativa(-6),
    fechaVencimiento: fechaRelativa(24),
    estado: 'disponible',
    pago: 'confirmado',
    precio: 45,
  },
  {
    id: 'CON-00108',
    compra: 'CMP-00071',
    fechaCompra: fechaRelativa(-16),
    fechaVencimiento: fechaRelativa(14),
    estado: 'disponible',
    pago: 'confirmado',
    precio: 45,
  },
  {
    id: 'CON-00126',
    compra: 'CMP-00087',
    fechaCompra: fechaRelativa(-2),
    fechaVencimiento: fechaRelativa(28),
    estado: 'disponible',
    pago: 'pendiente',
    precio: 45,
  },
  {
    id: 'CON-00092',
    compra: 'CMP-00062',
    fechaCompra: fechaRelativa(-27),
    fechaVencimiento: fechaRelativa(3),
    estado: 'utilizada',
    pago: 'confirmado',
    precio: 45,
  },
  {
    id: 'CON-00065',
    compra: 'CMP-00043',
    fechaCompra: fechaRelativa(-45),
    fechaVencimiento: fechaRelativa(-15),
    estado: 'vencida',
    pago: 'confirmado',
    precio: 45,
  },
]

export const citasEjemplo: CitaEjemplo[] = [
  {
    id: 'CIT-00048',
    idConsulta: 'CON-00124',
    especialidad: 'Medicina general',
    profesional: 'Dra. Andrea Rojas',
    sede: 'Pro',
    fecha: fechaRelativa(4),
    hora: '09:30',
    duracion: 30,
    estado: 'programada',
    reprogramaciones: 0,
  },
  {
    id: 'CIT-00031',
    idConsulta: 'CON-00092',
    especialidad: 'Dermatología',
    profesional: 'Dr. Diego Torres',
    sede: 'Izaguirre',
    fecha: fechaRelativa(-12),
    hora: '11:00',
    duracion: 30,
    estado: 'atendida',
    reprogramaciones: 1,
  },
]

export const consultasDisponibles = consultasEjemplo.filter(
  (consulta) => consulta.estado === 'disponible' && consulta.pago === 'confirmado',
)

export const especialidadesEjemplo = [
  'Medicina general',
  'Pediatría',
  'Dermatología',
  'Cardiología',
]
export const sedesEjemplo = ['Pro', 'Izaguirre']
export const horariosEjemplo = ['08:30', '09:00', '09:30', '10:30', '11:00', '11:30']
