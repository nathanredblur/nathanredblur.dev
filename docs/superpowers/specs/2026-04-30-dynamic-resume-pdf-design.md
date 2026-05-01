# Dynamic Resume PDF Generation — Design Spec

**Status:** Draft
**Date:** 2026-04-30
**Branch:** `feat/dynamic-resume-pdf`

## 1. Problem

The site currently ships a static, hand-authored PDF (`public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf`) as the author's résumé. Every time work experience, skills, certifications, or education change, the PDF must be re-exported manually and re-uploaded. The résumé content also diverges from the site's own data files (`src/data/experience.ts` only carries prose descriptions suitable for web display, not the structured bullets used in the PDF).

**Goal:** replace the static PDF with three dynamically generated PDF templates, driven by a single source of truth in `src/data/`, regenerated at build time.

## 2. Goals / Non-Goals

### Goals

- One canonical data layer for both the website and the résumé.
- Three PDF templates generated at build time, each optimized for a different audience:
  - **Classic** — replica of the current two-column design with photo and skill bars.
  - **Modern** — minimalist single-column design aligned with the site's aesthetic.
  - **ATS-Friendly** — plain, parser-friendly layout without color, icons, or multi-column structure.
- Generation works both locally (`pnpm generate-resume`) and automatically during CI builds.
- Support diverging web-facing vs résumé-facing descriptions per work experience.

### Non-Goals

- No UI page listing templates; the three PDFs live at predictable URLs under `/resume/` and the site's existing "Resume" link points at one default (Modern).
- No runtime/browser generation. Templates render only in Node at build time.
- No internationalized PDFs in this iteration (English only, matching the current PDF).
- No user-selectable themes for the PDFs beyond the three templates.

## 3. Design

### 3.1 High-level architecture

```
src/data/                       source of truth (TypeScript objects)
  experience.ts                 updated: webDescription + resumeSummary + resumeBullets
  education.ts                  NEW
  certifications.ts             NEW
  technical-proficiency.ts      NEW
  skills.ts                     updated: adds featuredSkills with proficiency
  resume-profile.ts             NEW: résumé-specific contact/summary/title

src/resume/
  templates/
    Classic.tsx                 two-column replica of v2 PDF
    Modern.tsx                  single-column, site-aligned
    AtsFriendly.tsx             one-column plain ATS-optimized
  components/                   shared JSX primitives
  theme.ts                      palettes, type scale, font registration

scripts/
  generate-resume.ts            entrypoint: imports templates + data, writes 3 PDFs

public/resume/                  gitignored build output
  Jonathan_Rico_CV_Classic.pdf
  Jonathan_Rico_CV_Modern.pdf
  Jonathan_Rico_CV_ATS.pdf
```

### 3.2 Library choice: `@react-pdf/renderer`

`@react-pdf/renderer` (react-pdf.org) is chosen over jsPDF.

| Criterion | `@react-pdf/renderer` | `jsPDF` |
|---|---|---|
| Layout | Declarative flexbox, automatic wrapping and pagination | Imperative coordinates; manual line heights and page breaks |
| Readability | JSX components per section | Long imperative scripts |
| Multi-column | Native | Manual x/y math |
| Fit for this use case | ★★★ | ★ (better for simple generated docs like invoices) |

React ships only as a devDependency — it runs in the Node script and never reaches the browser bundle.

### 3.3 Data model

#### `src/data/experience.ts` (modified)

```ts
export interface Experience {
  title: string;
  company: string;
  type?: "React" | "Manager" | "Developer" | "Full-time" | "Freelance";
  duration: string;
  location?: string;
  webDescription: string;   // prose, shown on the site (renamed from `description`)
  resumeSummary: string;    // 1-2 lines about the company, used in the PDF
  resumeBullets: string[];  // achievement/responsibility bullets for the PDF
}
```

All existing 9 entries keep their `webDescription` (current prose). `resumeSummary` + `resumeBullets` are populated from the current PDF for roles 3–9 and derived from `webDescription` for roles 1–2 (Parser, EPAM post-Sep-2024).

**Breaking change:** every read of `experiences[i].description` must be updated to `webDescription`. Current consumers: `src/components/portfolio/*`. These will be updated as part of the migration.

#### `src/data/education.ts` (new)

```ts
export interface Education {
  degree: string;
  institution: string;
  duration: string;
  location?: string;
  notes?: string;
}
export const education: Education[];
```

Seed: `Engineering Technology degree — Institución Universitaria ITM — Jan 2007 - Oct 2009`.

#### `src/data/certifications.ts` (new)

```ts
export interface Certification {
  name: string;
  issuer: string;
  year?: string;
  url?: string;
}
export const certifications: Certification[];
```

Seed: 5 entries from the current PDF (EF SET English B2, Coursera Visual Elements of UI Design, 3× Platzi React/ES6 courses).

#### `src/data/technical-proficiency.ts` (new)

```ts
export interface ProficiencyCategory {
  label: string;
  items: string[];
}
export const technicalProficiency: ProficiencyCategory[];
```

Six categories migrated verbatim from the PDF: Computer Languages, Frontend, Backend, Tools, Quality Engineering, Other.

#### `src/data/skills.ts` (modified)

The existing `skillsData` (flat list), `skillIcons` (SVG map), and `softSkillsData` remain untouched — other site components depend on them.

Adds:

```ts
export interface FeaturedSkill {
  name: string;
  proficiency: number; // 0-100, used by Classic skill bars
}
export const featuredSkills: FeaturedSkill[];
```

#### `src/data/resume-profile.ts` (new)

```ts
export const resumeProfile = {
  fullName: "Jonathan Rico",
  title: "Senior Software Engineer & UX Designer",
  summary: "…",                              // multi-line summary from PDF
  location: "Medellín, CO",
  email: "jon.nathan.rich@gmail.com",
  website: "https://nathanredblur.dev/",
  linkedin: "linkedin.com/in/nathanredblur",
  photo: "/photo-professional.webp",         // referenced by Classic/Modern
};
```

This is deliberately separate from `personalData` (which keeps site-specific values like `"Nathan Rico"` brand name and `nathanredblur@duck.com` email).

### 3.4 Templates

All three templates are thin JSX compositions over shared components (`<Section>`, `<Bullet>`, `<ContactLine>`, `<ExperienceItem>`, `<SkillBar>`). Differences are layout and theme only — data flows identically.

**Classic** — replica of v2 PDF. Two-column: left 65% content (Summary, Technical Proficiency as `Frontend: React, Redux…`, Work Experience, Education, Certifications), right 35% sidebar (photo, contact with icons, skill bars, soft skills). Cyan accent matching v2.

**Modern** — single column. Large name header, compact contact strip (`📍 · 🌐 · ✉ · in`), same section order as Classic but skills rendered as chip grid rather than bars. Accent color derived from `src/config.ts` hue to stay coherent with the site. Sans-serif (Inter via `Font.register`).

**ATS-Friendly** — single column, black text on white, Helvetica 10-11pt, no photo, no icons, no color, no graphics. Section headings in all caps. Technical proficiency as flat `Category: item, item, item` lines. Designed so recruiter ATS parsers extract cleanly.

### 3.5 Build integration

#### `scripts/generate-resume.ts`

1. Imports `Classic`, `Modern`, `AtsFriendly` and all data files.
2. Ensures `public/resume/` exists (mkdir -p).
3. Sequentially calls `await renderToFile(<Template />, outPath)` for each template.
4. Logs file name and size on success.
5. Exits non-zero if any render throws.

Runs via `tsx scripts/generate-resume.ts`.

#### `package.json`

```json
"scripts": {
  "generate-resume": "tsx scripts/generate-resume.ts",
  "build": "pnpm generate-resume && astro check && astro build && pagefind --site dist"
}
```

Chained into `build` rather than hidden behind an Astro integration — explicit and visible. Existing `build` script is extended in place.

#### CI

`.github/workflows/build.yml` already runs `pnpm astro check && pnpm astro build`; switch it to `pnpm build` so résumé generation runs on every push/PR.

#### Git

`public/resume/*.pdf` is added to `.gitignore`. The PDFs are always regenerated from data; committing them would guarantee drift. CI generates them before `astro build`, which copies them into `dist/`, which Cloudflare deploys.

### 3.6 Site integration

- `src/data/personal-data.ts` → `resume: "/resume/Jonathan_Rico_CV_Modern.pdf"`.
- `public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf` is deleted.
- No new components, no new pages. Existing "Resume" download link in the portfolio keeps working against the new URL.

### 3.7 Theming

`src/resume/theme.ts`:

- `classicTheme`, `modernTheme`, `atsTheme` — each exports colors, spacing, type scale.
- `modernTheme` reads the `hue` from `src/config.ts` and derives the accent hex so the Modern résumé always tracks the site's theme color.
- `Font.register` calls (Inter for Modern; Helvetica built-in for ATS; Open Sans or similar for Classic) happen once at template load.

## 4. Data migration

Source content comes from the current PDF (`public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf`). Reconciliations with existing data files:

| Field | Site (current) | PDF | Resolution |
|---|---|---|---|
| Name | `personalData.name` = "Nathan Rico" | "Jonathan Rico" | `resumeProfile.fullName` = "Jonathan Rico"; `personalData` unchanged |
| Title | `personalData.designation` = "Front-End Developer Expert" | "Senior Software Engineer & UX Designer" | Separate fields, no unification |
| Email | `personalData.email` = "nathanredblur@duck.com" | "jon.nathan.rich@gmail.com" | `resumeProfile.email` = professional PDF address |
| Parser (May 2025–Present) | Present in `experience.ts` | Absent from PDF | Bullets derived from existing `webDescription`, presented to user for review |
| EPAM current dates | "Sep 2024 - May 2025" | "Sep 2024" (ongoing at time of PDF export) | Use the updated data-file dates |

Bullets for the 7 older roles are transcribed verbatim from the PDF. Bullets for Parser and updated-EPAM are derived from the existing prose and will be surfaced for user review during implementation.

## 5. File naming

Final filenames (renamed from the current legal-style name for clarity and consistency):

- `public/resume/Jonathan_Rico_CV_Classic.pdf`
- `public/resume/Jonathan_Rico_CV_Modern.pdf`
- `public/resume/Jonathan_Rico_CV_ATS.pdf`

## 6. Testing strategy

The project has no unit test suite. Validation is manual and CI-driven.

1. `pnpm generate-resume` produces three PDFs with expected sizes (non-zero, < ~2 MB each).
2. Each PDF opens in Preview/Chrome and renders the expected sections without layout breakage at A4.
3. ATS template validated via an online ATS parser (e.g., Jobscan free check) to confirm sections are extracted.
4. `pnpm build` completes end-to-end and produces the three PDFs in `dist/resume/`.
5. `pnpm dev` — the existing "Resume" button downloads the Modern PDF.
6. `pnpm check && pnpm lint` — zero warnings.

## 7. Rollout

1. Create `feat/dynamic-resume-pdf` branch. ✅
2. Implement data model changes + update consumers.
3. Implement shared components and three templates.
4. Implement `generate-resume.ts` + wire into `build`.
5. Update CI workflow, `.gitignore`, `personal-data.ts`, delete legacy PDF.
6. Update `CLAUDE.md` with new command and directory locations.
7. Local validation (run all tests above).
8. PR → review → merge to `main`.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| React ships to browser by accident | Keep React in devDependencies only; generation script imported only from `scripts/` and `src/resume/` (never from `src/components/` or `src/pages/`). Guard with a lint rule if needed. |
| `experience.ts` rename breaks pages | Audit all `experiences[i].description` reads before landing the rename; update in the same commit. |
| Cloudflare deploy skips `pnpm build` | Confirmed: CI runs `pnpm build`, which outputs PDFs into `dist/`; Cloudflare deploys `dist/` as-is. |
| PDF generation flaky in CI due to font loading | Register fonts from local files under `src/resume/fonts/` (not remote URLs). |
| Build time inflation | Each PDF renders in < 1s typically; three sequential renders add ≈ 2-3s. Acceptable. |

## 9. Out of scope (future work)

- An interactive `/resume` page with previews and download buttons for all three templates.
- Localized (Spanish) PDF variants.
- Per-role custom bullets inserted conditionally per template (e.g., longer bullets on Classic, shorter on ATS).
- Photo-less Modern variant.
