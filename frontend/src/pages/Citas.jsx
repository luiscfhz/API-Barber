import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Check, Pencil, Trash2 } from 'lucide-react'
import Calendario from '../components/Calendario'
import { citasApi, clientesApi, barberosApi, serviciosApi, FECHA_INICIAL } from '../services/api'
import { useRecurso } from '../services/useRecurso'
import { diaDe, horaDe, estados, fechaLarga } from '../data/utilidades'

// Convierte [{idCliente: 1, ...}, ...] en { 1: {...}, ... } para buscar rápido
const porId = (lista, campo) => Object.fromEntries(lista.map((x) => [x[campo], x]))

export default function Citas() {
  const navegar = useNavigate()
  const { datos: citas, cargando, error, recargar } = useRecurso(citasApi)
  const { datos: clientes } = useRecurso(clientesApi)
  const { datos: barberos } = useRecurso(barberosApi)
  const { datos: servicios } = useRecurso(serviciosApi)

  const [fecha, setFecha] = useState(FECHA_INICIAL)
  const [vista, setVista] = useState('calendario') // 'calendario' | 'lista'
  const [busqueda, setBusqueda] = useState('')
  const [idBarbero, setIdBarbero] = useState('') // '' = todos

  const clientePorId = porId(clientes, 'idCliente')
  const barberoPorId = porId(barberos, 'idBarbero')
  const servicioPorId = porId(servicios, 'idServicio')

  const texto = busqueda.toLowerCase()

  const filtradas = citas
    .filter((c) => vista === 'lista' || diaDe(c.inicio) === fecha)
    .filter((c) => !idBarbero || String(c.idBarbero) === idBarbero)
    .filter((c) => {
      if (!texto) return true
      const cliente = clientePorId[c.idCliente]
      if (!cliente) return false
      return cliente.nombre.toLowerCase().includes(texto) || cliente.telefono.includes(texto)
    })
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  const programadas = filtradas.filter((c) => c.estado === 'PROGRAMADA').length
  const diasConCitas = new Set(
    citas.filter((c) => c.estado !== 'CANCELADA').map((c) => diaDe(c.inicio))
  )
  const citasDelDia = citas.filter((c) => diaDe(c.inicio) === fecha).length

  async function marcarAtendida(cita) {
    try {
      await citasApi.actualizar(cita.idCita, { ...cita, estado: 'COMPLETADA' })
      recargar()
    } catch {
      alert('No se pudo actualizar la cita.')
    }
  }

  async function eliminar(cita) {
    if (!window.confirm('¿Eliminar esta cita?')) return
    try {
      await citasApi.eliminar(cita.idCita)
      recargar()
    } catch {
      alert('No se pudo eliminar la cita.')
    }
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Gestión de Citas</h1>
          <p className="subtitulo">{fechaLarga(fecha)}</p>
        </div>
        <Link className="boton-verde" to="/citas/nueva">
          <Plus size={16} /> Nueva Cita
        </Link>
      </div>

      <div className="fila-controles">
        <div className="alternar">
          <button
            className={vista === 'calendario' ? 'activo' : ''}
            onClick={() => setVista('calendario')}
          >
            Calendario + lista
          </button>
          <button
            className={vista === 'lista' ? 'activo' : ''}
            onClick={() => setVista('lista')}
          >
            Solo lista
          </button>
        </div>
        <span className="resumen-citas">
          {filtradas.length} citas · {programadas} programadas · ✓ Marcar como atendida
        </span>
      </div>

      {cargando && <p className="mensaje">Cargando…</p>}
      {error && <p className="mensaje error">{error}</p>}

      <div className={`citas-layout ${vista === 'lista' ? 'solo-lista' : ''}`}>
        {vista === 'calendario' && (
          <Calendario seleccionada={fecha} onSeleccionar={setFecha} diasConCitas={diasConCitas}>
            {citasDelDia} citas programadas
          </Calendario>
        )}

        <div className="tarjeta tabla-contenedor">
          <div className="tabla-herramientas">
            <div className="buscador">
              <Search size={16} />
              <input
                placeholder="Buscar cliente o teléfono"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <select value={idBarbero} onChange={(e) => setIdBarbero(e.target.value)}>
              <option value="">Todos los barberos</option>
              {barberos.map((b) => (
                <option key={b.idBarbero} value={b.idBarbero}>{b.nombre}</option>
              ))}
            </select>
          </div>

          <table className="tabla">
            <thead>
              <tr>
                {vista === 'lista' && <th>Fecha</th>}
                <th>Hora</th>
                <th>Cliente</th>
                <th>Servicio / Barbero</th>
                <th>Costo</th>
                <th>Estado</th>
                <th className="derecha">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((c) => {
                const cliente = clientePorId[c.idCliente]
                const barbero = barberoPorId[c.idBarbero]
                const servicio = servicioPorId[c.idServicio]
                const estado = estados[c.estado]

                return (
                  <tr key={c.idCita} className={c.estado === 'CANCELADA' ? 'fila-cancelada' : ''}>
                    {vista === 'lista' && <td>{diaDe(c.inicio)}</td>}
                    <td className="hora-texto">{horaDe(c.inicio)}</td>
                    <td>
                      {cliente?.nombre}
                      <small>{cliente?.telefono}</small>
                    </td>
                    <td>
                      {servicio?.nombre}
                      <small>{barbero?.nombre}</small>
                    </td>
                    <td>
                      {servicio ? `$${Number(servicio.precio).toLocaleString('es-MX')}` : '—'}
                    </td>
                    <td>
                      <span className={`etiqueta ${estado.clase}`}>{estado.texto}</span>
                    </td>
                    <td className="derecha">
                      <div className="acciones">
                        <button
                          className="icono-boton ok"
                          title="Marcar como atendida"
                          disabled={c.estado !== 'PROGRAMADA'}
                          onClick={() => marcarAtendida(c)}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="icono-boton editar"
                          title="Editar"
                          onClick={() => navegar(`/citas/${c.idCita}/editar`)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button className="icono-boton borrar" title="Eliminar" onClick={() => eliminar(c)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!cargando && filtradas.length === 0 && (
                <tr>
                  <td colSpan={vista === 'lista' ? 7 : 6} className="vacio">
                    No hay citas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}