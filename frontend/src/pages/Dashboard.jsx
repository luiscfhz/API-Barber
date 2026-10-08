import { Link } from 'react-router-dom'
import { citas, barberos, servicios, FECHA_DEMO } from '../data/datos'
import {
  buscarCliente,
  buscarBarbero,
  buscarServicio,
  horaDe,
  diaDe,
  estados,
} from '../data/utilidades'

export default function Dashboard() {
  // Calculamos los números a partir de los datos, no a mano.
  const citasHoy = citas.filter((c) => diaDe(c.inicio) === FECHA_DEMO)
  const programadas = citasHoy.filter((c) => c.estado === 'PROGRAMADA')
  const barberosActivos = barberos.filter((b) => b.activo)

  return (
    <>
      <h1>Buenos días, Mariana</h1>
      <p className="subtitulo">Miércoles, 30 de septiembre · El Mapache Bigotón</p>

      <div className="fila-stats">
        <div className="tarjeta">
          <div className="stat-titulo">Citas de hoy</div>
          <div className="stat-numero">{citasHoy.length}</div>
          <div className="stat-nota">{programadas.length} programadas por atender</div>
        </div>
        <div className="tarjeta">
          <div className="stat-titulo">Barberos activos</div>
          <div className="stat-numero">{barberosActivos.length}</div>
          <div className="stat-nota">Equipo registrado</div>
        </div>
        <div className="tarjeta">
          <div className="stat-titulo">Servicios disponibles</div>
          <div className="stat-numero">{servicios.length}</div>
          <div className="stat-nota">Catálogo actualizado</div>
        </div>
      </div>

      <div className="fila-paneles">
        <div className="tarjeta">
          <h2>Próximas citas</h2>
          {citasHoy.map((cita) => {
            const cliente = buscarCliente(cita.idCliente)
            const barbero = buscarBarbero(cita.idBarbero)
            const servicio = buscarServicio(cita.idServicio)
            const estado = estados[cita.estado]

            return (
              <div className="cita-item" key={cita.idCita}>
                <span className="cita-hora">{horaDe(cita.inicio)}</span>
                <div className="cita-info">
                  {cliente.nombre}
                  <small>{servicio.nombre} · {barbero.nombre}</small>
                </div>
                <span className={`etiqueta ${estado.clase}`}>{estado.texto}</span>
              </div>
            )
          })}
        </div>

        <div className="tarjeta">
          <h2>Accesos rápidos</h2>
          <Link className="acceso" to="/citas">Citas</Link>
          <Link className="acceso" to="/barberos">Barberos</Link>
          <Link className="acceso" to="/clientes">Clientes</Link>
          <Link className="acceso" to="/servicios">Servicios</Link>
          <Link className="acceso" to="/configuracion">Configuración</Link>
        </div>
      </div>
    </>
  )
}