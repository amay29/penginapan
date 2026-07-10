import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import "dotenv/config"

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding dummy glamping units...')

  const units = [
    {
      name: 'Pines A-Frame Cabin',
      type: 'A-Frame',
      capacity: 4,
      pricePerNight: 1250000,
      amenities: ['Queen Bed', 'Private Bathroom', 'Kitchenette', 'Fire Pit', 'WiFi', 'Mountain View'],
      photoUrls: [
        'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80'
      ],
      promotionalCopy: 'Escape to the whispering pines in our signature A-Frame cabin. Perfect for couples or small families seeking a serene mountain retreat.'
    },
    {
      name: 'Riverside Safari Tent',
      type: 'Tent',
      capacity: 2,
      pricePerNight: 850000,
      amenities: ['King Bed', 'Shared Bathroom', 'Outdoor Deck', 'BBQ Grill', 'River View'],
      photoUrls: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?auto=format&fit=crop&q=80'
      ],
      promotionalCopy: 'Experience the thrill of the wild with the comforts of home. Fall asleep to the sound of the rushing river.'
    },
    {
      name: 'The Glass House',
      type: 'Cabin',
      capacity: 2,
      pricePerNight: 1800000,
      amenities: ['King Bed', 'Ensuite Bathroom', 'Stargazing Ceiling', 'Private Jacuzzi', 'Air Conditioning', 'WiFi'],
      photoUrls: [
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80'
      ],
      promotionalCopy: 'Immerse yourself in nature without boundaries. The Glass House offers an unparalleled romantic stargazing experience.'
    }
  ]

  for (const unit of units) {
    await prisma.unit.create({
      data: unit
    })
  }

  console.log('Seeding completed! Created 3 glamping units.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
