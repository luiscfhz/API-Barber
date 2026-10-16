import { useState } from 'react'
import { Search, Pencil, Trash2, UserPlus } from 'lucide-react'
import Modal from '../components/Modal'
import { clientesApi, citasApi } from '../services/api'
import { useRecurso } from '../services/useRecurso'

const vacio = { nombre: '', telefono: '', email: '' }

function iniciales(nombre) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase()
}

function formatearFecha(fechaHora) {
  return new Date(fechaHora).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function Clientes() {
  const { datos: clientes, cargando, error, recargar } = useRecurso(clientesApi)
  const { datos: citas } = useRecurso(citasApi)
  const [busqueda, setBusqueda] = useState('')
  const [formulario, setFormulario] = useState(null)

  const filtrados = clientes.filter((c) => {
    const texto = busqueda.toLowerCase()
    return c.nombre.toLowerCase().includes(texto) || c.telefono.includes(texto)
  })

  function citasDe(idCliente) {
    return citas.filter((c) => c.idCliente === idCliente)
  }

  function ultimaVisita(idCliente) {
    const fechas = citasDe(idCliente).map((c) => c.inicio).sort()
    return fechas.length ? formatearFecha(fechas[fechas.length - 1]) : '—'
  }

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  async function guardar(evento) {
    evento.preventDefault()
    const cliente = { ...formulario, email: formulario.email || null }
    try {
      if (cliente.idCliente) {
        await clientesApi.actualizar(cliente.idCliente, cliente)
      } else {
        await clientesApi.crear(cliente)
      }
      setFormulario(null)
      recargar()
    } catch {
      alert('No se pudo guardar. Revisa que el teléfono no esté repetido.')
    }
  }

  async function eliminar(cliente) {
    if (!window.confirm(`¿Eliminar a ${cliente.nombre}?`)) return
    try {
      await clientesApi.eliminar(cliente.idCliente)
      recargar()
    } catch {
      alert('No se pudo eliminar. Puede tener citas asociadas.')
    }
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Clientes</h1>
          <p className="subtitulo">Directorio e historial de atención</p>
        </div>
        <button className="boton-verde" onClick={() => setFormulario({ ...vacio })}>
          <UserPlus size={16} /> Agregar cliente
        </button>
      </div>

      <div className="barra-busqueda">
        <div className="buscador">
          <Search size={16} />
          <input
            placeholder="Buscar por nombre o teléfono"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <span className="subtitulo">{clientes.length} clientes registrados</span>
      </div>

      {cargando && <p className="mensaje">Cargando…</p>}
      {error && <p className="mensaje error">{error}</p>}

      <div className="tarjeta tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre completo</th>
              <th>Teléfono</th>
              <th>Historial</th>
              <th>Última visita</th>
              <th className="derecha">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <tr key={c.idCliente}>
                <td>
                  <div className="persona">
                    <span className="avatar-iniciales">{iniciales(c.nombre)}</span>
                    {c.nombre}
                  </div>
                </td>
                <td>{c.telefono}</td>
                <td>{citasDe(c.idCliente).length} citas</td>
                <td>{ultimaVisita(c.idCliente)}</td>
                <td className="derecha">
                  <div className="acciones">
                    <button className="icono-boton editar" onClick={() => setFormulario({ ...c, email: c.email ?? '' })} title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button className="icono-boton borrar" onClick={() => eliminar(c)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!cargando && filtrados.length === 0 && (
              <tr><td colSpan={5} className="vacio">No se encontraron clientes.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {formulario && (
        <Modal titulo={formulario.idCliente ? 'Editar cliente' : 'Agregar cliente'} onCerrar={() => setFormulario(null)}>
          <form onSubmit={guardar}>
            <label htmlFor="nombre">Nombre completo</label>
            <input id="nombre" required maxLength={50} value={formulario.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)} />

            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" required maxLength={15} value={formulario.telefono}
              onChange={(e) => cambiar('telefono', e.target.value)} />

            <label htmlFor="email">Correo (opcional)</label>
            <input id="email" type="email" maxLength={100} value={formulario.email}
              onChange={(e) => cambiar('email', e.target.value)} />

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