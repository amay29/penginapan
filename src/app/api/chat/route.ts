import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const maxDuration = 30; // Max edge function duration

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const units = await prisma.unit.findMany();
    
    let unitsInfoText = "";
    if (units.length === 0) {
      unitsInfoText = "Saat ini belum ada unit yang tersedia.";
    } else {
      unitsInfoText = units.map(u => 
        `- **${u.name}** (${u.type}): Kapasitas hingga ${u.capacity} tamu. Harga mulai dari Rp ${u.pricePerNight.toLocaleString('id-ID')} / malam. Fasilitas: ${u.amenities.join(', ')}.`
      ).join('\n   ');
    }

    const systemPrompt = `Anda adalah Damar AI Concierge, asisten virtual eksklusif dan ramah untuk Damar Retreats. 
Tugas Anda adalah melayani tamu yang ingin bertanya tentang properti, harga, ketersediaan, atau aturan glamping.

**Informasi Properti (REAL-TIME DARI SISTEM):**
1. **Nama Tempat:** Damar Retreats
2. **Lokasi:** Tersembunyi di alam Lembang, Jawa Barat. Menawarkan kemewahan di tengah keheningan alam.
3. **Tipe Unit yang Tersedia:**
   ${unitsInfoText}
4. **Fasilitas Umum Tambahan:** Wifi, sarapan gratis, api unggun di malam hari.

**Aturan (Penting):**
1. Check-in mulai pukul 14:00, Check-out maksimal pukul 11:00.
2. Hewan peliharaan (pets) **TIDAK DIIZINKAN** demi kenyamanan semua tamu.
3. Dilarang membawa makanan berbau tajam (seperti durian) ke dalam unit.
4. Pemesanan tidak memerlukan DP di muka melalui web, bayar penuh saat tiba atau via transfer setelah dihubungi tim kami.

**Aturan Menjawab:**
1. Gunakan bahasa Indonesia yang sopan, hangat, profesional, namun tidak kaku (gunakan sapaan "Bapak/Ibu" atau "Kak").
2. Jangan pernah memberikan informasi palsu atau mengarang.
3. Jika tamu bertanya ketersediaan untuk tanggal tertentu, **SELALU gunakan alat/tool checkAvailability** untuk memeriksanya di database.
4. Jika alat checkAvailability gagal atau error, atau jika tamu menanyakan rute detail, arahkan mereka untuk mengeklik tombol "Chat via WhatsApp" di halaman unit.
5. Jawab dengan ringkas dan jelas.
`;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: systemPrompt,
      tools: {
        checkAvailability: tool({
          description: 'Cek ketersediaan unit untuk rentang tanggal tertentu.',
          parameters: z.object({
            startDate: z.string().describe('Tanggal mulai / check-in (format YYYY-MM-DD)'),
            endDate: z.string().describe('Tanggal selesai / check-out (format YYYY-MM-DD)'),
          }),
          execute: async ({ startDate, endDate }) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              return { error: 'Format tanggal tidak valid. Gunakan YYYY-MM-DD.' };
            }

            const conflictingBookings = await prisma.booking.findMany({
              where: {
                status: { in: ['PENDING', 'CONFIRMED'] },
                AND: [
                  { checkIn: { lt: end } },
                  { checkOut: { gt: start } }
                ]
              },
              select: { unitId: true }
            });

            const bookedUnitIds = new Set(conflictingBookings.map(b => b.unitId));
            const availableUnits = units.filter(u => !bookedUnitIds.has(u.id));

            return {
              requestedDates: { startDate, endDate },
              availableUnits: availableUnits.map(u => ({ id: u.id, name: u.name, price: u.pricePerNight })),
              bookedUnits: units.filter(u => bookedUnitIds.has(u.id)).map(u => ({ id: u.id, name: u.name })),
              message: availableUnits.length > 0 
                ? "Ada unit yang tersedia." 
                : "Semua unit penuh pada tanggal tersebut."
            };
          },
        })
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({ error: "Gagal menghubungkan ke asisten." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
