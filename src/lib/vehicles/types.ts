export type VehicleStatus = 'LIBRE' | 'SEPARADO' | 'VENDIDO' | 'FINANCIADO'
export type DeliveryStatus = 'PENDIENTE' | 'ENTREGADO'

export interface Vehicle {
  id: string
  fechaFactura: string | null
  vin: string
  marca: string
  modelo: string
  color: string
  cliente: string
  precioCompra: number | null
  precioVenta: number | null
  fechaLlegada: string | null
  ubicacion: string
  codigo: string
  asesor: string
  estado: VehicleStatus
  situacion: DeliveryStatus
  observaciones: string
}

export type VehicleFormData = Omit<Vehicle, 'id'>

export type TabFilter = 'todos' | 'vendidos' | 'separados-financiados' | 'libres' | 'entregados'
