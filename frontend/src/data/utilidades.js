import { clientes, barberos, servicios } from './datos'

// Busca por id. Ej: buscarCliente(1) -> { idCliente: 1, nombre: 'Alejandro Ruiz', ... }
export const buscarCliente = (id) => clientes.find((c) => c.idCliente === id)
export const buscarBarbero = (id) => barberos.find((b) => b.idBarbero === id)
export const buscarServicio = (id) => servicios.find((s) => s.idServicio === id)

// '2026-09-30T09:00:00' -> '09:00'
export const horaDe = (fechaHora) => fechaHora.slice(11, 16)

// '2026-09-30T09:00:00' -> '2026-09-30'
export const diaDe = (fechaHora) => fechaHora.slice(0, 10)

// Textos y clases CSS para cada estado de la BD
export const estados = {
  PROGRAMADA: { texto: 'Programada', clase: 'programada' },
  COMPLETADA: { texto: 'Completada', clase: 'completada' },
  CANCELADA: { texto: 'Cancelada', clase: 'cancelada' },
}
const pad = (n) => String(n).padStart(2, '0')

// Suma minutos a '2026-09-30T09:00:00' y devuelve el mismo formato
export function sumarMinutos(fechaHora, minutos) {
  const [fecha, hora] = fechaHora.split('T')
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const [horas, mins] = hora.split(':').map(Number)
  const f = new Date(anio, mes - 1, dia, horas, mins + minutos)
  return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())}T${pad(f.getHours())}:${pad(f.getMinutes())}:00`
}

// '2026-09-30' -> 'Miércoles, 30 de septiembre de 2026'
export function fechaLarga(fecha) {
  const texto = new Date(`${fecha}T00:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// '2026-09-30' -> 'mié, 30 sep'
export function fechaCorta(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}