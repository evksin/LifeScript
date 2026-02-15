<p align="center">
  <a href="https://life-script-swart.vercel.app " target="_blank">
    <img src="https://img.shields.io/badge/Try%20LifeScript-Live%20Demo-blue?style=for-the-badge"/>
  </a>
</p>

# LifeScript 🧬  
Your personal life operating system — built for AI-powered productivity.

LifeScript is a modern web platform designed to help you store, organize and evolve your life data — notes, thoughts, and soon goals, habits and AI insights.

---

## 🚀 What is LifeScript?

LifeScript is a foundation for a **personal life OS**.

Think of it as:
- Notion for your private thoughts  
- A journal for your mind  
- A backend for future AI assistants  

It is built to become an intelligent layer between **you and your life data**.

---

## 🧠 Why it matters

Most productivity tools are:
- Static  
- Fragmented  
- Not AI-ready  

LifeScript is designed as:
> A structured, queryable, secure database of your life — ready for AI.

---

## ✨ Core features (current)

- 📝 Notes with database storage  
- 🔐 Google OAuth authentication  
- ⚡ Fast modern web app  
- 🧠 Prisma-powered data layer  
- ☁️ Cloud-ready architecture  

---

## 🛠 Tech Stack

- **Next.js 14 (TypeScript, App Router)**
- **Prisma ORM**
- **NeonDB (PostgreSQL)**
- **Google OAuth**
- **Vercel**

---

## ⚙️ Quick Start

### 1) Install dependencies
```bash
npm install
2) Environment variables
Create .env.local:

DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
AUTH_SECRET="..."
Generate AUTH_SECRET:

openssl rand -base64 32
3) Database setup
npx prisma generate
npm run db:migrate
npm run db:seed
4) Run
npm run dev
Open http://localhost:3000

☁️ Deploy to Vercel
Push to GitHub

Import repo in Vercel

Add DATABASE_URL as env variable

Deploy

📂 Project structure
app/
lib/
prisma/
.env.example
vercel.json
🧠 Data model
Note

id (UUID)

title (String)

createdAt (DateTime)

This is the core of your life database.

🎯 Who is this for?
LifeScript is for:

Builders

Founders

Thinkers

Anyone who wants an AI-augmented life system

👨‍💻 Author
Built by evksin
Telecommunications engineer & AI-focused developer
