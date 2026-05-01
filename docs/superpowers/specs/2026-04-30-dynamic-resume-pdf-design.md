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
- Generation works both locally (`pnpm generate-resume`) and automatically during CI builds and Cloudflare deploys.
- Support diverging web-facing vs résumé-facing descriptions per work experience.

### Non-Goals

- No new Astro route or page. The three PDFs are plain static assets under `public/resume/`; the site's existing "Resume" link points at one default (Modern).
- No runtime/browser generation. Templates render only in Node at build time.
- No internationalized PDFs in this iteration (English only, matching the current PDF).
- No user-selectable themes for the PDFs beyond the three templates.

## 3. Design

### 3.1 High-level architecture

Templates live **outside** `src/` so Astro/Vite never try to process them as pages or islands, and so React stays isolated to the build script.

```
src/data/                       source of truth (TypeScript objects)
  experience.ts                 updated: webDescription + resumeSummary + resumeBullets
  education.ts                  NEW
  certifications.ts             NEW
  technical-proficiency.ts      NEW
  skills.ts                     updated: adds featuredSkills with proficiency
  resume-profile.ts             NEW: résumé-specific contact/summary/title

scripts/resume/                 all PDF code, isolated from the Astro project
  templates/
    Classic.tsx                 two-column replica of v2 PDF
    Modern.tsx                  single-column, site-aligned
    AtsFriendly.tsx             one-column plain ATS-optimized
  components/                   shared JSX primitives
  theme.ts                      palettes, type scale, font registration
  fonts/                        local .ttf files (see §3.7 for licensing)

scripts/generate-resume.ts      entrypoint: imports templates + data, writes 3 PDFs

public/resume/                  gitignored build output
  Jonathan_Rico_CV_Classic.pdf
  Jonathan_Rico_CV_Modern.pdf
  Jonathan_Rico_CV_ATS.pdf
```

Data files live under `src/data/` because they must remain importable from Astro/Svelte components. The build script imports them via the relative path `../src/data/...`, not via Astro path aliases.

### 3.2 Library choice: `@react-pdf/renderer`

`@react-pdf/renderer` (react-pdf.org) is chosen over jsPDF.

| Criterion | `@react-pdf/renderer` | `jsPDF` |
|---|---|---|
| Layout | Declarative flexbox, automatic wrapping and pagination | Imperative coordinates; manual line heights and page breaks |
| Readability | JSX components per section | Long imperative scripts |
| Multi-column | Native | Manual x/y math |
| Fit for this use case | ★★★ | ★ (better for simple generated docs like invoices) |

React ships only as a devDependency — it runs in the Node script and never reaches the browser bundle. Templates live under `scripts/` (outside `src/`), so Astro's TypeScript/Vite pipelines never see them. A manual check during implementation: `pnpm check` must continue to pass without reporting any React-related type errors.

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

**Breaking change:** every read of `experiences[i].description` must be updated to `webDescription`. Confirmed single consumer: `src/components/portfolio/GlowCard.astro:59`. Updated in the same commit as the rename.

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
  photo: "/photo.webp",                       // existing file in public/
};
```

This is deliberately separate from `personalData` (which keeps site-specific values like `"Nathan Rico"` brand name and `nathanredblur@duck.com` email).

### 3.4 Templates

All three templates are thin JSX compositions over shared components (`<Section>`, `<Bullet>`, `<ContactLine>`, `<ExperienceItem>`, `<SkillBar>`). Differences are layout and theme only — data flows identically.

**Classic** — replica of v2 PDF. Two-column: left 65% content (Summary, Technical Proficiency as `Frontend: React, Redux…`, Work Experience, Education, Certifications), right 35% sidebar (photo, contact with icons, skill bars, soft skills). Cyan accent matching v2.

**Modern** — single column. Large name header, compact contact strip with SVG icons (not emoji — see below), same section order as Classic but skills rendered as chip grid rather than bars. Accent color derived from `src/config.ts` hue (see §3.7). Sans-serif (Roboto, already a site dependency).

**ATS-Friendly** — single column, black text on white, Helvetica 10-11pt, no photo, no icons, no color, no graphics. Section headings in all caps. Technical proficiency as flat `Category: item, item, item` lines. Designed so recruiter ATS parsers extract cleanly.

#### Icons, not emoji

Emoji glyphs like 📍 🌐 ✉ render reliably only when the registered font contains them; Roboto/Helvetica/Inter do not, and react-pdf silently drops or tofu-boxes missing glyphs. Instead:

- **Classic and Modern** use small inline SVG via react-pdf's `<Svg>` + `<Path>` components (24×24 viewBox). The project already has `public/svg/skills/*.svg` — a small set of four résumé-specific icons (pin, globe, mail, linkedin) is added under `scripts/resume/components/icons/`.
- **ATS-Friendly** uses no icons at all; labels are text-only (`Email: ...`, `Location: ...`).

### 3.5 Build integration

#### `scripts/generate-resume.ts`

1. Imports `Classic`, `Modern`, `AtsFriendly` and all `src/data/*` files via relative paths.
2. Ensures `public/resume/` exists (`fs.mkdir(..., { recursive: true })`).
3. Sequentially calls `await renderToFile(<Template />, outPath)` for each template.
4. Logs filename and byte size on success.
5. Exits non-zero if any render throws.

Runs via `tsx scripts/generate-resume.ts`. `tsx` is added to devDependencies (it is not currently installed).

#### `package.json` changes

Current scripts (verified):

```json
"build": "astro build && pagefind --site dist",
"cloudflare:deploy": "wrangler deploy"
```

Updated:

```json
"generate-resume": "tsx scripts/generate-resume.ts",
"build": "pnpm generate-resume && astro build && pagefind --site dist",
"cloudflare:deploy": "pnpm build && wrangler deploy"
```

Rationale:
- `build` is extended by prepending `pnpm generate-resume` — otherwise unchanged.
- `cloudflare:deploy` is extended with `pnpm build &&` so local deploys cannot ship a stale or empty `dist/resume/`. Confirmed during spec review: `wrangler deploy` alone does not invoke a build — it just uploads the already-built `dist/` (the Cloudflare adapter places output there). Chaining `pnpm build &&` guarantees `dist/resume/*.pdf` exist before upload.
- `astro check` is intentionally **not** added to `build` — that is a separate `pnpm check` step, already part of CI and the project's existing contract.

#### CI

`.github/workflows/build.yml` currently runs `pnpm astro check && pnpm astro build`. Changed to `pnpm check && pnpm build`. This preserves the semantic contract (type-check gate + production build) while switching to the package.json script aliases so the generate-resume step is picked up automatically.

#### Git

`public/resume/*.pdf` is added to `.gitignore`. The PDFs are always regenerated from data; committing them would guarantee drift. CI and Cloudflare deploy both run `pnpm build` before uploading `dist/`.

### 3.6 Site integration

- `src/data/personal-data.ts` → `resume: "/resume/Jonathan_Rico_CV_Modern.pdf"`.
- `public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf` is deleted.
- No new components, no new routes. The existing "Resume" download link in the portfolio keeps working against the new URL.

### 3.7 Theming

`scripts/resume/theme.ts`:

- `classicTheme`, `modernTheme`, `atsTheme` — each exports colors, spacing, type scale.
- `Font.register` is called once at module load for Roboto (Classic + Modern) and uses built-in Helvetica for ATS.

Hue-to-hex for Modern (concrete):

```ts
// scripts/resume/theme.ts
import { siteConfig } from "../../src/config";

const hueToHex = (hue: number, saturation = 70, lightness = 45): string => {
  // Standard HSL → RGB → hex conversion. S=70 / L=45 chosen for print legibility
  // on white: saturated enough to read as an accent, dark enough to meet contrast
  // when used for headings. The Modern PDF accent is print-legible and is NOT
  // a pixel match of the site's on-screen accent (which uses different S/L via
  // Tailwind/CSS variables for dark-mode UI).
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    hue < 60  ? [c, x, 0] :
    hue < 120 ? [x, c, 0] :
    hue < 180 ? [0, c, x] :
    hue < 240 ? [0, x, c] :
    hue < 300 ? [x, 0, c] :
                [c, 0, x];
  const toByte = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toByte(r1)}${toByte(g1)}${toByte(b1)}`;
};

export const modernAccent = hueToHex(siteConfig.themeColor.hue);
```

Note the correct import path: `siteConfig.themeColor.hue` (not `themeConfig.colors.hue`) — per `src/config.ts:10,14-15`.

Fonts (committed under `scripts/resume/fonts/`):

- **Roboto-Regular.ttf, Roboto-Bold.ttf, Roboto-Italic.ttf** — Apache 2.0, downloaded directly from Google Fonts (<https://fonts.google.com/specimen/Roboto>) as TTFs. The `@fontsource/roboto` package already installed ships only `.woff`/`.woff2`, which react-pdf (via pdfkit) cannot load — `Font.register` requires `.ttf` or `.otf`. A short README under `scripts/resume/fonts/` records the source URL and license.
- ATS template uses built-in Helvetica (no file needed).

## 4. Data migration

Source content comes from the current PDF (`public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf`). Reconciliations with existing data files:

| Field | Site (current) | PDF | Resolution |
|---|---|---|---|
| Name | `personalData.name` = "Nathan Rico" | "Jonathan Rico" | `resumeProfile.fullName` = "Jonathan Rico"; `personalData` unchanged |
| Title | `personalData.designation` = "Front-End Developer Expert" | "Senior Software Engineer & UX Designer" | Separate fields, no unification |
| Email | `personalData.email` = "nathanredblur@duck.com" | "jon.nathan.rich@gmail.com" | `resumeProfile.email` = professional PDF address |
| Parser (May 2025–Present) | Present in `experience.ts` | Absent from PDF | Bullets drafted from existing `webDescription`, committed in the migration PR as a distinct commit labeled "data: draft resume bullets (review)". User reviews that commit before merge. |
| EPAM current dates | "Sep 2024 - May 2025" | "Sep 2024" (ongoing at export time) | Use the updated data-file dates; bullets taken from PDF. |

Bullets for the 7 older roles are transcribed verbatim from the PDF.

## 5. File naming

Final filenames (renamed from the current legal-style name for clarity and consistency):

- `public/resume/Jonathan_Rico_CV_Classic.pdf`
- `public/resume/Jonathan_Rico_CV_Modern.pdf`
- `public/resume/Jonathan_Rico_CV_ATS.pdf`

## 6. Testing strategy

The project has no unit test suite. Validation is manual and CI-driven.

**Gating (required to merge):**

1. `pnpm generate-resume` exits 0 and produces three non-empty PDFs under `public/resume/`.
2. Each PDF opens in Preview/Chrome and renders the expected sections without layout breakage at A4.
3. `pnpm build` completes end-to-end with the three PDFs ending up in `dist/resume/`.
4. `pnpm dev` — the "Resume" button downloads the Modern PDF.
5. `pnpm check && pnpm lint` — zero warnings.

**Optional / nice-to-have:**

6. ATS template scanned with a free tool (e.g., Jobscan) to confirm sections parse cleanly. Not gating because tool availability varies.

## 7. Rollout

1. Create `feat/dynamic-resume-pdf` branch. ✅
2. Implement data model changes + update `GlowCard.astro`.
3. Add devDependencies (`@react-pdf/renderer`, `react`, `react-dom`, `tsx`); verify none leak into dependencies.
4. Implement shared components, theme, and three templates under `scripts/resume/`.
5. Implement `scripts/generate-resume.ts` + wire into `build` and `cloudflare:deploy`.
6. Update `.github/workflows/build.yml`, `.gitignore`, `personal-data.ts`; delete legacy PDF.
7. Update `CLAUDE.md` with `pnpm generate-resume` and directory locations.
8. Local validation (all gating tests in §6).
9. PR → review → merge to `main`.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| React ships to browser by accident | Templates live under `scripts/`, outside `src/`. Data flows one-way: `src/data → scripts/resume`. Never import `scripts/resume/*` from anything under `src/`. |
| `experience.ts` rename breaks pages | Single consumer (`GlowCard.astro:59`) updated in the same commit as the rename. |
| Cloudflare local deploy skips build | `cloudflare:deploy` script now runs `pnpm build &&` first. |
| PDF generation flaky in CI due to remote font loading | Fonts are committed under `scripts/resume/fonts/`; `Font.register` reads local `.ttf` files only. |
| Icons rendering as tofu boxes | All non-ATS icon marks are SVG (`<Svg><Path/></Svg>`) — never emoji or font glyphs. |
| Build time inflation | Three sequential renders add ≈ 2-3s. Acceptable; not parallelized (react-pdf's Node renderer is CPU-bound and running them in parallel adds little). |

## 9. Out of scope (future work)

- An interactive `/resume` page with previews and download buttons for all three templates.
- Localized (Spanish) PDF variants.
- Per-role custom bullets inserted conditionally per template (e.g., longer on Classic, shorter on ATS).
- Photo-less Modern variant.
- Replacing `photo.webp` with a dedicated high-resolution professional portrait.
