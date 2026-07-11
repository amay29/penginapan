import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ADMIN_EMAIL = 'admin@rosaglamping.com'; 

export async function sendBookingConfirmationEmail(booking: any, unitName: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping confirmation email to guest.");
    return;
  }

  const checkIn = new Date(booking.checkIn).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const total = `Rp ${booking.totalPrice.toLocaleString('id-ID')}`;

  try {
    const data = await resend.emails.send({
      from: 'Rosa Glamping <onboarding@resend.dev>',
      to: booking.guestEmail,
      subject: `Konfirmasi Reservasi Rosa Glamping - ${booking.id.slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; color: #222120; max-w-lg; margin: 0 auto; padding: 20px;">
          <h1 style="color: #131211; font-weight: normal;">Booking Confirmed!</h1>
          <p>Halo <strong>${booking.guestName}</strong>,</p>
          <p>Terima kasih telah memilih Rosa Glamping & Pool. Reservasi Anda untuk <strong>${unitName}</strong> telah berhasil kami konfirmasi.</p>
          
          <div style="background-color: #f7f6f2; padding: 20px; border: 1px solid #e5e3dc; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #73716d;">Detail Booking</p>
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${checkIn}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${checkOut}</p>
            <p style="margin: 5px 0;"><strong>Total:</strong> ${total}</p>
          </div>

          <p>Tim kami akan menghubungi Anda melalui WhatsApp di nomor <strong>${booking.guestPhone}</strong> menjelang hari kedatangan untuk koordinasi.</p>
          <p>Sampai jumpa di alam,<br>Tim Rosa Glamping & Pool</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send guest email:", error);
  }
}

export async function sendAdminNotificationEmail(booking: any, unitName: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping notification email to admin.");
    return;
  }

  const total = `Rp ${booking.totalPrice.toLocaleString('id-ID')}`;

  try {
    const data = await resend.emails.send({
      from: 'Rosa Glamping <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `[NEW BOOKING] ${unitName} - ${booking.guestName}`,
      html: `
        <div style="font-family: sans-serif; color: #222120;">
          <h2>Ada Booking Baru! 🎉</h2>
          <ul>
            <li><strong>Tamu:</strong> ${booking.guestName}</li>
            <li><strong>Email:</strong> ${booking.guestEmail}</li>
            <li><strong>WhatsApp:</strong> ${booking.guestPhone}</li>
            <li><strong>Unit:</strong> ${unitName}</li>
            <li><strong>Total:</strong> ${total}</li>
          </ul>
          <p>Silakan buka <a href="http://localhost:3000/admin/bookings">Dashboard Admin</a> untuk melihat detail.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin email:", error);
  }
}

export async function sendPoolTicketEmail(ticket: any) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping ticket email to guest.");
    return;
  }

  const visitDate = new Date(ticket.visitDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const total = `Rp ${ticket.totalPrice.toLocaleString('id-ID')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.qrCode}`;

  try {
    await resend.emails.send({
      from: 'Rosa Glamping <onboarding@resend.dev>',
      to: ticket.guestEmail,
      subject: `E-Tiket Kolam Renang Rosa - ${ticket.id.slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; color: #222120; max-w-lg; margin: 0 auto; padding: 20px;">
          <h1 style="color: #131211; font-weight: normal; text-align: center;">E-Tiket Rosa Swimming Pool</h1>
          <p>Halo <strong>${ticket.guestName}</strong>,</p>
          <p>Terima kasih. Pembelian tiket kolam renang Anda telah berhasil dikonfirmasi. Harap tunjukkan QR Code di bawah ini kepada petugas kolam saat kedatangan.</p>
          
          <div style="background-color: #f7f6f2; padding: 20px; border: 1px solid #e5e3dc; margin: 20px 0; text-align: center;">
            <img src="${qrUrl}" alt="QR Code Tiket" style="margin-bottom: 15px;" />
            <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #73716d;">Detail Tiket</p>
            <p style="margin: 5px 0;"><strong>Tanggal Kunjungan:</strong> ${visitDate}</p>
            <p style="margin: 5px 0;"><strong>Jumlah:</strong> ${ticket.adultCount} Dewasa, ${ticket.childCount} Anak</p>
            <p style="margin: 5px 0;"><strong>Total:</strong> ${total}</p>
            <p style="margin: 15px 0 0 0; font-size: 10px; color: #999;">ID Tiket: ${ticket.id}</p>
          </div>

          <p>Selamat menikmati kesegaran air kolam renang kami!</p>
          <p>Salam hangat,<br>Tim Rosa Glamping & Pool</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send ticket email:", error);
  }
}

