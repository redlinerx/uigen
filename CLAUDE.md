# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language via a chat interface, and an AI agent (Claude) generates React code using tool calls that manipulate a virtual file system. Generated components render in a sandboxed iframe with real-time preview.

## Commands

- `npm run setup` — Install deps, generate Prisma client, run migrations (first-time setup)
- `npm run dev` — Start dev server (Turbopack-enabled, localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint with Next.js rules
- `npm test` — Run Vitest tests (add filename to run a single test, e.g. `npx vitest ChatInterface`)
- `npm run db:reset` — Drop and recreate SQLite database

## Architecture

### Tech Stack
Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Prisma (SQLite) + Vercel AI SDK + Anthropic Claude

### Core Data Flow
```
Chat input → POST /api/chat (streaming) → AI generates tool calls
→ Tool calls update VirtualFileSystem → FileSystem context triggers re-render
→ Babel transforms JSX + builds import map → Sandboxed iframe renders preview
```

### Key Directories
- `src/app/` — Next.js App Router pages and API routes
- `src/actions/` — Server actions (auth, project CRUD) marked with `"use server"`
- `src/components/chat/` — Chat interface (MessageList, MessageInput, ChatInterface)
- `src/components/editor/` — Monaco code editor + virtual file tree
- `src/components/preview/` — Sandboxed iframe preview renderer
- `src/components/ui/` — Shadcn/ui primitives (New York style)
- `src/lib/contexts/` — React Context providers for chat state and file system state
- `src/lib/tools/` — AI tool definitions (str-replace editor, file manager)
- `src/lib/transform/` — Babel JSX transformation + import map generation for preview
- `src/lib/prompts/` — System prompt for Claude's code generation behavior

### State Management
React Context API only (no Redux/Zustand):
- `ChatContext` — AI messages, input state, streaming status
- `FileSystemContext` — Virtual file system operations and current file selection

### Virtual File System (`src/lib/file-system.ts`)
In-memory file system class. Files never touch disk. Serializes to JSON for database storage in `project.data`. The AI agent creates/edits files via tool calls (`str_replace_editor`, `file_manager`).

### Live Preview Pipeline (`src/lib/transform/jsx-transformer.ts`)
Babel transforms JSX to ESM with import maps. Third-party imports resolve via esm.sh CDN. The preview iframe includes Tailwind CDN and an error boundary for runtime/syntax errors.

### Authentication
JWT sessions stored in HTTP-only cookies (jose library). Passwords hashed with bcrypt. Anonymous mode supported — work tracked in localStorage. Middleware protects API routes.

### AI Integration (`src/lib/provider.ts`)
- With `ANTHROPIC_API_KEY` set: Uses Claude Haiku 4.5 via `@ai-sdk/anthropic`
- Without API key: Falls back to `MockLanguageModel` that generates static components

### Database Schema (Prisma + SQLite)
Two models: `User` (email, password) and `Project` (name, messages as JSON string, data as serialized VirtualFileSystem). Projects optionally belong to a user (cascade delete).

## Conventions

- Path alias: `@/*` maps to `src/*`
- Client components use `"use client"` directive; server actions use `"use server"`
- AI-generated components use `@/` import aliases and `/App.jsx` as entry point
- Shadcn/ui components live in `src/components/ui/` — add new ones via `npx shadcn@latest add`
- Tests colocated in `__tests__/` directories next to their components
