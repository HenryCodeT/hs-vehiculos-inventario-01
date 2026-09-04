'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as XLSX from 'xlsx'
import type { Vehicle, VehicleFormData, TabFilter } from './types'

interface FetchParams {
  tab: TabFilter
  search: string
  desde: string
  hasta: string
}

async function fetchVehicles(params: FetchParams): Promise<Vehicle[]> {
  const qs = new URLSearchParams({
    tab: params.tab,
    search: params.search,
    desde: params.desde,
    hasta: params.hasta,
  }).toString()
  const res = await fetch(`/api/vehicles?${qs}`)
  if (!res.ok) throw new Error('Error al cargar vehículos')
  return res.json()
}

export function useVehicles(params: FetchParams) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => fetchVehicles(params),
  })
}

export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: VehicleFormData) => {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error al crear vehículo')
      return res.json() as Promise<Vehicle>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  })
}

export function useUpdateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VehicleFormData> }) => {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error al actualizar vehículo')
      return res.json() as Promise<Vehicle>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  })
}

export function useDeleteVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar vehículo')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  })
}

function fmtDate(val: string | null): string {
  if (!val) return ''
  const [y, m, d] = val.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function exportToExcel(vehicles: Vehicle[]) {
  const rows = vehicles.map((v) => ({
    'Fecha Factura': fmtDate(v.fechaFactura),
    VIN: v.vin,
    Marca: v.marca,
    Modelo: v.modelo,
    Color: v.color,
    Cliente: v.cliente,
    'P. Compra': v.precioCompra ?? '',
    'P. Venta': v.precioVenta ?? '',
    'F. Llegada': fmtDate(v.fechaLlegada),
    Ubicación: v.ubicacion,
    Código: v.codigo,
    Asesor: v.asesor,
    Estado: v.estado,
    Situación: v.situacion,
    Observaciones: v.observaciones,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario')
  XLSX.writeFile(wb, 'inventario-vehiculos.xlsx')
}
