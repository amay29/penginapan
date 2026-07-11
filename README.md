# Damar Retreats Reservation System

A premium, full-stack Progressive Web Application (PWA) designed to elevate the boutique hospitality and glamping experience. Built specifically for **Damar Retreats**, this platform seamlessly integrates an immersive storefront, a smart booking engine, a real-time AI Concierge, and a comprehensive administrative dashboard into a single, cohesive system.

---

## 🌟 Key Features

### 🏕️ Immersive Storefront & Booking Flow
* **Premium Aesthetics:** A minimalist, nature-inspired UI crafted specifically for boutique hotels and exclusive retreats.
* **Smart Booking Engine:** Multi-step reservation process with real-time calendar availability checking and automated price calculations.
* **Responsive Design:** Flawless experience across desktop, tablet, and mobile devices.

### 🤖 AI Virtual Concierge (Gemini-Powered)
* **Real-Time Data Access:** The AI is dynamically connected to the CMS. If prices or amenities are updated in the admin panel, the AI knows instantly.
* **Live Availability Checking:** Powered by advanced Function Calling. Guests can ask *"Is the A-Frame Cabin available on August 15th?"* and the AI will check the database in real-time to provide accurate answers.
* **Context-Aware Assistance:** Understands property rules, handles FAQ, and gracefully redirects complex inquiries to human staff via WhatsApp.

### 💼 Comprehensive Admin CMS
* **Space Management:** Create, edit, and delete glamping units. Update pricing, capacities, and amenities without touching code.
* **Booking Dashboard:** Track all incoming reservations, view guest details, and manage booking statuses (Pending, Confirmed, Cancelled).
* **AI Copywriting Assistant:** Built-in generative AI tool in the CMS to automatically craft poetic, compelling promotional copy for newly added spaces.

### 📧 Automated Email Notifications
* **Guest Confirmations:** Automatically sends beautiful HTML booking confirmations to guests upon reservation.
* **Admin Alerts:** Instantly notifies the property management team whenever a new booking is created.

---

## 🛠️ Tech Stack

* **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router, React Server/Client Components)
* **Styling:** Vanilla CSS (Tailored token system, premium dark/glassmorphic aesthetics)
* **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Secure Admin login)
* **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) & Google Gemini (1.5 Flash)
* **Mailing:** [Resend](https://resend.com/)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* PostgreSQL Database

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amay29/penginapan.git
   cd penginapan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and define the following variables:
   ```env
   # Database connection
   DATABASE_URL="postgresql://user:password@localhost:5432/damar"

   # NextAuth Setup
   NEXTAUTH_SECRET="generate-a-secure-random-string"
   NEXTAUTH_URL="http://localhost:3000"

   # External APIs
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   RESEND_API_KEY="your-resend-api-key"
   ```

4. **Run Prisma Migrations & Generate Client:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. To access the Admin Panel, navigate to `/admin/login`.

### Building for Production

To create an optimized production build:
```bash
npm run build
npm start
```

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
