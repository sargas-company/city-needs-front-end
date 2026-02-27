# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Admin panel for the City Needs mobile app. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Manages business listings, verification approvals, and user administration.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (ESLint 9 flat config)
```

## Architecture

### Tech Stack
- Next.js 16 with App Router
- Firebase Authentication (admin-only access)
- Axios with automatic token refresh
- Tailwind CSS 4

### Directory Structure
```
app/
├── components/          # Shared UI components
├── context/             # React Context providers (AuthContext)
├── login/               # Login page
├── business-approval/   # Business verification workflow
│   └── [id]/            # Individual business detail page
└── stats/               # Statistics dashboard
lib/
├── api/                 # API functions organized by domain
│   ├── index.ts         # Barrel exports
│   ├── business.api.ts  # Business CRUD operations
│   ├── verifications.api.ts
│   ├── statistics.api.ts
│   └── auth.api.ts
├── axios.ts             # Configured Axios instance with interceptors
├── firebase.ts          # Firebase initialization
└── auth.ts              # Auth utilities (token management)
hooks/
└── useInfiniteScroll.ts # Cursor-based pagination hook
```

### Key Patterns

**Authentication Flow**: Firebase Auth → token stored in localStorage → AuthContext provides user state → automatic redirect to /login for unauthenticated users. Only ADMIN role users are allowed access.

**API Layer**: All API calls go through `lib/axios.ts` which handles:
- Bearer token injection
- Automatic 401 token refresh via Firebase
- Request queuing during token refresh

**Infinite Scroll**: `useInfiniteScroll<T>` hook provides cursor-based pagination with IntersectionObserver. Used on main listing pages with debounced search (500ms, min 3 chars).

**Page Structure**: Pages use `DashboardLayout` wrapper which includes `Sidebar` and handles loading states.

### Environment Variables

Required (see `.env.example`):
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_*` - Firebase config
- `NEXT_PUBLIC_S3_BUCKET_HOSTNAME` - For image optimization

### Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`)