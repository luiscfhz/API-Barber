import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const pad = (n) => String(n).padStart(2, '0')

export default function Calendario({ seleccionada, onSeleccionar, diasConCitas, children }) {
  const [anioInicial, mesInicial] = seleccionada.split('-').map(Number)
  const [vista, setVista] = useState({ anio: anioInicial, mes: mesInicial - 1 })

  // La semana empieza en lunes (como en el prototipo)
  const vacios = (new Date(vista.anio, vista.mes, 1).getDay() + 6) % 7
  const diasDelMes = new Date(vista.anio, vista.mes + 1, 0).getDate()

  function mover(cambio) {
    const nueva = new Date(vista.anio, vista.mes + cambio, 1)
    setVista({ anio: nueva.getFullYear(), mes: nueva.getMonth() })
  }

  const celdas = []
  for (let i = 0; i < vacios; i++) {
    celdas.push(<span key={`vacio-${i}`} />)
  }
  for (let dia = 1; dia <= diasDelMes; dia++) {
    const fecha = `${vista.anio}-${pad(vista.mes + 1)}-${pad(dia)}`
    const clases = ['dia']
    if (fecha === seleccionada) clases.push('seleccionado')
    if (diasConCitas.has(fecha)) clases.push('con-cita')
    celdas.push(
      <button type="button" key={fecha} className={clases.join(' ')} onClick={() => onSeleccionar(fecha)}>
        {dia}
      </button>
    )
  }

  return (
    <div className="tarjeta">
      <div className="calendario-cabecera">
        <button type="button" onClick={() => mover(-1)} title="Mes anterior">
          <ChevronLeft size={18} />
        </button>
        <strong>{MESES[vista.mes]} {vista.anio}</strong>
        <button type="button" onClick={() => mover(1)} title="Mes siguiente">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="calendario-rejilla">
        {DIAS.map((d, i) => (
          <span className="dia-semana" key={i}>{d}</span>
        ))}
        {celdas}
      </div>

      <div className="calendario-pie">{children}</div>
    </div>
  )
}