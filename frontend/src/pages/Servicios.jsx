import { useState } from 'react'
import { Scissors, Smile, Pencil, Trash2, Plus } from 'lucide-react'
import Modal from '../components/Modal'
import { serviciosApi } from '../services/api'
import { useRecurso } from '../services/useRecurso'

const vacio = { nombre: '', precio: '', duracionMinutos: '' }

export default function Servicios() {
  const { datos: servicios, cargando, error, recargar } = useRecurso(serviciosApi)
  const [formulario, setFormulario] = useState(null) // null = cerrado

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  async function guardar(evento) {
    evento.preventDefault()
    const servicio = {
      ...formulario,
      precio: Number(formulario.precio),
      duracionMinutos: Number(formulario.duracionMinutos),
    }
    try {
      if (servicio.idServicio) {
        await serviciosApi.actualizar(servicio.idServicio, servicio)
      } else {
        await serviciosApi.crear(servicio)
      }
      setFormulario(null)
      recargar()
    } catch {
      alert('No se pudo guardar el servicio.')
    }
  }

  async function eliminar(servicio) {
    if (!window.confirm(`¿Eliminar "${servicio.nombre}"?`)) return
    try {
      await serviciosApi.eliminar(servicio.idServicio)
      recargar()
    } catch {
      alert('No se pudo eliminar. Puede tener citas asociadas.')
    }
  }

  function icono(nombre) {
    const solaBarba = nombre.toLowerCase().includes('barba') && !nombre.toLowerCase().includes('corte')
    return solaBarba ? <Smile size={18} /> : <Scissors size={18} />
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Servicios</h1>
          <p className="subtitulo">Catálogo y precios de El Mapache Bigotón</p>
        </div>
        <button className="boton-verde" onClick={() => setFormulario({ ...vacio })}>
          <Plus size={16} /> Agregar servicio
        </button>
      </div>

      {cargando && <p className="mensaje">Cargando…</p>}
      {error && <p className="mensaje error">{error}</p>}

      <div className="rejilla-servicios">
        {servicios.map((s) => (
          <div className="tarjeta" key={s.idServicio}>
            <div className="servicio-arriba">
              <span className="servicio-icono">{icono(s.nombre)}</span>
              <div className="acciones">
                <button className="icono-boton editar" onClick={() => setFormulario({ ...s })} title="Editar">
                  <Pencil size={14} />
                </button>
                <button className="icono-boton borrar" onClick={() => eliminar(s)} title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h2>{s.nombre}</h2>
            <div className="servicio-pie">
              <span className="precio">${Number(s.precio).toLocaleString('es-MX')}</span>
              <span className="duracion">{s.duracionMinutos} min</span>
            </div>
          </div>
        ))}
      </div>

      {formulario && (
        <Modal titulo={formulario.idServicio ? 'Editar servicio' : 'Agregar servicio'} onCerrar={() => setFormulario(null)}>
          <form onSubmit={guardar}>
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" required maxLength={50} value={formulario.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)} />

            <label htmlFor="precio">Precio (MXN)</label>
            <input id="precio" type="number" min="0" step="0.01" required value={formulario.precio}
              onChange={(e) => cambiar('precio', e.target.value)} />

            <label htmlFor="duracion">Duración (minutos)</label>
            <input id="duracion" type="number" min="5" required value={formulario.duracionMinutos}
              onChange={(e) => cambiar('duracionMinutos', e.target.value)} />

            <div className="modal-botones">
              <button type="button" className="boton-claro" onClick={() => setFormulario(null)}>Cancelar</button>
              <button type="submit" className="boton-verde">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}