'use client'

import { useState } from 'react'
import VehicleFilters from '@/components/vehicles/VehicleFilters'
import VehicleTable from '@/components/vehicles/VehicleTable'
import VehicleModal from '@/components/vehicles/VehicleModal'
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '@/lib/vehicles/hooks'
import type { TabFilter, Vehicle, VehicleFormData } from '@/lib/vehicles/types'

export default function HomePage() {
  const [tab, setTab] = useState<TabFilter>('todos')
  const [search, setSearch] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Vehicle | null>(null)

  const { data: vehicles = [], isLoading } = useVehicles({ tab, search, desde, hasta })
  const { data: allVehicles = [] } = useVehicles({ tab, search: '', desde: '', hasta: '' })

  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()

  function handleAdd() {
    setSelected(null)
    setModalOpen(true)
  }

  function handleEdit(vehicle: Vehicle) {
    setSelected(vehicle)
    setModalOpen(true)
  }

  async function handleSave(data: VehicleFormData) {
    if (selected) {
      await updateVehicle.mutateAsync({ id: selected.id, data })
    } else {
      await createVehicle.mutateAsync(data)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">HS Vehículos</h1>
        <p className="text-sm text-gray-500">Inventario vehicular</p>
      </header>

      {/* Main */}
      <main className="px-3 py-4 md:px-6 md:py-6 flex flex-col gap-4">
        <VehicleFilters
          tab={tab}
          search={search}
          desde={desde}
          hasta={hasta}
          vehicles={allVehicles}
          onTabChange={setTab}
          onSearchChange={setSearch}
          onDesdeChange={setDesde}
          onHastaChange={setHasta}
          onAdd={handleAdd}
        />

        <div className="text-xs text-gray-400">
          {isLoading ? 'Cargando...' : `${vehicles.length} registro${vehicles.length !== 1 ? 's' : ''}`}
        </div>

        <VehicleTable
          vehicles={vehicles}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={(id) => deleteVehicle.mutate(id)}
        />
      </main>

      {modalOpen && (
        <VehicleModal
          vehicle={selected}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
