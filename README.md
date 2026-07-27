# Dr. Valerie Pinhas — Long Island Sex Therapy

A professional, SEO-optimized website for Dr. Valerie Pinhas, built with Next.js 15, Payload CMS 3, and Tailwind CSS. Deployed on Vercel with Postgres.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3 (open source, self-hosted, runs inside Next.js)
- **Database**: PostgreSQL (Neon on Vercel)
- **Storage**: Vercel Blob (for images/media in production)
- **Styling**: Tailwind CSS with custom warm & calming design system
- **Fonts**: Inter (sans) + Cormorant Garamond (serif) via next/font
- **Icons**: lucide-react

## Features

- **Blog** with categories, draft/publish workflow, featured images, SEO metadata
- **Services** with individual detail pages and icons
- **Q&A System** — visitors submit questions via a public form; Dr. Pinhas answers them in the admin panel, and answered questions are published on the Answers page
- **Contact form** — messages are stored in the CMS for review
- **CMS-managed pages** — create arbitrary pages from the admin panel
- **SEO** — automatic metadata, Open Graph, sitemap.xml, robots.txt
- **Warm & calming design** — sage/cream/clay color palette, serif headings, generous whitespace
- **Responsive** — mobile-first, with mobile navigation
- **Video-ready** — the Media collection and Vercel Blob storage support video uploads for future use

## Local Development

### Prerequisites

- Node.js 18.20.2+ (Node 22 recommended)
- Docker (for local Postgres)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the local Postgres database:
   ```bash
   docker compose up -d
   ```

   The `.env.example` already has the matching connection string (`postgresql://postgres:postgres@localhost:5432/drpinhas`). Update `PAYLOAD_SECRET` to a random string.

4. Create and run the database migration:
   ```bash
   pnpm migrate:create
   pnpm migrate
   ```

5. Start the dev server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) for the site
7. Open [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS admin panel
8. Create your first admin user at the admin login screen

## Deploying to Vercel

### 1. Push to GitHub
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create a Vercel Project
- Go to [vercel.com](https://vercel.com) and import your GitHub repository
- Vercel will auto-detect Next.js

### 3. Set Up Required Services

**Database (Neon Postgres)**:
- In the Vercel dashboard, go to Storage → Create Database → Neon Postgres
- This gives you a `DATABASE_URI` connection string

**Blob Storage (for media uploads)**:
- In the Vercel dashboard, go to Storage → Create Blob Store
- This gives you a `BLOB_READ_WRITE_TOKEN`

### 4. Set Environment Variables

In your Vercel project settings, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URI` | Your Neon Postgres connection string |
| `PAYLOAD_SECRET` | A random 32+ character string |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `BLOB_READ_WRITE_TOKEN` | Your Vercel Blob token |
| `REVALIDATION_SECRET` | A random string for cache revalidation |

### 5. Deploy
Push to `main` and Vercel will build and deploy automatically.

### 6. Run Migrations on Production
After the first deploy, run:
```bash
vercel env pull .env.production
pnpm migrate
```

## Content Management Guide (for Dr. Pinhas)

### Accessing the Admin Panel
Navigate to `https://your-domain.com/admin` and log in with your credentials.

### Managing Blog Posts
1. Go to **Content → Posts**
2. Click **Create New**
3. Fill in the title, slug (URL), excerpt, and content
4. Optionally add a featured image and category
5. Click **Save Draft** then **Publish** when ready

### Managing Services
1. Go to **Content → Services**
2. Create or edit services with title, description, icon, and detailed content
3. Set the order field to control display order

### Answering Questions
1. Go to **Q&A → Questions**
2. You'll see all submitted questions (drafts = new submissions)
3. Open a question, write your answer in the rich text editor
4. Set status to **Published** to make it visible on the Answers page
5. Toggle **Anonymous** to control whether the submitter's name is shown

### Managing Pages
1. Go to **Content → Pages**
2. Create pages like "Privacy Policy", "FAQ", etc.
3. The slug determines the URL (e.g., slug `privacy` → `/privacy`)

### Updating Site Settings
1. Go to **Settings → Site Settings**
2. Update site name, tagline, description, contact info, social links, etc.

### Managing Navigation
1. Go to **Settings → Navigation**
2. Add, remove, or reorder main navigation and footer links

### Uploading Media
1. Go to **Content → Media**
2. Upload images with alt text for accessibility and SEO
3. Images are automatically optimized in multiple sizes (thumbnail, card, tablet, desktop)

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing pages
│   │   ├── about/
│   │   ├── ask/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── answers/
│   │   ├── services/
│   │   ├── [slug]/           # Dynamic CMS pages
│   │   ├── layout.tsx        # Root layout with header/footer
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── (payload)/            # Payload CMS admin + API
│   │   ├── admin/
│   │   ├── api/
│   │   └── layout.tsx
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # Robots.txt
├── collections/              # Payload collection definitions
│   ├── Users.ts
│   ├── Media.ts
│   ├── Pages.ts
│   ├── Posts.ts
│   ├── Categories.ts
│   ├── Services.ts
│   └── Questions.ts
├── globals/                  # Payload global configs
│   ├── SiteSettings.ts
│   └── Navigation.ts
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── data.ts               # Data fetching functions
│   └── utils.ts              # Utilities
└── payload.config.ts         # Payload configuration
```

## License

This project is proprietary. All rights reserved.
