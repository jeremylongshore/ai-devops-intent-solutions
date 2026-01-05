/**
 * Next.js Template Pack
 * Templates optimized for Next.js applications
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const NEXTJS_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'nextjs-prd',
      name: 'Next.js Product Requirements',
      description: 'PRD template optimized for Next.js applications with App Router',
      version: '1.0.0',
      category: 'product',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['nextjs', 'react', 'frontend', 'prd'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
      { name: 'projectDescription', label: 'Description', type: 'text', required: true },
      { name: 'routerType', label: 'Router Type', type: 'select', options: [
        { label: 'App Router (Next.js 13+)', value: 'app' },
        { label: 'Pages Router (Legacy)', value: 'pages' },
      ], default: 'app' },
      { name: 'rendering', label: 'Rendering Strategy', type: 'multiselect', options: [
        { label: 'Server Components (RSC)', value: 'rsc' },
        { label: 'Client Components', value: 'client' },
        { label: 'Static Site Generation (SSG)', value: 'ssg' },
        { label: 'Server-Side Rendering (SSR)', value: 'ssr' },
        { label: 'Incremental Static Regeneration (ISR)', value: 'isr' },
      ]},
      { name: 'features', label: 'Features', type: 'multiselect', options: [
        { label: 'Authentication', value: 'auth' },
        { label: 'Database', value: 'database' },
        { label: 'API Routes', value: 'api' },
        { label: 'Internationalization', value: 'i18n' },
        { label: 'Dark Mode', value: 'darkmode' },
        { label: 'PWA Support', value: 'pwa' },
        { label: 'Analytics', value: 'analytics' },
      ]},
      { name: 'deployment', label: 'Deployment Target', type: 'select', options: [
        { label: 'Vercel', value: 'vercel' },
        { label: 'AWS Amplify', value: 'amplify' },
        { label: 'Cloudflare Pages', value: 'cloudflare' },
        { label: 'Docker/Kubernetes', value: 'docker' },
        { label: 'Self-hosted', value: 'self' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Product Overview',
        order: 1,
        content: `# {{projectName}}

## Overview
{{projectDescription}}

### Technology Stack
- **Framework:** Next.js 14+ ({{routerType}} Router)
- **Rendering:** {{join rendering ", "}}
- **Deployment:** {{deployment}}

### Key Features
{{#each features}}
- {{this}}
{{/each}}`,
      },
      {
        id: 'architecture',
        title: 'Technical Architecture',
        order: 2,
        content: `## Technical Architecture

### Project Structure
\`\`\`
{{projectName}}/
├── app/                    # App Router pages
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # UI primitives
│   └── features/          # Feature components
├── lib/
│   ├── actions/           # Server actions
│   ├── db/                # Database client
│   └── utils/             # Utilities
├── public/                # Static assets
└── styles/                # Global styles
\`\`\`

### Rendering Strategy
{{#if rendering}}
{{#each rendering}}
{{#if (equals this "rsc")}}
- **Server Components:** Default for data fetching, reduce client bundle
{{/if}}
{{#if (equals this "client")}}
- **Client Components:** Interactive UI, hooks, browser APIs
{{/if}}
{{#if (equals this "ssg")}}
- **Static Generation:** Pre-render at build time for static pages
{{/if}}
{{#if (equals this "ssr")}}
- **Server Rendering:** Dynamic content per request
{{/if}}
{{#if (equals this "isr")}}
- **ISR:** Revalidate static pages on interval
{{/if}}
{{/each}}
{{/if}}`,
      },
      {
        id: 'routes',
        title: 'Routes & Pages',
        order: 3,
        content: `## Routes & Pages

### Public Routes
| Route | Page | Rendering |
|-------|------|-----------|
| / | Home | SSG |
| /about | About | SSG |
| /pricing | Pricing | SSG |
| /blog | Blog List | ISR |
| /blog/[slug] | Blog Post | SSG |

{{#if (contains features "auth")}}
### Auth Routes
| Route | Page | Rendering |
|-------|------|-----------|
| /login | Login | Client |
| /signup | Sign Up | Client |
| /forgot-password | Password Reset | Client |
| /verify-email | Email Verification | Client |
{{/if}}

### Protected Routes
| Route | Page | Rendering |
|-------|------|-----------|
| /dashboard | Dashboard | SSR |
| /settings | User Settings | SSR |
| /profile | User Profile | SSR |`,
      },
      {
        id: 'api',
        title: 'API Routes',
        order: 4,
        condition: { variable: 'features', operator: 'contains', value: 'api' },
        content: `## API Routes

### Route Handlers (App Router)
\`\`\`typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  // Handle GET request
}

export async function POST(request: Request) {
  // Handle POST request
}
\`\`\`

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/users | GET | List users |
| /api/users | POST | Create user |
| /api/users/[id] | GET | Get user |
| /api/users/[id] | PATCH | Update user |
| /api/users/[id] | DELETE | Delete user |

### Server Actions
For mutations, prefer Server Actions over API routes:
\`\`\`typescript
// lib/actions/users.ts
'use server'

export async function createUser(formData: FormData) {
  // Direct database access, no API call
}
\`\`\``,
      },
      {
        id: 'auth',
        title: 'Authentication',
        order: 5,
        condition: { variable: 'features', operator: 'contains', value: 'auth' },
        content: `## Authentication

### Auth Provider
Recommended: NextAuth.js v5 (Auth.js)

### Implementation
\`\`\`typescript
// auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Credentials],
})
\`\`\`

### Protected Routes
\`\`\`typescript
// app/(dashboard)/layout.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')
  return <>{children}</>
}
\`\`\`

### Middleware Protection
\`\`\`typescript
// middleware.ts
export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*']
}
\`\`\``,
      },
      {
        id: 'database',
        title: 'Database',
        order: 6,
        condition: { variable: 'features', operator: 'contains', value: 'database' },
        content: `## Database

### Recommended Stack
- **ORM:** Prisma or Drizzle
- **Database:** PostgreSQL (Neon/Supabase) or PlanetScale (MySQL)
- **Caching:** Redis (Upstash)

### Prisma Setup
\`\`\`typescript
// lib/db/index.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
\`\`\`

### Data Fetching
\`\`\`typescript
// app/users/page.tsx
import { prisma } from '@/lib/db'

export default async function UsersPage() {
  const users = await prisma.user.findMany()
  return <UserList users={users} />
}
\`\`\``,
      },
      {
        id: 'deployment',
        title: 'Deployment',
        order: 7,
        content: `## Deployment

### {{deployment}} Configuration

{{#if (equals deployment "vercel")}}
#### Vercel Setup
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

\`\`\`json
// vercel.json
{
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
\`\`\`
{{/if}}

{{#if (equals deployment "docker")}}
#### Docker Setup
\`\`\`dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`
{{/if}}

### Environment Variables
\`\`\`env
# .env.local
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
\`\`\``,
      },
    ],
  },
  {
    meta: {
      id: 'nextjs-architecture',
      name: 'Next.js Architecture Document',
      description: 'Technical architecture document for Next.js applications',
      version: '1.0.0',
      category: 'technical',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      tags: ['nextjs', 'architecture', 'technical'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
      { name: 'scale', label: 'Expected Scale', type: 'select', options: [
        { label: 'Small (< 10k users)', value: 'small' },
        { label: 'Medium (10k-100k users)', value: 'medium' },
        { label: 'Large (100k+ users)', value: 'large' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Architecture Overview',
        order: 1,
        content: `# {{projectName}} Architecture

## System Overview
This document describes the technical architecture for {{projectName}}, a Next.js application designed for {{scale}} scale.

## Architecture Principles
1. Server-first rendering
2. Progressive enhancement
3. Edge-ready deployment
4. Type safety throughout`,
      },
      {
        id: 'components',
        title: 'Component Architecture',
        order: 2,
        content: `## Component Architecture

### Component Categories

#### Server Components (Default)
- Data fetching
- Access backend resources
- Keep sensitive info on server
- Reduce client bundle

#### Client Components
- Interactivity (onClick, onChange)
- State management (useState, useEffect)
- Browser APIs
- Custom hooks

### Composition Pattern
\`\`\`tsx
// Server Component wrapping Client Component
// app/dashboard/page.tsx
import { getUser } from '@/lib/data'
import { Dashboard } from '@/components/dashboard'

export default async function DashboardPage() {
  const user = await getUser() // Server-side fetch
  return <Dashboard user={user} /> // Pass to client
}
\`\`\``,
      },
      {
        id: 'caching',
        title: 'Caching Strategy',
        order: 3,
        content: `## Caching Strategy

### Request Memoization
Automatic deduplication within a single render pass.

### Data Cache
\`\`\`typescript
// Cached by default
const data = await fetch('/api/data')

// Opt out of caching
const data = await fetch('/api/data', { cache: 'no-store' })

// Revalidate every hour
const data = await fetch('/api/data', { next: { revalidate: 3600 } })
\`\`\`

### Full Route Cache
- Static routes cached at build time
- Dynamic routes cached on first request
- Invalidate with revalidatePath() or revalidateTag()

### Router Cache
Client-side cache for prefetched routes (30s default).`,
      },
    ],
  },
  {
    meta: {
      id: 'nextjs-testing',
      name: 'Next.js Testing Strategy',
      description: 'Testing strategy and implementation guide for Next.js',
      version: '1.0.0',
      category: 'testing',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['nextjs', 'testing', 'jest', 'playwright'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
    ],
    sections: [
      {
        id: 'strategy',
        title: 'Testing Strategy',
        order: 1,
        content: `# {{projectName}} Testing Strategy

## Testing Pyramid
- **E2E Tests:** 10% - Critical user flows
- **Integration:** 30% - Component interactions
- **Unit Tests:** 60% - Business logic

## Tools
- **Unit/Integration:** Vitest + React Testing Library
- **E2E:** Playwright
- **Visual:** Chromatic (Storybook)`,
      },
      {
        id: 'unit',
        title: 'Unit Testing',
        order: 2,
        content: `## Unit Testing

### Setup
\`\`\`typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
\`\`\`

### Component Test Example
\`\`\`typescript
// components/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })
})
\`\`\``,
      },
      {
        id: 'e2e',
        title: 'E2E Testing',
        order: 3,
        content: `## E2E Testing with Playwright

### Setup
\`\`\`typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
})
\`\`\`

### E2E Test Example
\`\`\`typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign in', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
})
\`\`\``,
      },
    ],
  },
];

export default NEXTJS_TEMPLATES;
