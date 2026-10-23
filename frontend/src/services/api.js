import * as datos from '../data/datos'
import { obtenerSesion, cerrarSesion } from './sesion'

// ============================================================
//  INTERRUPTOR: false = datos de ejemplo | true = backend real
// ============================================================
const USAR_API = false
const BASE_URL = 'http://localhost:8080/api'

// Usuario de ejemplo para el modo demo (el mismo que crea el backend)
const USUARIO_DEMO = {
  usuario: 'mariana',
  clave: 'Mapache2026',
  nombre: 'Mariana López',
  rol: 'Administradora',
}

// Petición genérica al backend (manda el token si hay sesión)
async function pedir(ruta, opciones = {}) {
  const sesion = obtenerSesion()
  const headers = { 'Content-Type': 'application/json' }
  if (sesion?.token) headers.Authorization = `Bearer ${sesion.token}`

  const respuesta = await fetch(`${BASE_URL}${ruta}`, { ...opciones, headers })

  // Token vencido o inválido: se cierra la sesión y se vuelve al Login
  if (respuesta.status === 401 && ruta !== '/login') {
    cerrarSesion()
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
  return respuesta.status === 204 ? null : respuesta.json()
}

// ---------- Sesión ----------
export async function iniciarSesionApi(usuario, clave) {
  if (USAR_API) {
    return pedir('/login', { method: 'POST', body: JSON.stringify({ usuario, clave }) })
  }
  if (usuario === USUARIO_DEMO.usuario && clave === USUARIO_DEMO.clave) {
    return { token: 'demo', nombre: USUARIO_DEMO.nombre, rol: USUARIO_DEMO.rol }
  }
  throw new Error('Credenciales incorrectas')
}

export async function cerrarSesionApi() {
  if (!USAR_API) return
  try {
    await pedir('/logout', { method: 'POST' })
  } catch {
    // si falla, de todos modos se cierra la sesión en el navegador
  }
}

// ---------- Datos ----------
// Copias en memoria para el modo demo (se pierden al recargar la página)
const demo = {
  servicios: [...datos.servicios],
  barberos: [...datos.barberos],
  clientes: [...datos.clientes],
  citas: [...datos.citas],
}

// Crea las 4 operaciones (listar, crear, actualizar, eliminar) para un recurso
function crearRecurso(nombre, campoId) {
  return {
    async listar() {
      if (USAR_API) return pedir(`/${nombre}`)
      return [...demo[nombre]]
    },
    async crear(item) {
      if (USAR_API) {
        return pedir(`/${nombre}`, { method: 'POST', body: JSON.stringify(item) })
      }
      const nuevo = { ...item, [campoId]: Date.now() }
      demo[nombre].push(nuevo)
      return nuevo
    },
    async actualizar(id, item) {
      if (USAR_API) {
        return pedir(`/${nombre}/${id}`, { method: 'PUT', body: JSON.stringify(item) })
      }
      demo[nombre] = demo[nombre].map((x) => (x[campoId] === id ? { ...item, [campoId]: id } : x))
      return item
    },
    async eliminar(id) {
      if (USAR_API) return pedir(`/${nombre}/${id}`, { method: 'DELETE' })
      demo[nombre] = demo[nombre].filter((x) => x[campoId] !== id)
    },
  }
}

export const serviciosApi = crearRecurso('servicios', 'idServicio')
export const barberosApi = crearRecurso('barberos', 'idBarbero')
export const clientesApi = crearRecurso('clientes', 'idCliente')
export const citasApi = crearRecurso('citas', 'idCita')

function hoyISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Día con el que abren Panel, Citas y Nueva cita
export const FECHA_INICIAL = USAR_API ? hoyISO() : datos.FECHA_DEMO