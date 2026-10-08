// Datos de ejemplo con la MISMA forma que la base de datos BarberiaDB.
// Cuando el backend esté listo, se reemplazan por llamadas a la API.
// Los nombres de los campos pueden cambiar según cómo los devuelva Spring Boot.

export const FECHA_DEMO = '2026-09-30'

export const clientes = [
  { idCliente: 1, nombre: 'Alejandro Ruiz', telefono: '55 1824 6912', email: null },
  { idCliente: 2, nombre: 'Ricardo Salas', telefono: '55 9173 2048', email: null },
  { idCliente: 3, nombre: 'Santiago León', telefono: '55 6302 1187', email: null },
  { idCliente: 4, nombre: 'Emilio Navarro', telefono: '55 4408 7625', email: null },
  { idCliente: 5, nombre: 'Julián Herrera', telefono: '55 8031 4490', email: null },
]

export const barberos = [
  { idBarbero: 1, nombre: 'Diego Morales', especialidad: 'Clásicos y barba', activo: true },
  { idBarbero: 2, nombre: 'Mateo Vargas', especialidad: 'Cortes modernos', activo: true },
  { idBarbero: 3, nombre: 'Bruno Castillo', especialidad: 'Afeitado tradicional', activo: true },
]

export const servicios = [
  { idServicio: 1, nombre: 'Corte', precio: 260, duracionMinutos: 45 },
  { idServicio: 2, nombre: 'Barba', precio: 190, duracionMinutos: 30 },
  { idServicio: 3, nombre: 'Corte + Barba', precio: 420, duracionMinutos: 75 },
  { idServicio: 4, nombre: 'Afeitado clásico', precio: 240, duracionMinutos: 40 },
]

export const citas = [
  { idCita: 1, idCliente: 1, idBarbero: 1, idServicio: 3, inicio: '2026-09-30T09:00:00', fin: '2026-09-30T10:15:00', estado: 'PROGRAMADA' },
  { idCita: 2, idCliente: 2, idBarbero: 2, idServicio: 1, inicio: '2026-09-30T10:30:00', fin: '2026-09-30T11:15:00', estado: 'PROGRAMADA' },
  { idCita: 3, idCliente: 3, idBarbero: 1, idServicio: 2, inicio: '2026-09-30T12:00:00', fin: '2026-09-30T12:30:00', estado: 'PROGRAMADA' },
  { idCita: 4, idCliente: 4, idBarbero: 3, idServicio: 3, inicio: '2026-09-30T15:30:00', fin: '2026-09-30T16:45:00', estado: 'PROGRAMADA' },
]