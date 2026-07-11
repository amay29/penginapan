# Damar Retreats

A boutique glamping and cabin reservation system, built to feel premium, natural, and effortless.

This project is a full-stack Next.js web application designed specifically for boutique hospitality. It includes an immersive public-facing storefront for guests to explore units, an AI-powered concierge for instant answers, and a secure admin dashboard to manage everything behind the scenes.

## Features

- **Immersive Storefront**: Minimalist, premium UI tailored for boutique hotels and nature retreats.
- **Smart Booking Flow**: Seamless multi-step reservation process with real-time calendar availability.
- **AI Virtual Concierge**: Integrated Google Gemini AI that knows your live property data and checks availability instantly.
- **Admin CMS**: Dashboard to manage spaces, adjust pricing, and track guest bookings.
- **Automated Emails**: Booking confirmations and admin notifications handled via Resend.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Integration**: Vercel AI SDK + Google Gemini
- **Styling**: Tailwind CSS + Lucide Icons
- **Mailing**: Resend

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/amay29/penginapan.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables (create a `.env` file):
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-key"
   RESEND_API_KEY="your-resend-key"
   ```

4. Push the database schema:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. To access the CMS, navigate to `/admin`.

## License
MIT
