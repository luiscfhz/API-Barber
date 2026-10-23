const CLAVE = 'sesionBarberia'

export function guardarSesion(sesion) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion))
  } catch {
    // si el navegador no permite guardar, la sesión no se conserva
  }
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE)
  } catch {
    // nada que hacer
  }
}