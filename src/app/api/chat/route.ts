import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const units = await prisma.unit.findMany();
    
    let unitsInfoText = "";
    if (units.length === 0) {
      unitsInfoText = "Saat ini belum ada unit yang tersedia.";
    } else {
      unitsInfoText = units.map(u => 
        `- **${u.name}** (${u.type}): Kapasitas hingga ${u.capacity} tamu. Harga mulai dari Rp ${u.pricePerNight.toLocaleString('id-ID')} per malam. Fasilitas: ${u.amenities.join(', ')}.`
      ).join('\n   ');
    }

    const systemPrompt = `Kamu adalah Asisten Virtual Rosa Glamping & Pool, yang membantu calon tamu atau pengunjung yang ingin bertanya seputar penginapan, kolam renang, fasilitas, ketersediaan, dan cara pemesanan.

**Tentang Kami:**
- **Nama:** Rosa Glamping & Pool (sering disebut Rosa Swimming Pool, Cafe and Resort)
- **Lokasi:** Kampung Lebak Biru, Desa Ciheulang, Kec. Ciparay, Kab. Bandung, Jawa Barat 40381
- **Konsep:** Penginapan glamping dan kolam renang outdoor yang nyaman, asri, dan terjangkau di kaki gunung Ciparay.
- **Status Properti:** ⭐ PROPERTI SYARIAH — Pasangan wajib menunjukkan identitas menikah (buku nikah/KTP) saat check-in.

**Unit yang Tersedia (Data Real-Time dari Sistem):**
   ${unitsInfoText}

**Fasilitas Umum:**
- Kolam renang outdoor (Rosa Swimming Pool) yang bersih dan terawat
- Area kafe dan resort
- WiFi gratis
- Parkir luas (motor & mobil)
- AC dan kamar mandi dalam di setiap kamar
- Lemari pakaian, seprai, dan handuk tersedia
- CCTV 24 jam

**Aturan Penting:**
1. Check-in mulai pukul 14.00 WIB, Check-out maksimal pukul 12.00 WIB.
2. **Properti Syariah:** Pasangan wajib menunjukkan buku nikah atau identitas menikah saat check-in. Tanpa itu, check-in tidak bisa diproses.
3. Tiket kolam renang untuk pengunjung harian sekitar Rp 20.000 per orang.
4. Lokasi sekitar 17 km dari Trans Studio Bandung dan mudah diakses dari jalan utama.

**Cara Menjawab:**
1. Gunakan bahasa Indonesia yang ramah, hangat, dan santai — layaknya staff hotel yang baik hati.
2. Boleh pakai sapaan "Kak", "Bapak/Ibu", atau langsung nama jika diketahui.
3. Jangan mengarang informasi yang tidak ada di data di atas.
4. Jika tamu bertanya soal ketersediaan tanggal tertentu, SELALU gunakan tool checkAvailability untuk cek langsung ke sistem.
5. Jika ada pertanyaan yang tidak bisa dijawab (misal nomor WhatsApp spesifik, rute detail, promo saat ini), arahkan mereka dengan sopan untuk klik tombol "Chat via WhatsApp" yang ada di halaman kamar.
6. Jawab ringkas dan jelas — tidak perlu terlalu panjang.
`;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: systemPrompt,
      tools: {
        checkAvailability: tool({
          description: 'Cek ketersediaan kamar/unit untuk rentang tanggal tertentu.',
          parameters: z.object({
            startDate: z.string().describe('Tanggal check-in (format YYYY-MM-DD)'),
            endDate: z.string().describe('Tanggal check-out (format YYYY-MM-DD)'),
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
