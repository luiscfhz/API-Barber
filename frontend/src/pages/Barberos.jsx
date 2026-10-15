import { useState } from 'react'
import { Users, UserCheck, Pencil, Trash2, Plus } from 'lucide-react'
import Modal from '../components/Modal'
import { barberosApi } from '../services/api'
import { useRecurso } from '../services/useRecurso'

const vacio = { nombre: '', especialidad: '', activo: true }

export default function Barberos() {
  const { datos: barberos, cargando, error, recargar } = useRecurso(barberosApi)
  const [formulario, setFormulario] = useState(null)

  const activos = barberos.filter((b) => b.activo).length

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  async function guardar(evento) {
    evento.preventDefault()
    try {
      if (formulario.idBarbero) {
        await barberosApi.actualizar(formulario.idBarbero, formulario)
      } else {
        await barberosApi.crear(formulario)
      }
      setFormulario(null)
      recargar()
    } catch {
      alert('No se pudo guardar el barbero.')
    }
  }

  async function eliminar(barbero) {
    if (!window.confirm(`¿Eliminar a ${barbero.nombre}?`)) return
    try {
      await barberosApi.eliminar(barbero.idBarbero)
      recargar()
    } catch {
      alert('No se pudo eliminar. Puede tener citas asociadas.')
    }
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Barberos</h1>
          <p className="subtitulo">Administra el equipo y su disponibilidad</p>
        </div>
        <button className="boton-verde" onClick={() => setFormulario({ ...vacio })}>
          <Plus size={16} /> Agregar barbero
        </button>
      </div>

      <div className="fila-stats dos">
        <div className="tarjeta stat-con-icono">
          <div>
            <div className="stat-titulo">Equipo registrado</div>
            <div className="stat-numero">{barberos.length}</div>
          </div>
          <span className="servicio-icono"><Users size={18} /></span>
        </div>
        <div className="tarjeta stat-con-icono">
          <div>
            <div className="stat-titulo">Barberos activos</div>
            <div className="stat-numero">{activos}</div>
          </div>
          <span className="servicio-icono"><UserCheck size={18} /></span>
        </div>
      </div>

      {cargando && <p className="mensaje">Cargando…</p>}
      {error && <p className="mensaje error">{error}</p>}

      <div className="tarjeta tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Barbero</th>
              <th>Estado</th>
              <th className="derecha">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {barberos.map((b) => (
              <tr key={b.idBarbero}>
                <td>
                  <div className="persona">
                    <span className="avatar-grande" />
                    <div>
                      {b.nombre}
                      <small>{b.especialidad}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`etiqueta ${b.activo ? 'activo' : 'inactivo'}`}>
                    {b.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="derecha">
                  <div className="acciones">
                    <button className="icono-boton editar" onClick={() => setFormulario({ ...b })} title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button className="icono-boton borrar" onClick={() => eliminar(b)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formulario && (
        <Modal titulo={formulario.idBarbero ? 'Editar barbero' : 'Agregar barbero'} onCerrar={() => setFormulario(null)}>
          <form onSubmit={guardar}>
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" required maxLength={50} value={formulario.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)} />

            <label htmlFor="especialidad">Especialidad</label>
            <input id="especialidad" maxLength={30} value={formulario.especialidad ?? ''}
              onChange={(e) => cambiar('especialidad', e.target.value)} />

            <label className="casilla">
              <input type="checkbox" checked={formulario.activo}
                onChange={(e) => cambiar('activo', e.target.checked)} />
              Barbero activo
            </label>

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