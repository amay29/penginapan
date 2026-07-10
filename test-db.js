const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function testLatency() {
  console.log("Initializing Prisma...");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set.");
    return;
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Connecting to database...");
  const t0 = performance.now();
  
  try {
    const units = await prisma.unit.findMany({ take: 1 });
    const t1 = performance.now();
    console.log(`Query successful! Found ${units.length} units.`);
    console.log(`Latency: ${Math.round(t1 - t0)}ms`);
  } catch (e) {
    console.error("Query failed:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testLatency();
