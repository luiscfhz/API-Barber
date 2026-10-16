import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Scissors } from 'lucide-react'
import { citasApi, clientesApi, barberosApi, serviciosApi, FECHA_INICIAL } from '../services/api'
import { useRecurso } from '../services/useRecurso'
import { diaDe, horaDe, sumarMinutos, fechaCorta } from '../data/utilidades'

// Horas disponibles: de 09:00 a 20:00, cada 30 minutos
const HORAS = Array.from({ length: 23 }, (_, i) => {
  const hora = 9 + Math.floor(i / 2)
  const minutos = i % 2 ? '30' : '00'
  return `${String(hora).padStart(2, '0')}:${minutos}`
})

export default function NuevaCita() {
  const { id } = useParams() // existe solo al editar
  const navegar = useNavigate()

  const { datos: clientes } = useRecurso(clientesApi)
  const { datos: barberos } = useRecurso(barberosApi)
  const { datos: servicios } = useRecurso(serviciosApi)
  const { datos: citas } = useRecurso(citasApi)

  const [form, setForm] = useState({
    fecha: FECHA_INICIAL,
    hora: '09:00',
    idBarbero: '',
    idCliente: '',
    idServicio: '',
  })
  const [estado, setEstado] = useState('PROGRAMADA')

  // Al editar: cargar la cita existente en el formulario
  useEffect(() => {
    if (!id) return
    citasApi.listar().then((lista) => {
      const cita = lista.find((c) => String(c.idCita) === id)
      if (!cita) return
      setForm({
        fecha: diaDe(cita.inicio),
        hora: horaDe(cita.inicio),
        idBarbero: String(cita.idBarbero),
        idCliente: String(cita.idCliente),
        idServicio: String(cita.idServicio),
      })
      setEstado(cita.estado)
    })
  }, [id])

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  // ----- Cálculos a partir del formulario -----
  const servicio = servicios.find((s) => String(s.idServicio) === form.idServicio)
  const inicio = `${form.fecha}T${form.hora}:00`
  const fin = servicio ? sumarMinutos(inicio, servicio.duracionMinutos) : null

  // ¿El barbero ya tiene otra cita que se empalme con esta?
  const hayChoque =
    fin &&
    form.idBarbero &&
    citas.some(
      (c) =>
        String(c.idBarbero) === form.idBarbero &&
        c.estado !== 'CANCELADA' &&
        String(c.idCita) !== id &&
        c.inicio.slice(0, 19) < fin &&
        c.fin.slice(0, 19) > inicio
    )

  const horas = HORAS.includes(form.hora) ? HORAS : [...HORAS, form.hora].sort()
  const barberosDisponibles = barberos.filter(
    (b) => b.activo || String(b.idBarbero) === form.idBarbero
  )

  async function guardar(evento) {
    evento.preventDefault()
    if (hayChoque) return

    const cita = {
      idCliente: Number(form.idCliente),
      idBarbero: Number(form.idBarbero),
      idServicio: Number(form.idServicio),
      inicio,
      fin,
      estado,
    }

    try {
      if (id) {
        await citasApi.actualizar(Number(id), { ...cita, idCita: Number(id) })
      } else {
        await citasApi.crear(cita)
      }
      navegar('/citas')
    } catch {
      alert('No se pudo guardar la cita.')
    }
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>{id ? 'Editar Cita' : 'Nueva Cita'}</h1>
          <p className="subtitulo">Completa los datos para reservar un espacio</p>
        </div>
        <Link className="enlace-volver" to="/citas">
          <ArrowLeft size={14} /> Volver a citas
        </Link>
      </div>

      <form className="formulario-cita" onSubmit={guardar}>
        <div className="tarjeta">
          <h2>Datos de la cita</h2>

          <div className="fila-doble">
            <div>
              <label htmlFor="fecha">Fecha</label>
              <input id="fecha" type="date" required value={form.fecha}
                onChange={(e) => cambiar('fecha', e.target.value)} />
            </div>
            <div>
              <label htmlFor="hora">Hora</label>
              <select id="hora" value={form.hora} onChange={(e) => cambiar('hora', e.target.value)}>
                {horas.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <label htmlFor="barbero">Barbero</label>
          <select id="barbero" required value={form.idBarbero}
            onChange={(e) => cambiar('idBarbero', e.target.value)}>
            <option value="">Selecciona un barbero</option>
            {barberosDisponibles.map((b) => (
              <option key={b.idBarbero} value={b.idBarbero}>{b.nombre}</option>
            ))}
          </select>

          <label htmlFor="cliente">Cliente</label>
          <select id="cliente" required value={form.idCliente}
            onChange={(e) => cambiar('idCliente', e.target.value)}>
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => (
              <option key={c.idCliente} value={c.idCliente}>{c.nombre} · {c.telefono}</option>
            ))}
          </select>

          <label htmlFor="servicio">Servicio</label>
          <select id="servicio" required value={form.idServicio}
            onChange={(e) => cambiar('idServicio', e.target.value)}>
            <option value="">Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s.idServicio} value={s.idServicio}>{s.nombre}</option>
            ))}
          </select>

          <label htmlFor="costo">Costo autocompletado</label>
          <input id="costo" readOnly
            value={servicio ? `$${Number(servicio.precio).toLocaleString('es-MX')} MXN` : ''} />

          {hayChoque && (
            <div className="aviso-choque">
              Ese barbero ya tiene una cita que se empalma con este horario. Elige otra hora u otro barbero.
            </div>
          )}

          <div className="modal-botones">
            <button type="button" className="boton-claro" onClick={() => navegar('/citas')}>
              Cancelar
            </button>
            <button type="submit" className="boton-verde" disabled={Boolean(hayChoque)}>
              <Check size={16} /> Guardar
            </button>
          </div>
        </div>

        <div className="tarjeta">
          <h2>Resumen de la reserva</h2>
          <div className="resumen-imagen">
            <Scissors size={40} />
          </div>
          <div className="resumen-fila">
            <span>Fecha y hora</span>
            <span>{form.fecha ? `${fechaCorta(form.fecha)} · ${form.hora}` : '—'}</span>
          </div>
          <div className="resumen-fila">
            <span>Duración</span>
            <span>{servicio ? `${servicio.duracionMinutos} minutos` : '—'}</span>
          </div>
          <div className="resumen-total">
            <span>Total</span>
            <span>{servicio ? `$${Number(servicio.precio).toLocaleString('es-MX')} MXN` : '—'}</span>
          </div>
        </div>
      </form>
    </>
  )
}