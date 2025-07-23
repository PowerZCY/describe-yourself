# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with the "diaomao" template, featuring internationalization, content management via MDX, and authentication via Clerk. The project uses Fumadocs for documentation/blog functionality and is written in TypeScript with TailwindCSS for styling.

## Development Commands

- **Development**: `pnpm dev` (runs predev lint check automatically)
- **Build**: `pnpm build` (includes blog index generation)
- **Production build**: `pnpm build:prod` (skips blog index generation)
- **Linting**: `pnpm lint` (Next.js ESLint with TypeScript and unused imports checking)
- **Blog index generation**: `pnpm generate-blog-index` (must run before builds)
- **Deep clean**: `pnpm d8` or `pnpm deep-clean`
- **Architecture analysis**: `pnpm whoareyou` (generates Next.js architecture overview)

## Key Architecture

### Package Management & Monorepo
- Uses pnpm with custom packages from `@windrun-huaiin/*` namespace
- Transpiles monorepo packages in `next.config.ts`: `@windrun-huaiin/base-ui`, `@windrun-huaiin/third-ui`, `@windrun-huaiin/lib`
- Has a fumadocs-ui patch: `patches/fumadocs-ui@15.3.3.patch`

### Content Management
- **MDX content** stored in `src/mdx/blog/` and `src/mdx/legal/`
- **Fumadocs integration** via `source.config.ts` with custom code transformers
- **Blog system** requires running `generate-blog-index` before builds
- **API routes** at `/api/blog/llm-content` and `/api/legal/llm-content` for MDX content

### Internationalization
- **next-intl** integration with English-only preset from `@windrun-huaiin/lib`
- Locale configuration in `dev-scripts.config.json`
- Messages stored in `messages/en.json`

### Authentication & Routing
- **Clerk** authentication with custom layouts in `src/app/[locale]/(clerk)/`
- **Dynamic routing** with catch-all patterns for blog and legal content
- **Middleware** for internationalization and auth at `src/middleware.ts`

### Custom Development Scripts
- Uses `@windrun-huaiin/dev-scripts` package
- Configuration in `dev-scripts.config.json`
- Includes translation checking, blog generation, and architecture analysis

## Code Style & Standards

- **TypeScript strict mode** enabled
- **ESLint** with unused imports plugin (removes unused imports automatically)
- **Path aliases**: `@/*` maps to `src/*`
- **Code transformers** in source.config.ts for syntax highlighting and math rendering
- Uses Katex for math rendering and Shiki for code highlighting

## Important Notes

- Always run `pnpm generate-blog-index` before building
- The predev hook automatically runs linting
- MDX files are processed through Fumadocs with custom transformers
- Remote images allowed from `favicon.im` and `preview.reve.art`