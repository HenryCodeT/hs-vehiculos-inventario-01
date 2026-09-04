'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import type { Vehicle, VehicleFormData } from '@/lib/vehicles/types'
import { CATALOG, MARCAS, UBICACIONES, ASESORES, ESTADOS, SITUACIONES } from '@/lib/vehicles/data'

interface Props {
  vehicle?: Vehicle | null
  onClose: () => void
  onSave: (data: VehicleFormData) => Promise<void>
}

function toDateInput(val: string | null | undefined): string {
  if (!val) return ''
  return val.slice(0, 10) // "2026-06-16T00:00:00.000Z" → "2026-06-16"
}

const EMPTY: VehicleFormData = {
  fechaFactura: null,
  vin: '',
  marca: '',
  modelo: '',
  color: '',
  cliente: '',
  precioCompra: null,
  precioVenta: null,
  fechaLlegada: null,
  ubicacion: '',
  codigo: '',
  asesor: '',
  estado: 'LIBRE',
  situacion: 'PENDIENTE',
  observaciones: '',
}

export default function VehicleModal({ vehicle, onClose, onSave }: Props) {
  const isEdit = Boolean(vehicle)
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<VehicleFormData>({
    defaultValues: vehicle ? {
      ...vehicle,
      fechaFactura: toDateInput(vehicle.fechaFactura),
      fechaLlegada: toDateInput(vehicle.fechaLlegada),
      precioCompra: vehicle.precioCompra ?? null,
      precioVenta: vehicle.precioVenta ?? null,
    } : EMPTY,
  })

  const marcaSeleccionada = watch('marca')
  const modeloActual = watch('modelo')

  // Modelos disponibles para la marca seleccionada
  const modelos = marcaSeleccionada ? (CATALOG[marcaSeleccionada] ?? []) : []

  // Cuando cambia la marca, limpiar modelo solo si el modelo actual no está en la nueva lista
  useEffect(() => {
    if (!modelos.includes(modeloActual)) {
      setValue('modelo', '')
    }
  }, [marcaSeleccionada])

  // Estado para el combobox de modelo (texto libre)
  const [modeloInput, setModeloInput] = useState(vehicle?.modelo ?? '')
  const [showModeloList, setShowModeloList] = useState(false)

  const modelosFiltrados = modelos.filter((m) =>
    m.toLowerCase().includes(modeloInput.toLowerCase()),
  )

  useEffect(() => {
    setModeloInput(vehicle?.modelo ?? '')
  }, [vehicle])

  useEffect(() => {
    setValue('modelo', modeloInput)
  }, [modeloInput])

  async function onSubmit(data: VehicleFormData) {
    await onSave(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? 'Editar vehículo' : 'Nuevo vehículo'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-4 md:px-6 md:py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fecha Factura */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fecha Factura</label>
            <input
              type="date"
              {...register('fechaFactura')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* F. Llegada */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">F. Llegada</label>
            <input
              type="date"
              {...register('fechaLlegada')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* VIN */}
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">VIN (Chasis)</label>
            <input
              {...register('vin')}
              placeholder="Número de chasis"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Marca */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Marca</label>
            <select
              {...register('marca')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Seleccionar —</option>
              {MARCAS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Modelo (combobox con texto libre) */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Modelo</label>
            <input
              value={modeloInput}
              onChange={(e) => { setModeloInput(e.target.value); setShowModeloList(true) }}
              onFocus={() => setShowModeloList(true)}
              onBlur={() => setTimeout(() => setShowModeloList(false), 150)}
              placeholder="Seleccionar o escribir modelo"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showModeloList && modelosFiltrados.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                {modelosFiltrados.map((m) => (
                  <li
                    key={m}
                    onMouseDown={() => { setModeloInput(m); setShowModeloList(false) }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Color */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Color</label>
            <input
              {...register('color')}
              placeholder="Color"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Código */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Código</label>
            <input
              {...register('codigo')}
              placeholder="Código"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cliente */}
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cliente</label>
            <input
              {...register('cliente')}
              placeholder="Nombre del cliente"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* P. Compra */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">P. Compra</label>
            <input
              type="number"
              step="0.01"
              {...register('precioCompra', { valueAsNumber: true })}
              placeholder="0.00"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* P. Venta */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">P. Venta</label>
            <input
              type="number"
              step="0.01"
              {...register('precioVenta', { valueAsNumber: true })}
              placeholder="0.00"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ubicación */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ubicación</label>
            <select
              {...register('ubicacion')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Seleccionar —</option>
              {UBICACIONES.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Asesor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Asesor</label>
            <select
              {...register('asesor')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Seleccionar —</option>
              {ASESORES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estado</label>
            <select
              {...register('estado')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {/* Situación */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Situación de Entrega</label>
            <select
              {...register('situacion')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SITUACIONES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Observaciones */}
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observaciones</label>
            <textarea
              {...register('observaciones')}
              rows={2}
              placeholder="Observaciones adicionales"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
