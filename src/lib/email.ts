import { Resend } from 'resend';

// Only instantiate Resend if the API key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Replace this with the email you registered on Resend for testing
// Since we don't have a verified domain yet, Resend can only send TO this specific email
const ADMIN_EMAIL = 'admin@damarglamping.com'; // Adjust this if needed, or use a hardcoded testing email

export async function sendBookingConfirmationEmail(booking: any, unitName: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping confirmation email to guest.");
    return;
  }

  const checkIn = new Date(booking.checkIn).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const total = `Rp ${booking.totalPrice.toLocaleString('id-ID')}`;

  try {
    await resend.emails.send({
      from: 'Damar Retreats <onboarding@resend.dev>', // Default Resend test email
      to: booking.guestEmail, // NOTE: If domain isn't verified, this will ONLY work if guestEmail == your resend account email
      subject: `Reservasi Terkonfirmasi - ${unitName}`,
      html: `
        <div style="font-family: sans-serif; color: #222120; max-w-lg; margin: 0 auto; padding: 20px;">
          <h1 style="color: #131211; font-weight: normal;">Booking Confirmed!</h1>
          <p>Halo <strong>${booking.guestName}</strong>,</p>
          <p>Terima kasih telah memilih Damar Retreats. Reservasi Anda untuk <strong>${unitName}</strong> telah berhasil kami konfirmasi.</p>
          
          <div style="background-color: #f7f6f2; padding: 20px; border: 1px solid #e5e3dc; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #73716d;">Detail Booking</p>
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${checkIn}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${checkOut}</p>
            <p style="margin: 5px 0;"><strong>Total:</strong> ${total}</p>
          </div>

          <p>Tim kami akan menghubungi Anda melalui WhatsApp di nomor <strong>${booking.guestPhone}</strong> menjelang hari kedatangan untuk koordinasi.</p>
          <p>Sampai jumpa di alam,<br>Tim Damar Retreats</p>
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
    await resend.emails.send({
      from: 'Damar System <onboarding@resend.dev>',
      to: ADMIN_EMAIL, // Must be the email registered on Resend if domain is not verified
      subject: `[Booking Baru] ${booking.guestName} - ${unitName}`,
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
