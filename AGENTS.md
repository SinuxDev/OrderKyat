# AGENTS.md — OrderKyat AI Agent Guide

This file is the authoritative guide for any AI agent (OpenCode, Copilot, Cursor, etc.) working on the OrderKyat codebase. Read it fully before touching any code.

---

## Project Identity

**OrderKyat** is a Myanmar invoice generator. Users paste a raw order message (e.g. from Viber/Facebook chat), the app extracts structured data from it, lets the user review and edit the invoice, then generates a professional PDF — entirely client-side, no account required.

**Production URL**: auto-deployed via Vercel on every push to `master`.  
**Stack**: Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind CSS 3 · Radix UI · Framer Motion · @react-pdf/renderer

---

## Mindset: Think Like a Senior, Design for the Future

Before writing a single line of code, ask yourself these questions:

1. **Will this still make sense when we have 10x the users?**  
   Do not hardcode, do not cut corners on types, do not skip error handling.

2. **Will this break when we add the next feature?**  
   Premium tier, logo upload, multi-template, real AI extraction, and a backend are all planned. Every decision you make today must accommodate them without requiring a rewrite.

3. **Would a junior developer understand this in 6 months?**  
   If not, it needs a comment, better naming, or to be split into smaller pieces.

4. **Is this the right layer for this logic?**  
   Business logic belongs in `lib/`. Side effects belong in `hooks/`. Rendering belongs in `components/`. API contracts belong in `types/`. Never mix these.

5. **Am I adding entropy or reducing it?**  
   Every file you touch should be left cleaner than you found it. Duplication is entropy. Unclear names are entropy. Magic numbers are entropy.

---

## Architecture Rules (Non-Negotiable)

### 1. Type Ownership
| Type | File | Rule |
|------|------|------|
| `InvoiceItem` | `src/types/invoice.ts` | Single source of truth |
| `ExtractedData` | `src/types/invoice.ts` | Single source of truth |
| `DeliveryType` | `src/types/invoice.ts` | Single source of truth |
| `StoreInfo` | `src/types/store.ts` | Single source of truth |

**Never re-declare these types elsewhere.** Always import from `@/types/*`.  
If a component re-exports a type (e.g. `StoreSettings`), it must do so as a pass-through re-export only.

### 2. Layer Boundaries

```
src/lib/          ← Pure functions. Zero React. Zero side effects. Fully testable.
src/hooks/        ← React state + effects. Imports from lib/. Never renders.
src/components/   ← Rendering only. Imports from hooks/ and lib/. No raw business logic.
src/app/          ← Next.js routing + page composition only.
src/types/        ← Type definitions only. No runtime code.
```

**Violations to avoid:**
- Do not call `localStorage` directly inside a component — use a hook.
- Do not compute totals inside JSX — compute in a hook or lib function.
- Do not duplicate logic between a hook and a component — the hook owns it.

### 3. Component Hierarchy (Atomic Design)

```
atoms/      ← Stateless visual primitives (AnimatedBackground, SubtleBackground, AnimatedLogo)
molecules/  ← Single-responsibility interactive units (DeliverySection, InvoiceItemRow, etc.)
organisms/  ← Feature-complete sections combining multiple molecules (InvoiceForm, StoreSettings, etc.)
ui/         ← Radix-based shadcn/ui primitives. DO NOT modify these files.
```

Organisms compose molecules. Molecules compose atoms and `ui/` primitives. Never skip a layer in either direction.

### 4. Logging
All `console.*` calls in `src/` must go through `src/lib/logger.ts`.

```ts
import { logger } from "@/lib/logger";
logger.error("Something failed", error);
```

**Do not use `console.log`, `console.warn`, or `console.error` directly.**  
The logger is dev-only and is the hook point for a future Sentry/PostHog integration — when that day comes, only `logger.ts` needs to change.

### 5. Mobile Detection
Use `useIsMobile()` from `src/hooks/useIsMobile.ts`. Do not implement your own `window.innerWidth` check inline.

### 6. Error Handling
Wrap every major UI section with `<ErrorBoundary>` from `src/components/ErrorBoundary.tsx`.  
The boundary accepts an optional `fallback` prop for custom error UI. The default fallback is intentionally generic.

### 7. Performance
- Heavy components (`InvoiceForm`, `InvoicePDFPreview`, `InvoicePDFDocument`, `PDFViewer`) must be loaded with `next/dynamic` and `ssr: false`.
- Mobile gets simplified backgrounds (no blobs, no `AnimatedBackground`). Always gate expensive animations behind `!isMobile`.
- Use `useMemo` / `useCallback` for anything computed on every render (totals, file names, formatted dates).
- PDF-related packages (`@react-pdf`, `pdfkit`, `fontkit`) are split into their own webpack chunk (`pdf-bundle`). Do not import them at module level in a server-rendered file.

### 8. API Routes
All API routes must validate their request body with Zod before processing. Return `400` on schema failure.  
See `src/app/api/generated-pdf/route.ts` for the canonical example.

### 9. State Persistence (localStorage keys)
| Key | Purpose |
|-----|---------|
| `orderkyat-store-info` | Persisted `StoreInfo` (name, phone, address) |
| `orderkyat-invoice-draft` | Auto-saved `ExtractedData` draft |
| `orderkyat_invoice_counter_<year>` | Sequential invoice number counter |

Do not invent new localStorage keys without documenting them here.

---

## Data Flow (The Golden Path)

```
User pastes text
       │
       ▼
ChatPasteForm (organism)
  → useExtractData() hook
    → extractInvoiceData() in lib/extractors.ts
      → returns ExtractedData
  → calls onExtract(data)
       │
       ▼
page.tsx sets step = "review"
       │
       ▼
InvoiceForm (organism)
  → useInvoiceForm(initialData)   ← form state
  → useAutoSave(...)              ← drafts to localStorage
  → useDraftLoader(...)           ← restore from localStorage
  → useKeyboardShortcuts(...)     ← Ctrl+Enter / Ctrl+S
  → DeliverySection               ← select delivery type + fee
  → GenerateConfirmDialog         ← final review before generating
  → calls onGenerate(data, storeInfo)
       │
       ▼
page.tsx sets step = "preview"
       │
       ▼
InvoicePDFPreview (organism)
  → generateSequentialInvoiceNumber() ← persists counter in localStorage
  → InvoicePDFDocument (molecule)    ← @react-pdf/renderer document
    → pdfStyles from lib/pdfStyles.ts
  → PDFViewer (lazy, ssr:false)      ← browser-embedded preview
  → handleDownload()                 ← pdf().toBlob() → anchor click
```

---

## Testing

**Framework**: Vitest only. No Jest. No Playwright (E2E is manual for now).  
**Scope**: Integration tests for `src/lib/` pure functions only.  
**Location**: `src/lib/__tests__/`  
**Run**: `npm test` (single run) · `npm run test:watch` (watch) · `npm run test:coverage`

### Rules for writing tests
- Only test `src/lib/` functions — they are pure and deterministic.
- Do not test React components with unit tests (hooks + organisms are too coupled to the render cycle to test cheaply).
- If `localStorage` is needed, stub it with `vi.stubGlobal` as shown in `invoiceUtils.test.ts`.
- Describe blocks must map to the function under test. Inner `it` blocks must describe the specific behavior, not the implementation.
- Do not write tests that test implementation details (exact regex patterns, internal variable names). Test behavior: given this input, expect this output.

### Current coverage (36 tests, all passing)
| File | Tests |
|------|-------|
| `lib/extractors.ts` | 19 |
| `lib/invoiceUtils.ts` | 17 |

---

## What Not to Touch

| Area | Reason |
|------|--------|
| `src/components/ui/` | shadcn/ui generated code. Update via CLI, not manually. |
| `src/lib/cities.ts` | Large static list. Do not reformat or sort. |
| `next.config.ts` | Carefully tuned webpack splits + security headers. |
| `tailwind.config.ts` | CSS custom properties wired to shadcn tokens. |

---

## Planned Features (Design With These in Mind)

When adding new code, do not make decisions that break these future capabilities:

| Feature | Impact on your code today |
|---------|--------------------------|
| **Premium tier** | Any feature that should be gated must be easy to wrap in a feature-flag check. |
| **Logo upload** | `StoreInfo` already has a reserved `logo?: string` field. When added, it flows to `InvoicePDFDocument`. |
| **Real AI extraction** | `extractInvoiceData()` in `lib/extractors.ts` will be replaced or augmented. Keep it as a single entry point. Do not call regex logic directly from components. |
| **Multiple invoice templates** | `pdfStyles.ts` and `InvoicePDFDocument` will become template-specific. Architect new PDF changes with this in mind. |
| **Backend / database** | Currently client-side only. Do not add server-side state assumptions. `StoreInfo` and drafts live in `localStorage`. When a backend is added, the hooks will change — not the components. |
| **Sentry / PostHog** | `logger.ts` is the integration point. Do not add direct Sentry imports outside of `logger.ts`. |

---

## Commit & Branch Conventions

- Branch strategy: feature branches → PR → `master` (auto-deploys to Vercel).
- Never push directly to `master`.
- Prefix commits: `feat:` `fix:` `refactor:` `test:` `docs:` `chore:`
- Keep commits atomic — one logical change per commit.
- All TypeScript errors must be zero before committing (`npx tsc --noEmit`).
- All tests must pass before committing (`npm test`).

---

## Quick Reference

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm test              # Run all tests (Vitest)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run lint          # ESLint
npm run analyze       # Bundle analyzer
npx tsc --noEmit      # Type check only
```

---

## File Map

```
src/
├── app/
│   ├── api/generated-pdf/route.ts   ← PDFKit fallback API (Zod-validated)
│   ├── layout.tsx                   ← Root layout, ErrorBoundary, Analytics
│   ├── page.tsx                     ← Page orchestrator, step state machine
│   ├── sitemap.ts                   ← Next.js sitemap route
│   └── robots.ts                    ← Next.js robots route
├── components/
│   ├── ErrorBoundary.tsx            ← React class error boundary
│   ├── LazyComponents.tsx           ← Centralised dynamic() exports
│   ├── atoms/
│   │   ├── AnimatedBackground.tsx   ← Desktop floating orb animation
│   │   ├── AnimatedLogo.tsx         ← Logo with animation
│   │   └── SubtleBackground.tsx     ← Lightweight desktop background
│   ├── molecules/
│   │   ├── AddressCombox.tsx        ← Myanmar city combobox
│   │   ├── CustomerDetailSection.tsx
│   │   ├── DeliverySection.tsx      ← Delivery type select + fee input
│   │   ├── GenerateConfirmDialog.tsx ← Pre-generate confirmation modal
│   │   ├── InvoiceItemRow.tsx
│   │   ├── InvoiceItemSection.tsx
│   │   └── InvoicePDFDocument.tsx   ← @react-pdf Document component
│   ├── organisms/
│   │   ├── ChatPasteForm.tsx        ← Step 1: paste & extract
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── InvoiceForm.tsx          ← Step 2: edit invoice
│   │   ├── InvoicePDFPreview.tsx    ← Step 3: preview & download
│   │   ├── PageHeader.tsx           ← Reusable page header
│   │   ├── PricingCards.tsx
│   │   ├── ProductExplainerModal.tsx
│   │   ├── StoreSettings.tsx        ← Store info modal
│   │   └── TrustSection.tsx
│   └── ui/                          ← shadcn/ui primitives (do not edit)
├── hooks/
│   ├── useConfetti.ts               ← Confetti animation state
│   ├── useExtractData.ts            ← Wraps extractInvoiceData with React state
│   ├── useInvoiceEffects.ts         ← useDraftLoader, useKeyboardShortcuts
│   ├── useInvoiceForm.ts            ← useInvoiceForm, useStoreInfo, useAutoSave
│   └── useIsMobile.ts               ← Single source of truth for mobile detection
├── lib/
│   ├── __tests__/
│   │   ├── extractors.test.ts       ← 19 tests
│   │   └── invoiceUtils.test.ts     ← 17 tests
│   ├── cities.ts                    ← Myanmar city list for address matching
│   ├── extractors.ts                ← Core text → ExtractedData parser
│   ├── invoiceUtils.ts              ← File naming, date formatting, invoice numbers
│   ├── logger.ts                    ← Dev-only logger (Sentry hook point)
│   ├── pdfStyles.ts                 ← @react-pdf StyleSheet definitions
│   ├── performanceMonitor.ts        ← Navigation timing logger
│   └── utils.ts                     ← cn() Tailwind class merger
└── types/
    ├── invoice.ts                   ← InvoiceItem, ExtractedData, DeliveryType
    └── store.ts                     ← StoreInfo
```
