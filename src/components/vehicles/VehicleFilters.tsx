'use client'

import { Download, Plus } from 'lucide-react'
import type { TabFilter, Vehicle } from '@/lib/vehicles/types'
import { exportToExcel } from '@/lib/vehicles/hooks'
import { cn } from '@/lib/utils'

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'todos', label: 'Registro de carros' },
  { key: 'vendidos', label: 'Vendidos' },
  { key: 'separados-financiados', label: 'Separados / Financiados' },
  { key: 'libres', label: 'Libres' },
  { key: 'entregados', label: 'Entregados' },
]

interface Props {
  tab: TabFilter
  search: string
  desde: string
  hasta: string
  vehicles: Vehicle[]
  onTabChange: (tab: TabFilter) => void
  onSearchChange: (v: string) => void
  onDesdeChange: (v: string) => void
  onHastaChange: (v: string) => void
  onAdd: () => void
}

export default function VehicleFilters({
  tab, search, desde, hasta, vehicles,
  onTabChange, onSearchChange, onDesdeChange, onHastaChange, onAdd,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Tabs — scrollable en mobile */}
      <div className="flex overflow-x-auto gap-1 border-b border-gray-200 pb-0 scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={cn(
              'shrink-0 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap',
              tab === t.key
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filtros + acciones */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Búsqueda */}
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por VIN o cliente..."
          className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Fechas */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => onDesdeChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => onHastaChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2 sm:ml-auto">
          <button
            onClick={() => exportToExcel(vehicles)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Exportar Excel</span>
            <span className="sm:hidden">Exportar</span>
          </button>
          <button
            onClick={onAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
