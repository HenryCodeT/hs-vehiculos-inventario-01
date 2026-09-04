'use client'

import type { Vehicle } from '@/lib/vehicles/types'
import { cn } from '@/lib/utils'

const ESTADO_STYLES: Record<string, string> = {
  LIBRE: 'border border-green-600 text-green-700 bg-white',
  SEPARADO: 'border border-yellow-500 text-yellow-700 bg-white',
  VENDIDO: 'border border-blue-600 text-blue-700 bg-white',
  FINANCIADO: 'border border-orange-500 text-orange-700 bg-white',
}

const SITUACION_STYLES: Record<string, string> = {
  PENDIENTE: 'border border-gray-400 text-gray-600 bg-white',
  ENTREGADO: 'border border-emerald-600 text-emerald-700 bg-white',
}

function fmt(date: string | null) {
  if (!date) return '—'
  const [y, m, d] = date.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

function fmtPrice(n: number | null) {
  if (n == null) return '—'
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2 })
}

interface Props {
  vehicles: Vehicle[]
  isLoading: boolean
  onEdit: (vehicle: Vehicle) => void
  onDelete: (id: string) => void
}

// ── Skeleton row/card ──────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-t border-gray-100">
      {Array.from({ length: 16 }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />
      ))}
    </div>
  )
}

// ── Desktop table ──────────────────────────────────────────
function DesktopTable({ vehicles, isLoading, onEdit, onDelete }: Props) {
  const COLS = [
    'F. Factura', 'VIN', 'Marca', 'Modelo', 'Color', 'Cliente',
    'P. Compra', 'P. Venta', 'F. Llegada', 'Ubicación', 'Código',
    'Asesor', 'Estado', 'Situación', 'Observaciones', '',
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {COLS.map((c) => (
              <th key={c} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : vehicles.length === 0
            ? (
              <tr>
                <td colSpan={COLS.length} className="py-16 text-center text-gray-400">
                  Sin resultados
                </td>
              </tr>
            )
            : vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 whitespace-nowrap text-gray-600">{fmt(v.fechaFactura)}</td>
                <td className="px-3 py-2 whitespace-nowrap font-mono text-xs text-gray-700">{v.vin || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.marca || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap max-w-[160px] truncate" title={v.modelo}>{v.modelo || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.color || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap max-w-[160px] truncate" title={v.cliente}>{v.cliente || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right">{fmtPrice(v.precioCompra)}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right">{fmtPrice(v.precioVenta)}</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-600">{fmt(v.fechaLlegada)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.ubicacion || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.codigo || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.asesor || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-semibold', ESTADO_STYLES[v.estado] ?? 'bg-white border border-gray-300 text-gray-600')}>
                    {v.estado}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-semibold', SITUACION_STYLES[v.situacion] ?? 'bg-white border border-gray-300 text-gray-600')}>
                    {v.situacion}
                  </span>
                </td>
                <td className="px-3 py-2 max-w-[120px] truncate text-gray-500" title={v.observaciones}>{v.observaciones || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(v)} className="text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors font-medium text-gray-700">
                      Editar
                    </button>
                    <button
                      onClick={() => { if (confirm('¿Eliminar este vehículo?')) onDelete(v.id) }}
                      className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Mobile cards ───────────────────────────────────────────
function MobileCards({ vehicles, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 py-16 text-center text-gray-400">
        Sin resultados
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {vehicles.map((v) => (
        <div key={v.id} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 shadow-sm">
          {/* Header: marca/modelo + estado */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {v.marca || '—'} · {v.modelo || '—'}
              </p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{v.vin || 'Sin VIN'}</p>
            </div>
            <span className={cn('shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold', ESTADO_STYLES[v.estado] ?? 'bg-white border border-gray-300 text-gray-600')}>
              {v.estado}
            </span>
          </div>

          {/* Cliente + color */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-wide">Cliente</span>
              <p className="text-gray-700 font-medium truncate">{v.cliente || '—'}</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-wide">Color</span>
              <p className="text-gray-700 font-medium">{v.color || '—'}</p>
            </div>
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-wide">P. Compra</span>
              <p className="text-gray-700 font-medium">{fmtPrice(v.precioCompra)}</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-wide">P. Venta</span>
              <p className="text-gray-700 font-medium">{fmtPrice(v.precioVenta)}</p>
            </div>
          </div>

          {/* Ubicación + asesor */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-wide">Ubicación</span>
              <p className="text-gray-700 font-medium">{v.ubicacion || '—'}</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-wide">Asesor</span>
              <p className="text-gray-700 font-medium">{v.asesor || '—'}</p>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-wide">F. Factura</span>
              <p className="text-gray-700 font-medium">{fmt(v.fechaFactura)}</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-wide">F. Llegada</span>
              <p className="text-gray-700 font-medium">{fmt(v.fechaLlegada)}</p>
            </div>
          </div>

          {/* Footer: situación + acciones */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', SITUACION_STYLES[v.situacion] ?? 'bg-white border border-gray-300 text-gray-600')}>
              {v.situacion}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(v)}
                className="text-xs px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors font-medium text-gray-700"
              >
                Editar
              </button>
              <button
                onClick={() => { if (confirm('¿Eliminar este vehículo?')) onDelete(v.id) }}
                className="text-xs px-4 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Parent: elige desktop o mobile ─────────────────────────
export default function VehicleTable(props: Props) {
  return (
    <>
      <div className="hidden md:block">
        <DesktopTable {...props} />
      </div>
      <div className="block md:hidden">
        <MobileCards {...props} />
      </div>
    </>
  )
}
