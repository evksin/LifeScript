🧬 LifeScript

AI-powered Personal Automation Platform

LifeScript is a SaaS-style system for storing, structuring and automating personal knowledge and workflows — powered by AI.

Think of it as a personal operating system for your life, notes and thinking.

🚀 What is LifeScript?

LifeScript is a platform that lets you:

store personal notes and data

structure them with a database

connect them to AI

automate how information becomes actions

It is designed to grow into a second brain + automation engine.

🧠 Why it exists

People have:

notes

ideas

plans

thoughts

documents

But no system that understands and connects them.

LifeScript aims to become an AI-powered memory and control center.

🧩 What it can become

LifeScript is built to evolve into:

AI-powered note system

personal knowledge base

task & goal manager

thinking assistant

automation hub

🛠 Technical foundation

LifeScript is built as a production-ready SaaS backend and frontend.

Technology stack

Next.js 14 (TypeScript, App Router)

Prisma ORM

NeonDB (PostgreSQL)

Vercel (deployment)

⚙️ Quick start
1. Install dependencies
npm install

2. Database setup

Create a database in NeonDB
Copy the connection string
Create .env.local:

DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AUTH_SECRET="your-auth-secret"

Google OAuth setup

Open Google Cloud Console

Create or select a project

Enable Google+ API

Go to Credentials → Create Credentials → OAuth client ID

Choose Web application

Add redirect URIs:

http://localhost:3000/api/auth/callback/google
https://your-domain.vercel.app/api/auth/callback/google


Copy Client ID and Client Secret

Generate AUTH_SECRET
openssl rand -base64 32

3. Prisma setup & migration
npx prisma generate
npm run db:migrate

4. Seed database
npm run db:seed

5. Run project
Development
npm run dev

Production
npm run build
npm start


Open:

http://localhost:3000

🚀 Deploy to Vercel
1. Prepare

Make sure everything is committed to GitHub.

2. Deploy via Vercel CLI
npm i -g vercel
vercel login
vercel

3. Environment variables

In Vercel → Project Settings → Environment Variables
Add:

DATABASE_URL = your NeonDB connection string

4. Deploy via GitHub

Connect the repository to Vercel
Add DATABASE_URL
Vercel will auto-deploy on every push.

📦 Project structure
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── vercel.json

🧠 Data model
Note
Field	Type
id	String (UUID)
title	String
createdAt	DateTime
🛠 Useful commands
npm run dev
npm run build
npm start
npm run db:migrate
npm run db:seed
npm run db:studio

⚠️ Notes

All environment variables must be configured in Vercel

Prisma Client is generated automatically on build

Ensure DATABASE_URL is set in production

🔮 Vision

LifeScript is designed to become a personal AI brain — a system that remembers, understands and helps you think, plan and act.
