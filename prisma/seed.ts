import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import "dotenv/config"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding dummy glamping units...')

  const units = [
    {
      name: 'Kabin Kaca Edelweiss',
      type: 'Kabin',
      capacity: 4,
      pricePerNight: 1250000,
      amenities: ['Queen Bed', 'Kamar Mandi Dalam', 'Dapur Kecil', 'Area Api Unggun', 'WiFi Gratis', 'Pemandangan Gunung'],
      photoUrls: [
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80'
      ],
      promotionalCopy: 'Nikmati suasana tenang dan udara sejuk khas pegunungan Ciparay dari dalam kabin kaca eksklusif kami. Cocok untuk liburan keluarga atau *staycation* pasangan.'
    },
    {
      name: 'Tenda Safari Pinus',
      type: 'Tenda Glamping',
      capacity: 2,
      pricePerNight: 850000,
      amenities: ['King Bed', 'Kamar Mandi Terpisah', 'Teras Kayu', 'BBQ Grill', 'Pemandangan Hutan Pinus'],
      photoUrls: [
        'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504280387367-361c6d9e38f4?auto=format&fit=crop&q=80'
      ],
      promotionalCopy: 'Rasakan sensasi berkemah mewah menyatu dengan alam tanpa harus repot. Tidur nyenyak dengan kasur yang empuk ditemani suara alam Ciparay.'
    },
    {
      name: 'Vila Bukit Rosa',
      type: 'Vila',
      capacity: 2,
      pricePerNight: 1800000,
      amenities: ['King Bed', 'Kamar Mandi Dalam', 'Atap Kaca Bintang', 'Jacuzzi Pribadi', 'AC', 'WiFi Gratis'],
      photoUrls: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80'
      ],
      promotionalCopy: 'Manjakan diri Anda di vila premium dengan fasilitas lengkap. Berendam di kolam jacuzzi pribadi sambil menatap langit malam bertabur bintang.'
    }
  ]

  for (const unit of units) {
    await prisma.unit.create({
      data: unit
    })
  }

  console.log('Seeding completed! Created 3 glamping units.')

  console.log('Seeding role accounts...')
  const passwordHash = await bcrypt.hash('password', 10)
  
  const users = [
    { name: 'Owner', email: 'owner@rosaglamping.com', role: 'OWNER', passwordHash },
    { name: 'Resepsionis', email: 'receptionist@rosaglamping.com', role: 'RECEPTIONIST', passwordHash },
    { name: 'Kasir Kafe', email: 'cafe@rosaglamping.com', role: 'CAFE_CASHIER', passwordHash },
    { name: 'Satpam Kolam', email: 'pool@rosaglamping.com', role: 'POOL_SECURITY', passwordHash },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { role: user.role, passwordHash },
      create: user,
    })
  }

  console.log('Role accounts seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
