# The Little Pots ✉️🏺

A vintage parchment postal text exchange for strangers. Vent out, cast your words like a message in a bottle, and have it randomly delivered to another soul across the globe for advice or shared resonance.

---

## 📜 Features
- **Parchment Postal Aesthetic**: Vintage typewriter typography (`Courier Prime`, `Playfair Display`), postage stamps, postmarks, and wax seals.
- **Cast a Pot (Venting Desk)**: Write your thoughts, pick your postal stamp, and seal it for random delivery.
- **Pots Shelf & Inbox**: Read letters delivered to your care and reply to spark a 1-on-1 connection.
- **My Profile & Ledger**: Keep track of all pots you've cast, replies received, and customizable anonymous wanderer handles.
- **Persona Switcher**: Seamlessly test bidirectional messaging between strangers right from your browser without needing multiple accounts.
- **Optional Mechanical Audio**: Subtle typewriter key clicks while typing your letter.
- **100% Free Tier Stack**: Zero paywalls, zero hosting cost.

---

## 🛠️ Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons + Canvas Confetti
- **Typography**: Courier Prime, Playfair Display, Caveat (Google Fonts)
- **Database / Auth Backend (Free)**: Supabase (PostgreSQL with Row Level Security)
- **Hosting (Free)**: Vercel / Cloudflare Pages / GitHub Pages

---

## 🚀 Running Locally

1. Navigate to the project folder:
   ```bash
   cd the-little-pots
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open your browser at the displayed local URL (typically `http://localhost:5173`).

---

## 🌐 100% Free Web Hosting Instructions

### Step 1: Push to GitHub
1. Create a free repository on [GitHub](https://github.com).
2. Inside `the-little-pots`, initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of The Little Pots"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/the-little-pots.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Select your `the-little-pots` repository.
4. Keep the default settings (Framework: Vite, Build Command: `npm run build`, Output Directory: `dist`).
5. Click **Deploy**. Your site will be live on a free `.vercel.app` URL with automatic SSL!

### Step 3: (Optional) Connect Free Supabase Database
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Paste the contents of `supabase-schema.sql` and click **Run**.
4. In your Vercel project dashboard, add these Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
