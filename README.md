# AI PM Interview Prep

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-blue)

AI-powered interview preparation platform for Product Managers.

Parse job descriptions, upload your resume for personalized questions, practice mock interviews, and receive detailed AI feedback — with your choice of AI provider (Claude, Groq, or OpenRouter).

## Features

- **Job Description Parser** — Paste text or upload PDF/DOCX to extract skills, responsibilities, and requirements
- **Resume Analysis** — Upload your resume (PDF/DOCX) to personalize interview questions to your experience
- **Multiple AI Providers** — Choose between Claude (best quality), Groq (free), or OpenRouter (pay-per-use)
- **Mock Interviews** — Behavioral, product sense, and strategy questions tailored to the role
- **AI Feedback** — Detailed evaluation with score, strengths, weaknesses, and improvement suggestions
- **Progress Tracking** — Dashboard to review past interviews, scores, and answers
- **Authentication** — Supabase Auth with anonymous trial mode (no signup required to try)
- **Rate Limiting** — 5 free analyses/day for anonymous users, unlimited for registered users

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite 7 + React 19 + TypeScript 5.9 + Tailwind CSS v4 |
| State Management | Zustand |
| Backend | Vercel Serverless Functions |
| Database & Auth | Supabase (PostgreSQL + Auth + RLS + Storage) |
| File Processing | PDF.js + Mammoth.js |
| PDF Generation | jsPDF |
| AI: Best Quality | Anthropic Claude Sonnet 4 (paid) |
| AI: Free Tier | Groq — llama-3.3-70b-versatile (14,400 req/day) |
| AI: Pay-per-use | OpenRouter — anthropic/claude-3.5-sonnet |

## Prerequisites

- **Node.js 18+** and npm
- **Supabase account** — free tier works ([supabase.com](https://supabase.com))
- **At least one AI provider API key:**
  - Anthropic ([console.anthropic.com](https://console.anthropic.com)) — requires credits
  - Groq ([console.groq.com](https://console.groq.com)) — free tier available
  - OpenRouter ([openrouter.ai](https://openrouter.ai)) — pay-per-use
- **Vercel account** for deployment (optional)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/RohanSartho/AI_PM-Interview-Prep.git
cd AI_PM-Interview-Prep
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create Supabase project

- Go to [supabase.com](https://supabase.com) and create a new project
- Note your **Project URL** and **anon key** from Settings > API
- Get the **service role key** (keep this secret!)

### 4. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# At least one AI provider key required
ANTHROPIC_API_KEY=your_anthropic_key    # console.anthropic.com
GROQ_API_KEY=your_groq_key              # console.groq.com (FREE)
OPENROUTER_API_KEY=your_openrouter_key  # openrouter.ai
```

### 5. Initialize Supabase

```bash
npx supabase init
npx supabase link --project-ref your_project_ref
npx supabase db push
```

### 6. Generate TypeScript types

```bash
npx supabase gen types typescript --project-id your_project_ref > src/types/supabase.ts
```

### 7. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## AI Provider Setup

### Option 1: Groq (Recommended for Testing — FREE)

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create API key (instant approval)
3. Free tier: 14,400 requests/day
4. Model: `llama-3.3-70b-versatile`

### Option 2: Anthropic Claude (Best Quality — PAID)

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Add payment method and purchase credits ($5 minimum)
3. Create API key
4. Model: `claude-sonnet-4-20250514`
5. Cost: ~$0.018 per JD analysis, ~$0.25 per full interview

### Option 3: OpenRouter (Flexible — PAY PER USE)

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Add payment method
3. Create API key
4. Model: `anthropic/claude-3.5-sonnet`
5. Only charged for actual usage

## Deployment (Vercel)

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel --prod
```

### 3. Add environment variables

Go to your [Vercel project settings](https://vercel.com) > Environment Variables and add all variables from your `.env` file. Redeploy after adding them.

### 4. Update Supabase redirect URLs

In Supabase Dashboard > Authentication > URL Configuration, add your Vercel URL to both **Site URL** and **Redirect URLs**.

## How to Use

### Anonymous Users (5 free analyses/day)

1. Visit the home page
2. Click **New Interview**
3. Select AI provider (Groq recommended for free tier)
4. Paste a job description or upload a PDF/DOCX
5. Optionally upload your resume for personalized questions
6. Configure question count (5–10)
7. Click **Analyze & Generate Questions**
8. Answer each question
9. Review AI feedback with scores and suggestions

### Registered Users (Unlimited)

1. Sign up with email/password
2. Same flow as above, with no rate limits
3. Access the **Dashboard** to review past interviews
4. Click **Review** to revisit any completed session
5. Edit and resubmit answers to improve scores

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |

## Project Structure

```
AI-PM-Interview-Prep/
├── api/                          # Vercel serverless functions
│   ├── parse-jd.ts               # JD parsing endpoint
│   ├── generate-interview.ts     # Question generation endpoint
│   └── submit-answer.ts          # Answer evaluation endpoint
├── lib/
│   └── server/                   # Shared server utilities
│       ├── auth.ts               # Session validation & rate limiting
│       ├── llmService.ts         # Multi-LLM abstraction layer
│       └── rateLimitStore.ts     # In-memory rate limiter
├── src/
│   ├── components/
│   │   ├── auth/                 # AuthGuard
│   │   ├── interview/            # QuestionCard, InterviewSession, QuestionDropdown
│   │   ├── jd-parser/            # JD analysis display
│   │   ├── layout/               # Header, Layout
│   │   ├── ui/                   # LLMProviderSelect, LoadingSpinner
│   │   └── upload/               # FileUpload
│   ├── pages/                    # Home, Login, Dashboard, JDParser, Interview
│   ├── stores/                   # Zustand stores (auth, JD, interview)
│   ├── lib/                      # Supabase client, API helpers
│   ├── types/                    # TypeScript types & Supabase generated types
│   └── utils/                    # File parsing, PDF generation, rate limiting
├── supabase/
│   └── migrations/               # Database schema
└── public/                       # Static assets
```

## Contributing

Contributions welcome! Please open an issue first to discuss proposed changes.

## Support

For issues or questions:
- [Open a GitHub issue](https://github.com/RohanSartho/AI_PM-Interview-Prep/issues)
- Email: your-email@example.com
