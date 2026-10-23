import { Link } from 'react-router-dom'
import { Calendar, Scissors, Users, Sparkles, Settings, ChevronRight } from 'lucide-react'
import { citasApi, clientesApi, barberosApi, serviciosApi, FECHA_INICIAL } from '../services/api'
import { useRecurso } from '../services/useRecurso'
import { diaDe, horaDe, estados, fechaLarga } from '../data/utilidades'
import { obtenerSesion } from '../services/sesion'

const porId = (lista, campo) => Object.fromEntries(lista.map((x) => [x[campo], x]))

function saludo() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const accesos = [
  { ruta: '/citas', texto: 'Citas', nota: 'Organizar agenda', icono: Calendar },
  { ruta: '/barberos', texto: 'Barberos', nota: 'Gestionar equipo', icono: Scissors },
  { ruta: '/clientes', texto: 'Clientes', nota: 'Consultar historial', icono: Users },
  { ruta: '/servicios', texto: 'Servicios', nota: 'Editar catálogo', icono: Sparkles },
  { ruta: '/configuracion', texto: 'Configuración', nota: 'Preferencias', icono: Settings },
]

export default function Dashboard() {
  const nombre = obtenerSesion()?.nombre?.split(' ')[0] ?? ''
  const { datos: citas, error } = useRecurso(citasApi)
  const { datos: clientes } = useRecurso(clientesApi)
  const { datos: barberos } = useRecurso(barberosApi)
  const { datos: servicios } = useRecurso(serviciosApi)

  const clientePorId = porId(clientes, 'idCliente')
  const barberoPorId = porId(barberos, 'idBarbero')
  const servicioPorId = porId(servicios, 'idServicio')

  // Citas del día (sin contar las canceladas), ordenadas por hora
  const citasHoy = citas
    .filter((c) => diaDe(c.inicio) === FECHA_INICIAL && c.estado !== 'CANCELADA')
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  const porAtender = citasHoy.filter((c) => c.estado === 'PROGRAMADA')
  const proximas = porAtender.slice(0, 4)
  const barberosActivos = barberos.filter((b) => b.activo)

  return (
    <>
      <h1>{saludo()}, {nombre}</h1>
      <p className="subtitulo">{fechaLarga(FECHA_INICIAL)} · El Mapache Bigotón</p>

      {error && <p className="mensaje error">{error}</p>}

      <div className="fila-stats">
        <div className="tarjeta">
          <div className="stat-titulo">Citas de hoy</div>
          <div className="stat-numero">{citasHoy.length}</div>
          <div className="stat-nota">{porAtender.length} por atender</div>
        </div>
        <div className="tarjeta">
          <div className="stat-titulo">Barberos activos</div>
          <div className="stat-numero">{barberosActivos.length}</div>
          <div className="stat-nota">de {barberos.length} registrados</div>
        </div>
        <div className="tarjeta">
          <div className="stat-titulo">Servicios disponibles</div>
          <div className="stat-numero">{servicios.length}</div>
          <div className="stat-nota">Catálogo actualizado</div>
        </div>
      </div>

      <div className="fila-paneles">
        <div className="tarjeta">
          <div className="encabezado-tarjeta">
            <h2>Próximas citas</h2>
            <Link to="/citas" className="enlace-suave">Ver agenda completa</Link>
          </div>

          {proximas.map((c) => {
            const cliente = clientePorId[c.idCliente]
            const barbero = barberoPorId[c.idBarbero]
            const servicio = servicioPorId[c.idServicio]
            const estado = estados[c.estado]

            return (
              <div className="cita-item" key={c.idCita}>
                <span className="cita-hora">{horaDe(c.inicio)}</span>
                <div className="cita-info">
                  {cliente?.nombre}
                  <small>{servicio?.nombre} · {barbero?.nombre}</small>
                </div>
                <span className={`etiqueta ${estado.clase}`}>{estado.texto}</span>
              </div>
            )
          })}

          {proximas.length === 0 && (
            <p className="mensaje">No hay citas pendientes para hoy.</p>
          )}
        </div>

        <div className="tarjeta">
          <h2>Accesos rápidos</h2>
          {accesos.map(({ ruta, texto, nota, icono: Icono }) => (
            <Link className="acceso" to={ruta} key={ruta}>
              <Icono size={16} />
              <span>
                {texto}
                <small>{nota}</small>
              </span>
              <ChevronRight size={16} />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}