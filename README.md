# UpLink — Job Board Platform

A full-stack MERN job board built with Next.js 14 App Router. Connects job seekers with employers through a clean, SEO-optimized interface.

## Tech Stack
Next.js 14 · MongoDB · NextAuth.js v5 · TanStack Query · React Hook Form · Zod · Tailwind CSS · Framer Motion · Cloudinary · Resend · Tiptap · react-pdf · Zustand · Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# Run development server
npm run dev
```

## Reference Files
- `jobboard_overview.md` — full project context
- `uplink_structure.md` — folder layout and API routes
- `uplink_schema.json` — MongoDB schema reference
- `uplink_workflow.md` — implementation workflow phases

## Project Structure
- `app/` — Next.js App Router pages and API routes
- `components/` — all React components
- `lib/` — server utilities (db, auth, cloudinary, resend)
- `models/` — Mongoose models
- `schemas/` — Zod validation schemas
- `hooks/` — TanStack Query custom hooks
- `store/` — Zustand global state
- `middleware.js` — route protection
