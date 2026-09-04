import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'
import { INITIAL_VEHICLES } from '../src/lib/vehicles/data'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding vehicles...')
  for (const v of INITIAL_VEHICLES) {
    const { id, ...data } = v
    await prisma.vehicle.upsert({
      where: { id },
      update: {},
      create: {
        id,
        ...data,
        fechaFactura: data.fechaFactura ? new Date(data.fechaFactura) : null,
        fechaLlegada: data.fechaLlegada ? new Date(data.fechaLlegada) : null,
      },
    })
  }
  console.log(`Seeded ${INITIAL_VEHICLES.length} vehicles.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
