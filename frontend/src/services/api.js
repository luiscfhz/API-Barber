import * as datos from '../data/datos'

// ============================================================
//  INTERRUPTOR: false = datos de ejemplo | true = backend real
// ============================================================
const USAR_API = false
const BASE_URL = 'http://localhost:8080/api'

// Petición genérica al backend
async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
  return respuesta.status === 204 ? null : respuesta.json()
}

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