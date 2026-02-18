# AI PM Interview Prep

AI-powered product manager interview preparation tool. Paste a job description, get it analyzed, and practice with tailored mock interview questions evaluated by AI.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS v4 + Zustand
- **Backend:** Vercel Serverless Functions
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** Anthropic Claude Sonnet 4.5

## Features

- JD parsing with AI-powered skill/responsibility extraction
- Optional resume upload for personalized analysis
- Mock interview generation (behavioral, technical, mixed)
- AI-powered answer evaluation with scoring and feedback
- Anonymous access with rate limiting (5/day) + unlimited for signed-up users

## Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/RohanSartho/AI_PM-Interview-Prep.git
   cd AI_PM-Interview-Prep
   npm install
   ```

2. **Create `.env`** from the template:
   ```bash
   cp .env.example .env
   ```
   Fill in the values:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
   - `ANTHROPIC_API_KEY` - Anthropic API key

3. **Set up Supabase:**
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
  components/   # Reusable UI components
  lib/          # Supabase client, API helpers
  pages/        # Route pages (Home, Login, Dashboard, JDParser, Interview)
  stores/       # Zustand stores (auth, JD, interview)
  types/        # TypeScript types and Supabase generated types
  utils/        # File parsing, PDF generation, rate limiting
api/            # Vercel serverless functions
supabase/       # Migrations
```
