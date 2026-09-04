import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { TabFilter } from '@/lib/vehicles/types'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const tab = (searchParams.get('tab') ?? 'todos') as TabFilter
  const search = searchParams.get('search') ?? ''
  const desde = searchParams.get('desde') ?? ''
  const hasta = searchParams.get('hasta') ?? ''

  const where: Record<string, unknown> = {}

  if (tab === 'vendidos') {
    where.estado = 'VENDIDO'
  } else if (tab === 'separados-financiados') {
    where.estado = { in: ['SEPARADO', 'FINANCIADO'] }
  } else if (tab === 'libres') {
    where.estado = 'LIBRE'
  } else if (tab === 'entregados') {
    where.situacion = 'ENTREGADO'
  }

  if (search) {
    where.OR = [
      { vin: { contains: search, mode: 'insensitive' } },
      { cliente: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (desde || hasta) {
    where.fechaFactura = {
      ...(desde ? { gte: new Date(desde) } : {}),
      ...(hasta ? { lte: new Date(hasta) } : {}),
    }
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(vehicles)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const vehicle = await prisma.vehicle.create({
    data: {
      ...body,
      fechaFactura: body.fechaFactura ? new Date(body.fechaFactura) : null,
      fechaLlegada: body.fechaLlegada ? new Date(body.fechaLlegada) : null,
    },
  })
  return NextResponse.json(vehicle, { status: 201 })
}
