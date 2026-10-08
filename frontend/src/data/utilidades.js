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