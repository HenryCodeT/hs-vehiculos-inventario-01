import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        ...body,
        fechaFactura: body.fechaFactura ? new Date(body.fechaFactura) : null,
        fechaLlegada: body.fechaLlegada ? new Date(body.fechaLlegada) : null,
      },
    })
    return NextResponse.json(vehicle)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.vehicle.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
