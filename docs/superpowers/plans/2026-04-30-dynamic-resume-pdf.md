# Dynamic Resume PDF Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static hand-authored CV PDF with three dynamically generated templates (Classic, Modern, ATS-Friendly) rendered at build time from a single typed data source in `src/data/`.

**Architecture:** Data lives in `src/data/` and is consumed by both the Astro site and a Node-side build script (`scripts/generate-resume.ts`). The build script imports JSX templates from `scripts/resume/` (outside `src/`, so Astro/Vite never process them) and uses `@react-pdf/renderer` to emit three PDFs into `public/resume/`. React is a devDependency only; zero bytes shipped to the browser. Generation is wired into `pnpm build` and `pnpm cloudflare:deploy`.

**Tech Stack:** Astro 5, Svelte 5, TypeScript, `@react-pdf/renderer` v4, React 18 (dev-only), `tsx` for Node execution, pnpm, Biome.

**Spec:** `docs/superpowers/specs/2026-04-30-dynamic-resume-pdf-design.md`

**Project conventions to respect** (from CLAUDE.md):
- pnpm only (preinstall enforces)
- TypeScript, English only
- Biome: tabs for indentation, double quotes
- No unit test suite — validation is `pnpm check` + `pnpm lint` + manual PDF inspection
- Commits in imperative mood, one logical change each

---

## Chunk 1: Data layer migration

Establishes the source of truth for résumé content in `src/data/`. Every later chunk depends on this.

### Task 1: Rename `description` → `webDescription` and extend `Experience` interface

**Files:**
- Modify: `src/data/experience.ts`
- Modify: `src/components/portfolio/GlowCard.astro` (line 59)

- [ ] **Step 1: Replace `src/data/experience.ts` contents**

Replace the entire file with:

```ts
export interface Experience {
	title: string;
	company: string;
	type?: "React" | "Manager" | "Developer" | "Full-time" | "Freelance";
	duration: string;
	location?: string;
	webDescription: string;
	resumeSummary: string;
	resumeBullets: string[];
}

export const experiences: Experience[] = [
	{
		title: "Senior Frontend Engineer",
		company: "Parser",
		type: "Full-time",
		duration: "May 2025 - Present",
		location: "Remote",
		webDescription:
			"Developing mission-critical banking applications serving millions in the financial services sector. Leading accessibility initiatives to achieve WCAG 2.1 AA compliance while building modern React/TypeScript interfaces. Pioneering AI-assisted development with Claude 4.5, GPT 5.2, and Cursor to accelerate code quality, architectural decisions, and automated reviews. Maintaining excellence through Jest, React Testing Library, and Playwright testing.",
		resumeSummary:
			"Parser is a software consultancy delivering mission-critical banking applications for the financial services sector.",
		resumeBullets: [
			"Build modern React/TypeScript interfaces for banking applications serving millions of end users.",
			"Lead accessibility initiatives to achieve WCAG 2.1 AA compliance across product surfaces.",
			"Pioneer AI-assisted development (Claude, GPT, Cursor) to accelerate code quality and architectural reviews.",
			"Maintain engineering excellence with Jest, React Testing Library, and Playwright.",
		],
	},
	{
		title: "Senior Software Engineer",
		company: "EPAM Systems",
		type: "Full-time",
		duration: "Sep 2024 - May 2025",
		location: "Remote",
		webDescription:
			"Built enterprise-grade supply chain and inventory management solutions for a top US retail giant. Architected React/TypeScript interfaces with Ant Design, integrated TanStack Query for seamless data flow, developed NodeJS/Nest backend endpoints with GraphQL in a BFF architecture, and ensured quality through comprehensive testing with Jest, Enzyme, React Testing Library, and Cypress.",
		resumeSummary:
			"Leading US-based Retail Company developing an internal application for supply chain management, inventory control, and budget tracking for one of the world's most valuable technology companies.",
		resumeBullets: [
			"Create React components and pages using TypeScript and Ant Design UI framework.",
			"Integrate TanStack Query for efficient data fetching and state management.",
			"Implement new NodeJS/Nest endpoints and integrate GraphQL in existing BFF.",
			"Conduct unit and end-to-end testing using Jest, React Testing Library, and Cypress.",
			"Collaborate in code reviews and Agile development processes.",
		],
	},
	{
		title: "Senior Frontend Developer",
		company: "Terminal49",
		type: "Freelance",
		duration: "Jun 2024 - Sep 2024",
		location: "Remote",
		webDescription:
			"Elevated the digital presence of a leading logistics technology company. Optimized their NextJS website, crafted reusable components for Sanity CMS, boosted performance across platforms, enhanced EmberJs internal tools, and collaborated with marketing to strengthen SEO and web visibility.",
		resumeSummary:
			"Terminal49 is a leading logistics technology company in the global trade industry.",
		resumeBullets: [
			"Maintained and optimized the main website built with NextJS.",
			"Created new components for use with Sanity headless CMS.",
			"Implemented performance optimizations across our digital platforms.",
			"Developed features for the internal application built with EmberJs.",
			"Assisted the marketing team in improving SEO and enhancing Terminal49's web presence.",
		],
	},
	{
		title: "Senior React Developer",
		company: "Getaround",
		type: "React",
		duration: "May 2022 - Feb 2024",
		location: "Remote",
		webDescription:
			"I led the development of new product features from start to finish, including conception, research, documentation, maintenance, and refinement. I also contributed to key initiatives to enhance system elegance and productivity, focusing on streamlining processes and internal tools. Over time, I took ownership of part of the codebase, adhering to standards and best practices while driving its growth. Additionally, I conducted peer code reviews, contributed to our design system, and collaborated on product vision and software design decisions.",
		resumeSummary:
			"Getaround is a global car-sharing platform revolutionizing car rental through innovative technology. Developed new features to enhance user experience and streamline the rental process.",
		resumeBullets: [
			"Led the development of key product features, ensuring adherence to best practices.",
			"Conducted thorough code reviews to maintain quality standards.",
			"Integrated user-centric design principles in collaboration with UX designers.",
			"Utilized React, Redux, TypeScript, and Ant to build responsive interfaces.",
			"Supported and migrated legacy code.",
		],
	},
	{
		title: "Senior React Developer",
		company: "AirTm",
		type: "React",
		duration: "Jan 2021 - May 2022",
		location: "Remote",
		webDescription:
			"Front-end development for a financial services application that relies on a cryptocurrency backend.",
		resumeSummary:
			"Airtm is a global financial services platform promoting financial inclusion in developing markets. Focused on developing a secure, high-performance front-end for their application.",
		resumeBullets: [
			"Ensured application security through best coding practices.",
			"Extensively tested using Jest and Cypress to ensure reliability.",
			"Conducted code reviews for quality assurance.",
			"Collaborated with back-end developers to integrate front-end features.",
			"Participated in Scrum ceremonies and maintained comprehensive documentation.",
		],
	},
	{
		title: "Front-end Manager",
		company: "AllTheRooms",
		type: "Manager",
		duration: "Jun 2013 - Jan 2021",
		location: "Remote",
		webDescription:
			"I was the lead front-end developer for a travel metasearch product with a cutting-edge front-end that became a touchstone throughout the travel industry. Started in Angular and successfully migrated to React/Redux. I developed the front end for a self-service B2B analytics product, using React, Next.js, GraphQL and Apollo client. My responsibilities included UX design.",
		resumeSummary:
			"AllTheRooms is a travel metasearch engine aggregating accommodations from various sources. Led the transition from Angular 1 to React/Redux to Next.js/GraphQL, enhancing user experience and system scalability.",
		resumeBullets: [
			"Directed framework transition, improving performance and UX.",
			"Developed a B2B analytics product using modern front-end technologies.",
			"Managed and mentored the front-end team.",
			"Conducted regular code reviews and performance assessments.",
			"Coordinated with stakeholders to align development with business goals.",
		],
	},
	{
		title: "Front-End Developer",
		company: "Victory Productions",
		type: "Developer",
		duration: "Dec 2010 - Jun 2013",
		webDescription:
			"Develop a complex front-end application for an e-learning product, using web frameworks like Angular and Backbone.",
		resumeSummary:
			"Victory Productions is an e-learning company delivering interactive educational content. Developed a complex front-end for an e-learning product using Angular and Backbone.",
		resumeBullets: [
			"Created interactive front-end features using Angular and Backbone.",
			"Implemented responsive designs for cross-device compatibility.",
			"Developed educational games using JavaScript and Adobe Flash.",
			"Engaged in team meetings to discuss project progress.",
		],
	},
	{
		title: "Front-end Developer",
		company: "PRAGMA",
		type: "Developer",
		duration: "Feb 2009 - Dec 2010",
		webDescription: "Develop sites in Adobe Flash and HTML/CSS.",
		resumeSummary:
			"PRAGMA provides digital solutions, including websites and web applications, for various industries. Developed websites using Adobe Flash and HTML/CSS, delivering innovative digital solutions.",
		resumeBullets: [
			"Built and maintained websites using Adobe Flash and HTML/CSS.",
			"Designed interactive elements and animations.",
			"Conducted cross-browser testing to ensure compatibility.",
			"Participated in client meetings for requirements gathering.",
		],
	},
	{
		title: "Flash Developer",
		company: "Institución Universitaria ITM",
		type: "Developer",
		duration: "Jan 2007 - Jun 2008",
		webDescription:
			"Creating engaging interactive games with Adobe Flash and ActionScript for ITM University's online education platform. Experienced Entrepreneur and Tech Lead specializing in creating custom WordPress templates and plugins for Joomla, ELGG, and Moodle platforms. Skilled in leading teams and delivering innovative solutions to drive business growth. Passionate about leveraging technology to enhance user experiences.",
		resumeSummary:
			"ITM University offers a range of academic programs with a focus on technology and innovation. Developed interactive games using Adobe Flash and ActionScript for the university's online education platform.",
		resumeBullets: [
			"Created interactive educational games using Adobe Flash and ActionScript.",
			"Aligned games with curriculum goals in collaboration with educational designers.",
			"Developed animations and interactive features for engagement.",
			"Conducted testing for functionality and performance.",
		],
	},
];
```

- [ ] **Step 2: Update the single consumer in `GlowCard.astro`**

In `src/components/portfolio/GlowCard.astro`, change line 59:

```astro
{experience.description}
```

to:

```astro
{experience.webDescription}
```

- [ ] **Step 3: Run type check and lint**

Run:

```sh
pnpm check
pnpm lint
```

Expected: zero errors, zero warnings. If `astro check` reports errors about `description` elsewhere, grep for `.description` under `src/` scoped to experience uses (`rg "experience\.description|experiences\[.*\]\.description" src`) and fix each.

- [ ] **Step 4: Commit**

```sh
git add src/data/experience.ts src/components/portfolio/GlowCard.astro
git commit -m "refactor(data): rename Experience.description to webDescription and add resume fields"
```

---

### Task 2: Create `src/data/education.ts`

**Files:**
- Create: `src/data/education.ts`

- [ ] **Step 1: Write the file**

```ts
export interface Education {
	degree: string;
	institution: string;
	duration: string;
	location?: string;
	notes?: string;
}

export const education: Education[] = [
	{
		degree: "Engineering Technology degree",
		institution: "Institución Universitaria ITM",
		duration: "Jan 2007 - Oct 2009",
		location: "Medellín, CO",
	},
];
```

- [ ] **Step 2: Verify**

```sh
pnpm check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```sh
git add src/data/education.ts
git commit -m "feat(data): add education data file"
```

---

### Task 3: Create `src/data/certifications.ts`

**Files:**
- Create: `src/data/certifications.ts`

- [ ] **Step 1: Write the file**

```ts
export interface Certification {
	name: string;
	issuer: string;
	year?: string;
	url?: string;
}

export const certifications: Certification[] = [
	{ name: "EF SET English Certificate (B2 Upper Intermediate)", issuer: "EF SET" },
	{ name: "Visual Elements of User Interface Design", issuer: "Coursera" },
	{ name: "React Hooks Professional Course", issuer: "Platzi" },
	{ name: "Advanced React Course", issuer: "Platzi" },
	{ name: "ECMAScript 6+ Course", issuer: "Platzi" },
];
```

- [ ] **Step 2: Verify**

```sh
pnpm check
```

- [ ] **Step 3: Commit**

```sh
git add src/data/certifications.ts
git commit -m "feat(data): add certifications data file"
```

---

### Task 4: Create `src/data/technical-proficiency.ts`

**Files:**
- Create: `src/data/technical-proficiency.ts`

- [ ] **Step 1: Write the file**

```ts
export interface ProficiencyCategory {
	label: string;
	items: string[];
}

export const technicalProficiency: ProficiencyCategory[] = [
	{
		label: "Computer Languages",
		items: ["JavaScript", "TypeScript", "HTML", "CSS", "SCSS/SASS"],
	},
	{
		label: "Frontend",
		items: [
			"React",
			"Redux",
			"Next.js",
			"GraphQL",
			"Framer Motion",
			"GMaps",
			"MapBox",
			"Tailwind",
			"Linaria",
			"Post CSS",
			"NextUi",
			"Ant",
			"i18next",
			"Stripe",
			"jQuery",
			"Socket IO",
			"Sanity",
			"TanStack Query",
		],
	},
	{
		label: "Backend",
		items: ["NodeJS", "Nest", "Express", "Axios"],
	},
	{
		label: "Tools",
		items: ["Git", "Webpack", "Vite", "Storybook", "Eslint", "Launch Darkly", "Sentry", "LogRocket"],
	},
	{
		label: "Quality Engineering",
		items: ["Unit", "Integration", "E2E", "Jest", "Puppeteer", "Cypress", "Mocha"],
	},
	{
		label: "Other",
		items: ["UX Design", "Figma", "Sketch", "Adobe XD", "Responsive Design", "VSCode"],
	},
];
```

- [ ] **Step 2: Verify**

```sh
pnpm check
```

- [ ] **Step 3: Commit**

```sh
git add src/data/technical-proficiency.ts
git commit -m "feat(data): add technical proficiency data file"
```

---

### Task 5: Extend `src/data/skills.ts` with `featuredSkills`

**Files:**
- Modify: `src/data/skills.ts`

- [ ] **Step 1: Append to the file**

Do NOT replace existing exports (they are consumed by other site components). Append at the end:

```ts
export interface FeaturedSkill {
	name: string;
	proficiency: number;
}

export const featuredSkills: FeaturedSkill[] = [
	{ name: "Typescript", proficiency: 92 },
	{ name: "React", proficiency: 95 },
	{ name: "NextJs", proficiency: 88 },
	{ name: "Javascript", proficiency: 95 },
	{ name: "Figma", proficiency: 80 },
];
```

- [ ] **Step 2: Verify**

```sh
pnpm check
```

- [ ] **Step 3: Commit**

```sh
git add src/data/skills.ts
git commit -m "feat(data): add featuredSkills with proficiency for resume skill bars"
```

---

### Task 6: Create `src/data/resume-profile.ts`

**Files:**
- Create: `src/data/resume-profile.ts`

- [ ] **Step 1: Write the file**

```ts
export const resumeProfile = {
	fullName: "Jonathan Rico",
	title: "Senior Software Engineer & UX Designer",
	summary:
		"Dynamic front-end developer with 15 years of experience, specializing in React, Next.js, and modern web development frameworks. Proven track record in building scalable, user-centric applications and mentoring front-end teams to foster continuous learning. Passionate about leveraging cutting-edge technologies and best practices to drive innovation and deliver high-quality software solutions.",
	location: "Medellín, CO",
	email: "jon.nathan.rich@gmail.com",
	website: "https://nathanredblur.dev/",
	linkedin: "linkedin.com/in/nathanredblur",
	photo: "/photo.webp",
	softSkills: [
		"Communication",
		"Collaboration",
		"Creative Problem Solving",
		"Critical thinking",
		"Time management",
		"Team Leadership",
	],
} as const;

export type ResumeProfile = typeof resumeProfile;
```

- [ ] **Step 2: Verify**

```sh
pnpm check
```

- [ ] **Step 3: Commit**

```sh
git add src/data/resume-profile.ts
git commit -m "feat(data): add resume-specific profile data"
```

---

## Chunk 2: Dependencies, assets, and theme

Installs PDF libraries (dev-only), adds Roboto font files, and defines the shared theme utility.

### Task 7: Install devDependencies

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Install**

Run:

```sh
pnpm add -D @react-pdf/renderer@^4 react@^18 react-dom@^18 tsx@^4 @types/react@^18
```

- [ ] **Step 2: Verify they landed in `devDependencies`, not `dependencies`**

```sh
cat package.json | grep -A 20 '"devDependencies"'
```

Expected: `@react-pdf/renderer`, `react`, `react-dom`, `tsx`, `@types/react` all listed under `devDependencies`.
If any leaked into `dependencies`, move them by editing `package.json` and re-running `pnpm install`.

- [ ] **Step 3: Confirm install succeeds**

```sh
pnpm install
pnpm check
```

Expected: install completes; `pnpm check` passes.

- [ ] **Step 4: Commit**

```sh
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add @react-pdf/renderer, react, react-dom, tsx as devDependencies"
```

---

### Task 8: Commit Roboto TTF font files

**Files:**
- Create: `scripts/resume/fonts/Roboto-Regular.ttf`
- Create: `scripts/resume/fonts/Roboto-Bold.ttf`
- Create: `scripts/resume/fonts/Roboto-Italic.ttf`
- Create: `scripts/resume/fonts/README.md`

- [ ] **Step 1: Create directory**

```sh
mkdir -p scripts/resume/fonts
```

- [ ] **Step 2: Download the three TTFs from Google Fonts**

```sh
curl -fsSL -o scripts/resume/fonts/Roboto-Regular.ttf \
  "https://github.com/googlefonts/roboto-classic/raw/main/fonts/ttf/Roboto-Regular.ttf"
curl -fsSL -o scripts/resume/fonts/Roboto-Bold.ttf \
  "https://github.com/googlefonts/roboto-classic/raw/main/fonts/ttf/Roboto-Bold.ttf"
curl -fsSL -o scripts/resume/fonts/Roboto-Italic.ttf \
  "https://github.com/googlefonts/roboto-classic/raw/main/fonts/ttf/Roboto-Italic.ttf"
```

Verify each is non-empty:

```sh
ls -la scripts/resume/fonts/
```

Expected: three `.ttf` files, each >100 KB. If any URL is broken, fall back to <https://fonts.google.com/specimen/Roboto> → Download family → extract `static/Roboto-{Regular,Bold,Italic}.ttf`.

- [ ] **Step 3: Write license README**

Create `scripts/resume/fonts/README.md`:

```markdown
# Fonts

- **Roboto-Regular.ttf / Roboto-Bold.ttf / Roboto-Italic.ttf** — Roboto font family, licensed under the Apache License 2.0. Downloaded from <https://github.com/googlefonts/roboto-classic> (upstream of Google Fonts).

These TTF files are required at runtime by `@react-pdf/renderer` because pdfkit (its underlying PDF engine) cannot load the `.woff`/`.woff2` format shipped by `@fontsource/roboto`.

The ATS-Friendly template uses the built-in Helvetica font and does not require any file from this directory.
```

- [ ] **Step 4: Commit**

```sh
git add scripts/resume/fonts/
git commit -m "chore(resume): add Roboto TTF fonts (Apache 2.0) for PDF generation"
```

---

### Task 9: Create `scripts/resume/theme.ts`

**Files:**
- Create: `scripts/resume/theme.ts`

- [ ] **Step 1: Write the file**

```ts
import { Font } from "@react-pdf/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../../src/config";

const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);
const fontDir = path.join(thisDir, "fonts");
const publicDir = path.resolve(thisDir, "..", "..", "public");

Font.register({
	family: "Roboto",
	fonts: [
		{ src: path.join(fontDir, "Roboto-Regular.ttf") },
		{ src: path.join(fontDir, "Roboto-Bold.ttf"), fontWeight: "bold" },
		{ src: path.join(fontDir, "Roboto-Italic.ttf"), fontStyle: "italic" },
	],
});

export const publicAsset = (webPath: string): string =>
	path.join(publicDir, webPath.replace(/^\//, ""));

const hueToHex = (hue: number, saturation = 70, lightness = 45): string => {
	const s = saturation / 100;
	const l = lightness / 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = l - c / 2;
	const [r1, g1, b1] =
		hue < 60
			? [c, x, 0]
			: hue < 120
				? [x, c, 0]
				: hue < 180
					? [0, c, x]
					: hue < 240
						? [0, x, c]
						: hue < 300
							? [x, 0, c]
							: [c, 0, x];
	const toByte = (v: number) =>
		Math.round((v + m) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${toByte(r1)}${toByte(g1)}${toByte(b1)}`;
};

export const modernAccent = hueToHex(siteConfig.themeColor.hue);

export const classicTheme = {
	accent: "#29B6F6",
	sidebarBg: "#E8F1F6",
	text: "#1A1A1A",
	muted: "#555555",
	font: "Roboto",
} as const;

export const modernTheme = {
	accent: modernAccent,
	text: "#111111",
	muted: "#555555",
	subtle: "#BBBBBB",
	font: "Roboto",
} as const;

export const atsTheme = {
	text: "#000000",
	muted: "#333333",
	font: "Helvetica",
} as const;
```

- [ ] **Step 2: Verify TS compiles the new script subtree**

Because `scripts/resume/` is outside `src/`, it is NOT covered by `astro check`. Use a direct TypeScript compile of just this file, via `tsx --noExecute`:

```sh
pnpm tsx --eval "import('./scripts/resume/theme.ts').then(m => console.log(Object.keys(m)))"
```

Expected output includes `publicAsset`, `modernAccent`, `classicTheme`, `modernTheme`, `atsTheme`. If imports fail, fix path or config errors before proceeding. Font files being missing is not fatal at import time — `Font.register` does not read them until render.

- [ ] **Step 3: Commit**

```sh
git add scripts/resume/theme.ts
git commit -m "feat(resume): add PDF theme with Roboto registration and hueToHex util"
```

---

## Chunk 3: Shared PDF components

Reusable JSX primitives consumed by all three templates. Each component is a thin wrapper around `@react-pdf/renderer` primitives (`View`, `Text`, `Svg`, `Path`, `Image`).

### Task 10: Icon set (`scripts/resume/components/icons.tsx`)

**Files:**
- Create: `scripts/resume/components/icons.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { Svg, Path } from "@react-pdf/renderer";
import React from "react";

type IconProps = { size?: number; color?: string };

const base = (path: string) => (props: IconProps) => {
	const { size = 10, color = "#555555" } = props;
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<Path d={path} fill={color} />
		</Svg>
	);
};

export const PinIcon = base(
	"M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
);

export const GlobeIcon = base(
	"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.05a15.6 15.6 0 0 0-1.38-5.27A8.03 8.03 0 0 1 19.93 11zM12 4.07c.94 1.37 1.7 3.27 2.05 5.93H9.95C10.3 7.34 11.06 5.44 12 4.07zM4.07 11a8.03 8.03 0 0 1 4.43-5.27A15.6 15.6 0 0 0 7.12 11H4.07zM4.07 13h3.05a15.6 15.6 0 0 0 1.38 5.27A8.03 8.03 0 0 1 4.07 13zm7.93 6.93c-.94-1.37-1.7-3.27-2.05-5.93h4.1c-.35 2.66-1.11 4.56-2.05 5.93zM15.5 18.27A15.6 15.6 0 0 0 16.88 13h3.05a8.03 8.03 0 0 1-4.43 5.27z",
);

export const MailIcon = base(
	"M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
);

export const LinkedInIcon = base(
	"M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z",
);
```

- [ ] **Step 2: Sanity import check**

```sh
pnpm tsx --eval "import('./scripts/resume/components/icons.tsx').then(m => console.log(Object.keys(m)))"
```

Expected: array with `PinIcon`, `GlobeIcon`, `MailIcon`, `LinkedInIcon`.

- [ ] **Step 3: Commit**

```sh
git add scripts/resume/components/icons.tsx
git commit -m "feat(resume): add SVG icon set for resume templates"
```

---

### Task 11: Shared layout components (`scripts/resume/components/shared.tsx`)

**Files:**
- Create: `scripts/resume/components/shared.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React, { type ReactNode } from "react";

const styles = StyleSheet.create({
	section: { marginBottom: 12 },
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		letterSpacing: 1.5,
		textTransform: "uppercase",
		marginBottom: 6,
	},
	sectionTitleUnderline: {
		borderBottomWidth: 1,
		paddingBottom: 3,
	},
	bulletRow: { flexDirection: "row", marginBottom: 2 },
	bulletMark: { width: 10 },
	bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
	contactRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 3,
	},
	contactIcon: { marginRight: 6 },
	contactText: { fontSize: 9, color: "#333333" },
	experienceItem: { marginBottom: 10 },
	roleTitle: { fontSize: 11, fontWeight: "bold" },
	roleMeta: { fontSize: 9.5, fontStyle: "italic", marginBottom: 2 },
	roleSummary: { fontSize: 9.5, lineHeight: 1.35, marginBottom: 3 },
});

export type SectionProps = {
	title: string;
	color?: string;
	underline?: boolean;
	children: ReactNode;
};

export const Section = ({ title, color, underline, children }: SectionProps) => (
	<View style={styles.section}>
		<Text
			style={[
				styles.sectionTitle,
				...(color ? [{ color }] : []),
				...(underline ? [styles.sectionTitleUnderline, { borderBottomColor: color ?? "#000000" }] : []),
			]}
		>
			{title}
		</Text>
		{children}
	</View>
);

export type BulletProps = { children: ReactNode; mark?: string };

export const Bullet = ({ children, mark = "•" }: BulletProps) => (
	<View style={styles.bulletRow}>
		<Text style={styles.bulletMark}>{mark}</Text>
		<Text style={styles.bulletText}>{children}</Text>
	</View>
);

export type ContactLineProps = {
	icon?: ReactNode;
	children: ReactNode;
};

export const ContactLine = ({ icon, children }: ContactLineProps) => (
	<View style={styles.contactRow}>
		{icon ? <View style={styles.contactIcon}>{icon}</View> : null}
		<Text style={styles.contactText}>{children}</Text>
	</View>
);

export type ExperienceItemProps = {
	title: string;
	company: string;
	duration: string;
	summary: string;
	bullets: string[];
};

export const ExperienceItem = ({ title, company, duration, summary, bullets }: ExperienceItemProps) => (
	<View style={styles.experienceItem} wrap={false}>
		<Text style={styles.roleTitle}>{title}</Text>
		<Text style={styles.roleMeta}>
			{company} | {duration}
		</Text>
		<Text style={styles.roleSummary}>{summary}</Text>
		{bullets.map((b, i) => (
			<Bullet key={`${title}-${i}`}>{b}</Bullet>
		))}
	</View>
);
```

Notes on the code:
- `wrap={false}` on `ExperienceItem` tells react-pdf not to split an experience entry across pages mid-item.
- Bullet `key` uses `title-index` — acceptable here because the array is static and titles are unique within a company; React DevTools warnings are non-fatal in Node-only render.
- `StyleSheet.create` returns type-safe keys; adding new styles in this file is straightforward.

- [ ] **Step 2: Sanity import check**

```sh
pnpm tsx --eval "import('./scripts/resume/components/shared.tsx').then(m => console.log(Object.keys(m)))"
```

Expected: `Section`, `Bullet`, `ContactLine`, `ExperienceItem`.

- [ ] **Step 3: Commit**

```sh
git add scripts/resume/components/shared.tsx
git commit -m "feat(resume): add shared Section/Bullet/ContactLine/ExperienceItem components"
```

---

### Task 12: Skill-bar component (`scripts/resume/components/SkillBar.tsx`)

**Files:**
- Create: `scripts/resume/components/SkillBar.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
	wrap: { marginBottom: 8 },
	label: { fontSize: 10, marginBottom: 3 },
	trackBg: { height: 5, backgroundColor: "#FFFFFF", borderRadius: 2 },
	trackFill: { height: 5, borderRadius: 2 },
});

export type SkillBarProps = {
	name: string;
	proficiency: number;
	color: string;
};

export const SkillBar = ({ name, proficiency, color }: SkillBarProps) => {
	const pct = Math.max(0, Math.min(100, proficiency));
	return (
		<View style={styles.wrap}>
			<Text style={styles.label}>{name}</Text>
			<View style={styles.trackBg}>
				<View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: color }]} />
			</View>
		</View>
	);
};
```

- [ ] **Step 2: Sanity import check**

```sh
pnpm tsx --eval "import('./scripts/resume/components/SkillBar.tsx').then(m => console.log(Object.keys(m)))"
```

Expected: `SkillBar`.

- [ ] **Step 3: Commit**

```sh
git add scripts/resume/components/SkillBar.tsx
git commit -m "feat(resume): add SkillBar component with proficiency track"
```

---

## Chunk 4: Three templates

Each template is ~150-250 lines of JSX. Kept focused: layout and theme only; data flows from `src/data/*` identically.

### Task 13: `scripts/resume/templates/Classic.tsx`

**Files:**
- Create: `scripts/resume/templates/Classic.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import { experiences } from "../../../src/data/experience";
import { education } from "../../../src/data/education";
import { certifications } from "../../../src/data/certifications";
import { technicalProficiency } from "../../../src/data/technical-proficiency";
import { featuredSkills } from "../../../src/data/skills";
import { resumeProfile } from "../../../src/data/resume-profile";
import { classicTheme, publicAsset } from "../theme";
import { Section, Bullet, ContactLine, ExperienceItem } from "../components/shared";
import { SkillBar } from "../components/SkillBar";
import { PinIcon, GlobeIcon, MailIcon, LinkedInIcon } from "../components/icons";

const styles = StyleSheet.create({
	page: {
		flexDirection: "row",
		fontFamily: classicTheme.font,
		fontSize: 10,
		color: classicTheme.text,
	},
	main: { width: "65%", padding: 24 },
	sidebar: { width: "35%", backgroundColor: classicTheme.sidebarBg, padding: 20 },
	name: { fontSize: 28, color: classicTheme.accent, fontWeight: "bold" },
	title: { fontSize: 13, marginBottom: 16 },
	summary: { fontSize: 10, lineHeight: 1.45, marginBottom: 14 },
	techLine: { fontSize: 9.5, marginBottom: 3, lineHeight: 1.35 },
	techLabel: { fontWeight: "bold" },
	photo: { width: 110, height: 140, alignSelf: "center", marginBottom: 14 },
	sidebarTitle: { fontSize: 11, fontWeight: "bold", marginTop: 10, marginBottom: 6 },
	eduItem: { marginBottom: 6 },
	eduDegree: { fontSize: 10, fontWeight: "bold" },
	eduMeta: { fontSize: 9, fontStyle: "italic" },
});

export const Classic = () => (
	<Document title={`${resumeProfile.fullName} — Resume (Classic)`} author={resumeProfile.fullName}>
		<Page size="A4" style={styles.page}>
			<View style={styles.main}>
				<Text style={styles.name}>{resumeProfile.fullName}</Text>
				<Text style={styles.title}>{resumeProfile.title}</Text>

				<Section title="Summary" color={classicTheme.accent}>
					<Text style={styles.summary}>{resumeProfile.summary}</Text>
				</Section>

				<Section title="Technical Proficiency" color={classicTheme.accent}>
					{technicalProficiency.map((cat) => (
						<Text key={cat.label} style={styles.techLine}>
							<Text style={styles.techLabel}>{cat.label}: </Text>
							{cat.items.join(", ")}
						</Text>
					))}
				</Section>

				<Section title="Work Experience" color={classicTheme.accent}>
					{experiences.map((exp) => (
						<ExperienceItem
							key={`${exp.company}-${exp.duration}`}
							title={exp.title}
							company={exp.company}
							duration={exp.duration}
							summary={exp.resumeSummary}
							bullets={exp.resumeBullets}
						/>
					))}
				</Section>

				<Section title="Education" color={classicTheme.accent}>
					{education.map((ed) => (
						<View key={ed.degree} style={styles.eduItem}>
							<Text style={styles.eduDegree}>{ed.degree}</Text>
							<Text style={styles.eduMeta}>
								{ed.institution} — {ed.duration}
							</Text>
						</View>
					))}
				</Section>

				<Section title="Certifications" color={classicTheme.accent}>
					{certifications.map((c) => (
						<Bullet key={c.name}>
							{c.name} — {c.issuer}
						</Bullet>
					))}
				</Section>
			</View>

			<View style={styles.sidebar}>
				<Image src={publicAsset(resumeProfile.photo)} style={styles.photo} />

				<ContactLine icon={<PinIcon color={classicTheme.accent} />}>{resumeProfile.location}</ContactLine>
				<ContactLine icon={<GlobeIcon color={classicTheme.accent} />}>{resumeProfile.website}</ContactLine>
				<ContactLine icon={<MailIcon color={classicTheme.accent} />}>{resumeProfile.email}</ContactLine>
				<ContactLine icon={<LinkedInIcon color={classicTheme.accent} />}>{resumeProfile.linkedin}</ContactLine>

				<Text style={styles.sidebarTitle}>Skills</Text>
				{featuredSkills.map((s) => (
					<SkillBar key={s.name} name={s.name} proficiency={s.proficiency} color={classicTheme.accent} />
				))}

				<Text style={styles.sidebarTitle}>Soft Skills</Text>
				{resumeProfile.softSkills.map((s) => (
					<Bullet key={s}>{s}</Bullet>
				))}
			</View>
		</Page>
	</Document>
);
```

Notes:
- `publicAsset(resumeProfile.photo)` is defined in `scripts/resume/theme.ts` (Task 9 / 16) and translates `/photo.webp` to an absolute filesystem path under `public/`. `@react-pdf/renderer`'s `Image` component requires a filesystem path (or data URI) at Node render time.
- Bullet indexing uses company+duration as a stable key.

- [ ] **Step 2: Sanity import check**

```sh
pnpm tsx --eval "import('./scripts/resume/templates/Classic.tsx').then(m => console.log(typeof m.Classic))"
```

Expected: `function`.

- [ ] **Step 3: Commit**

```sh
git add scripts/resume/templates/Classic.tsx
git commit -m "feat(resume): add Classic template (two-column, replica of v2 PDF)"
```

---

### Task 14: `scripts/resume/templates/Modern.tsx`

**Files:**
- Create: `scripts/resume/templates/Modern.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import { experiences } from "../../../src/data/experience";
import { education } from "../../../src/data/education";
import { certifications } from "../../../src/data/certifications";
import { technicalProficiency } from "../../../src/data/technical-proficiency";
import { resumeProfile } from "../../../src/data/resume-profile";
import { modernTheme } from "../theme";
import { Section, Bullet, ContactLine, ExperienceItem } from "../components/shared";
import { PinIcon, GlobeIcon, MailIcon, LinkedInIcon } from "../components/icons";

const styles = StyleSheet.create({
	page: {
		fontFamily: modernTheme.font,
		fontSize: 10,
		color: modernTheme.text,
		padding: 36,
	},
	header: { marginBottom: 18 },
	name: { fontSize: 26, fontWeight: "bold", color: modernTheme.accent },
	title: { fontSize: 12, color: modernTheme.muted, marginBottom: 8 },
	contactStrip: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
	summary: { fontSize: 10, lineHeight: 1.5, marginBottom: 10 },
	techCategory: { marginBottom: 4 },
	techLabel: { fontWeight: "bold", fontSize: 10 },
	techItems: { fontSize: 9.5, color: modernTheme.muted },
	eduItem: { marginBottom: 4 },
	eduDegree: { fontSize: 10.5, fontWeight: "bold" },
	eduMeta: { fontSize: 9.5, color: modernTheme.muted },
});

export const Modern = () => (
	<Document title={`${resumeProfile.fullName} — Resume (Modern)`} author={resumeProfile.fullName}>
		<Page size="A4" style={styles.page}>
			<View style={styles.header}>
				<Text style={styles.name}>{resumeProfile.fullName}</Text>
				<Text style={styles.title}>{resumeProfile.title}</Text>
				<View style={styles.contactStrip}>
					<ContactLine icon={<PinIcon color={modernTheme.accent} />}>{resumeProfile.location}</ContactLine>
					<ContactLine icon={<GlobeIcon color={modernTheme.accent} />}>{resumeProfile.website}</ContactLine>
					<ContactLine icon={<MailIcon color={modernTheme.accent} />}>{resumeProfile.email}</ContactLine>
					<ContactLine icon={<LinkedInIcon color={modernTheme.accent} />}>{resumeProfile.linkedin}</ContactLine>
				</View>
			</View>

			<Section title="Summary" color={modernTheme.accent} underline>
				<Text style={styles.summary}>{resumeProfile.summary}</Text>
			</Section>

			<Section title="Experience" color={modernTheme.accent} underline>
				{experiences.map((exp) => (
					<ExperienceItem
						key={`${exp.company}-${exp.duration}`}
						title={exp.title}
						company={exp.company}
						duration={exp.duration}
						summary={exp.resumeSummary}
						bullets={exp.resumeBullets}
					/>
				))}
			</Section>

			<Section title="Technical Skills" color={modernTheme.accent} underline>
				{technicalProficiency.map((cat) => (
					<View key={cat.label} style={styles.techCategory}>
						<Text>
							<Text style={styles.techLabel}>{cat.label}: </Text>
							<Text style={styles.techItems}>{cat.items.join(", ")}</Text>
						</Text>
					</View>
				))}
			</Section>

			<Section title="Education" color={modernTheme.accent} underline>
				{education.map((ed) => (
					<View key={ed.degree} style={styles.eduItem}>
						<Text style={styles.eduDegree}>{ed.degree}</Text>
						<Text style={styles.eduMeta}>
							{ed.institution} — {ed.duration}
						</Text>
					</View>
				))}
			</Section>

			<Section title="Certifications" color={modernTheme.accent} underline>
				{certifications.map((c) => (
					<Bullet key={c.name}>
						{c.name} — {c.issuer}
					</Bullet>
				))}
			</Section>
		</Page>
	</Document>
);
```

- [ ] **Step 2: Sanity import check**

```sh
pnpm tsx --eval "import('./scripts/resume/templates/Modern.tsx').then(m => console.log(typeof m.Modern))"
```

Expected: `function`.

- [ ] **Step 3: Commit**

```sh
git add scripts/resume/templates/Modern.tsx
git commit -m "feat(resume): add Modern template (single-column, site-aligned)"
```

---

### Task 15: `scripts/resume/templates/AtsFriendly.tsx`

**Files:**
- Create: `scripts/resume/templates/AtsFriendly.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import { experiences } from "../../../src/data/experience";
import { education } from "../../../src/data/education";
import { certifications } from "../../../src/data/certifications";
import { technicalProficiency } from "../../../src/data/technical-proficiency";
import { resumeProfile } from "../../../src/data/resume-profile";
import { atsTheme } from "../theme";

const styles = StyleSheet.create({
	page: {
		fontFamily: atsTheme.font,
		fontSize: 11,
		color: atsTheme.text,
		padding: 40,
		lineHeight: 1.4,
	},
	name: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
	title: { fontSize: 12, marginBottom: 2 },
	contact: { fontSize: 10, marginBottom: 10 },
	sectionTitle: {
		fontSize: 12,
		fontWeight: "bold",
		textTransform: "uppercase",
		marginTop: 10,
		marginBottom: 4,
	},
	summary: { fontSize: 10.5, lineHeight: 1.4, marginBottom: 4 },
	jobTitle: { fontSize: 11, fontWeight: "bold", marginTop: 6 },
	jobMeta: { fontSize: 10 },
	jobSummary: { fontSize: 10, marginBottom: 2 },
	bulletRow: { flexDirection: "row" },
	bulletMark: { width: 10 },
	bulletText: { flex: 1, fontSize: 10 },
	techLine: { fontSize: 10 },
});

export const AtsFriendly = () => (
	<Document title={`${resumeProfile.fullName} — Resume (ATS)`} author={resumeProfile.fullName}>
		<Page size="A4" style={styles.page}>
			<Text style={styles.name}>{resumeProfile.fullName}</Text>
			<Text style={styles.title}>{resumeProfile.title}</Text>
			<Text style={styles.contact}>
				Location: {resumeProfile.location} | Email: {resumeProfile.email} | Website: {resumeProfile.website} |
				LinkedIn: {resumeProfile.linkedin}
			</Text>

			<Text style={styles.sectionTitle}>Summary</Text>
			<Text style={styles.summary}>{resumeProfile.summary}</Text>

			<Text style={styles.sectionTitle}>Experience</Text>
			{experiences.map((exp) => (
				<View key={`${exp.company}-${exp.duration}`} wrap={false}>
					<Text style={styles.jobTitle}>
						{exp.title}, {exp.company}
					</Text>
					<Text style={styles.jobMeta}>{exp.duration}</Text>
					<Text style={styles.jobSummary}>{exp.resumeSummary}</Text>
					{exp.resumeBullets.map((b, i) => (
						<View key={`${exp.company}-${i}`} style={styles.bulletRow}>
							<Text style={styles.bulletMark}>-</Text>
							<Text style={styles.bulletText}>{b}</Text>
						</View>
					))}
				</View>
			))}

			<Text style={styles.sectionTitle}>Skills</Text>
			{technicalProficiency.map((cat) => (
				<Text key={cat.label} style={styles.techLine}>
					{cat.label}: {cat.items.join(", ")}
				</Text>
			))}

			<Text style={styles.sectionTitle}>Education</Text>
			{education.map((ed) => (
				<Text key={ed.degree} style={styles.techLine}>
					{ed.degree}, {ed.institution}, {ed.duration}
				</Text>
			))}

			<Text style={styles.sectionTitle}>Certifications</Text>
			{certifications.map((c) => (
				<Text key={c.name} style={styles.techLine}>
					- {c.name} — {c.issuer}
				</Text>
			))}
		</Page>
	</Document>
);
```

- [ ] **Step 2: Sanity import check**

```sh
pnpm tsx --eval "import('./scripts/resume/templates/AtsFriendly.tsx').then(m => console.log(typeof m.AtsFriendly))"
```

Expected: `function`.

- [ ] **Step 3: Commit**

```sh
git add scripts/resume/templates/AtsFriendly.tsx
git commit -m "feat(resume): add ATS-Friendly template (plain, parser-optimized)"
```

---

## Chunk 5: Generation script and build wiring

### Task 16: Create `scripts/generate-resume.ts`

**Files:**
- Create: `scripts/generate-resume.ts`

- [ ] **Step 1: Write the file**

```ts
import { renderToFile } from "@react-pdf/renderer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { Classic } from "./resume/templates/Classic";
import { Modern } from "./resume/templates/Modern";
import { AtsFriendly } from "./resume/templates/AtsFriendly";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "public", "resume");

const templates = [
	{ name: "Jonathan_Rico_CV_Classic.pdf", element: React.createElement(Classic) },
	{ name: "Jonathan_Rico_CV_Modern.pdf", element: React.createElement(Modern) },
	{ name: "Jonathan_Rico_CV_ATS.pdf", element: React.createElement(AtsFriendly) },
] as const;

const run = async () => {
	await fs.mkdir(outDir, { recursive: true });

	for (const t of templates) {
		const outPath = path.join(outDir, t.name);
		// biome-ignore lint/suspicious/noConsole: CLI script output
		console.log(`Rendering ${t.name}...`);
		await renderToFile(t.element, outPath);
		const stat = await fs.stat(outPath);
		// biome-ignore lint/suspicious/noConsole: CLI script output
		console.log(`  → ${outPath} (${(stat.size / 1024).toFixed(1)} KB)`);
	}

	// biome-ignore lint/suspicious/noConsole: CLI script output
	console.log(`Done. Wrote ${templates.length} PDFs to ${outDir}`);
};

run().catch((err) => {
	// biome-ignore lint/suspicious/noConsole: CLI script error reporting
	console.error("Resume generation failed:", err);
	process.exit(1);
});
```

Notes:
- Uses `React.createElement` rather than JSX so the top-level script file does not need `.tsx` extension or JSX configuration.
- `renderToFile` resolves once the PDF is written to disk.

- [ ] **Step 2: Run the script**

```sh
pnpm tsx scripts/generate-resume.ts
```

Expected output:

```
Rendering Jonathan_Rico_CV_Classic.pdf...
  → /…/public/resume/Jonathan_Rico_CV_Classic.pdf (xxx.x KB)
Rendering Jonathan_Rico_CV_Modern.pdf...
  → /…/public/resume/Jonathan_Rico_CV_Modern.pdf (xxx.x KB)
Rendering Jonathan_Rico_CV_ATS.pdf...
  → /…/public/resume/Jonathan_Rico_CV_ATS.pdf (xxx.x KB)
Done. Wrote 3 PDFs to /…/public/resume
```

Each PDF should be between ~100 KB and ~1.5 MB.

- [ ] **Step 3: Inspect the PDFs visually**

```sh
open public/resume/Jonathan_Rico_CV_Classic.pdf
open public/resume/Jonathan_Rico_CV_Modern.pdf
open public/resume/Jonathan_Rico_CV_ATS.pdf
```

Checklist per PDF:
- Name, title, summary render correctly.
- All 9 experience entries present with bullets.
- No tofu / missing glyphs.
- No layout break (overflow, missing sections).
- Classic: photo visible, skill bars drawn, sidebar layout correct.
- Modern: contact strip wraps cleanly, accent color matches site hue (300 → magenta-ish).
- ATS: no colors, no icons, single column.

If any PDF is broken, fix the template and re-run before committing.

- [ ] **Step 4: Commit**

```sh
git add scripts/generate-resume.ts
git commit -m "feat(resume): add generate-resume script that emits 3 PDFs"
```

---

### Task 17: Wire `generate-resume` into `package.json` scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Edit the `scripts` block**

Change the `scripts` object to:

```json
"scripts": {
	"dev": "astro dev",
	"start": "astro dev",
	"check": "astro check",
	"generate-resume": "tsx scripts/generate-resume.ts",
	"build": "pnpm generate-resume && astro build && pagefind --site dist",
	"preview": "astro preview",
	"astro": "astro",
	"type-check": "tsc --noEmit --isolatedDeclarations",
	"new-post": "node scripts/new-post.js",
	"optimize-images": "bash scripts/optimize-images.sh",
	"format": "biome format --write ./src",
	"lint": "biome check --write ./src",
	"preinstall": "npx only-allow pnpm",
	"cloudflare:preview": "wrangler dev",
	"cloudflare:deploy": "pnpm build && wrangler deploy"
}
```

Only three entries change: `generate-resume` (added), `build` (prepended with `pnpm generate-resume &&`), `cloudflare:deploy` (prepended with `pnpm build &&`).

- [ ] **Step 2: Verify**

```sh
pnpm generate-resume
pnpm build
```

Expected: `pnpm build` regenerates the three PDFs, runs `astro build`, then `pagefind` indexes `dist/`. No errors.

- [ ] **Step 3: Commit**

```sh
git add package.json
git commit -m "chore(build): wire generate-resume into build and cloudflare:deploy"
```

---

### Task 18: Gitignore the generated PDFs

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Append to `.gitignore`**

Add at the end of the file:

```
# generated resume PDFs (see scripts/generate-resume.ts)
public/resume/*.pdf
```

- [ ] **Step 2: Verify**

```sh
git status
```

Expected: no `public/resume/*.pdf` files appear in status (ignored).

- [ ] **Step 3: Commit**

```sh
git add .gitignore
git commit -m "chore(git): ignore generated resume PDFs"
```

---

## Chunk 6: Site integration, CI, docs, validation

### Task 19: Update `personal-data.ts` resume link and delete legacy PDF

**Files:**
- Modify: `src/data/personal-data.ts`
- Delete: `public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf`

- [ ] **Step 1: Update the link**

In `src/data/personal-data.ts`, change:

```ts
resume: "/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf",
```

to:

```ts
resume: "/resume/Jonathan_Rico_CV_Modern.pdf",
```

- [ ] **Step 2: Delete the legacy PDF**

```sh
trash public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf
```

If `trash` is not available on the runner's system, use `git rm public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf` (this removes it from both the working tree and the index).

- [ ] **Step 3: Verify**

```sh
pnpm dev
```

Open the portfolio page, click the "Resume" link. Expected: downloads/opens `/resume/Jonathan_Rico_CV_Modern.pdf`.

Stop `pnpm dev`. Run:

```sh
pnpm check
pnpm lint
```

Expected: zero warnings.

- [ ] **Step 4: Commit**

```sh
git add src/data/personal-data.ts public/Jonathan_Esteban_Rico_Lozada_CV_v2.pdf
git commit -m "feat(site): point resume link to generated Modern PDF; remove legacy PDF"
```

---

### Task 20: Update CI workflow

**Files:**
- Modify: `.github/workflows/build.yml`

- [ ] **Step 1: Edit the `check` job's `Run Astro Check` step**

Change:

```yaml
      - name: Run Astro Check
        run: pnpm astro check
```

to:

```yaml
      - name: Run type check
        run: pnpm check
```

- [ ] **Step 2: Edit the `build` job's `Run Astro Build` step**

Change:

```yaml
      - name: Run Astro Build
        run: pnpm astro build
```

to:

```yaml
      - name: Run build (generates PDFs + Astro build + Pagefind)
        run: pnpm build
```

- [ ] **Step 3: Commit**

```sh
git add .github/workflows/build.yml
git commit -m "ci: switch build workflow to pnpm check / pnpm build"
```

---

### Task 21: Update `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add the new command to the Development Commands block**

In `CLAUDE.md`, locate the code block under `## Development Commands` and insert a new line between `pnpm new-post` and `pnpm cloudflare:preview`:

```
pnpm generate-resume  # Regenerate 3 resume PDFs into public/resume/
```

- [ ] **Step 2: Add a new subsection about the resume pipeline**

After the `### Data Files` subsection, add:

````markdown
### Resume PDF Generation

Three PDF résumés (Classic, Modern, ATS-Friendly) are generated at build time by `scripts/generate-resume.ts`. Templates live in `scripts/resume/templates/` (outside `src/` so Astro/Vite never process them). They consume typed data from `src/data/experience.ts`, `src/data/education.ts`, `src/data/certifications.ts`, `src/data/technical-proficiency.ts`, `src/data/skills.ts` (`featuredSkills`), and `src/data/resume-profile.ts`.

Output files land in `public/resume/*.pdf` (gitignored, regenerated on every build). `personalData.resume` points at the Modern PDF. React and `@react-pdf/renderer` are devDependencies only; no React code ships to the browser.
````

- [ ] **Step 3: Update the `experience.ts` bullet under `Data Files`**

Before:

```
- `experience.ts` — work experience entries
```

After:

```
- `experience.ts` — work experience with `webDescription` (site) and `resumeSummary` + `resumeBullets` (résumé)
```

- [ ] **Step 4: Commit**

```sh
git add CLAUDE.md
git commit -m "docs: document resume PDF generation pipeline in CLAUDE.md"
```

---

### Task 22: Full end-to-end validation

**Files:** (none — validation only)

- [ ] **Step 1: Clean local state and rebuild**

```sh
trash dist public/resume 2>/dev/null || true
pnpm build
```

Expected: generates three PDFs under `dist/resume/`, `astro build` completes, `pagefind` indexes `dist/`.

- [ ] **Step 2: Verify PDFs**

```sh
ls -la dist/resume/ public/resume/
```

Expected: three `.pdf` files in each directory, each >50 KB. `public/resume/` PDFs are ignored by git; `dist/resume/` is the deploy artifact.

- [ ] **Step 3: Visual spot-check**

```sh
open dist/resume/Jonathan_Rico_CV_Classic.pdf
open dist/resume/Jonathan_Rico_CV_Modern.pdf
open dist/resume/Jonathan_Rico_CV_ATS.pdf
```

Confirm each renders cleanly (see Task 16 checklist).

- [ ] **Step 4: Run full quality gates**

```sh
pnpm check
pnpm lint
```

Expected: zero errors, zero warnings.

- [ ] **Step 5: Smoke test the dev server**

```sh
pnpm dev
```

Open `http://localhost:4321`, navigate to the page with the Resume link, click it. Expected: browser opens `/resume/Jonathan_Rico_CV_Modern.pdf`.

Stop `pnpm dev`.

- [ ] **Step 6: Confirm git status is clean**

```sh
git status
```

Expected: no tracked PDFs under `public/resume/`; only the commits from this plan.

- [ ] **Step 7: Push and open PR**

```sh
git push -u origin feat/dynamic-resume-pdf
gh pr create --title "feat: dynamic resume PDF generation (3 templates)" --body "$(cat <<'EOF'
## Summary
- Replaces the static CV PDF with three dynamically generated templates (Classic, Modern, ATS-Friendly) rendered at build time from typed data in `src/data/`.
- Uses `@react-pdf/renderer` in a Node-only script (`scripts/generate-resume.ts`); React is a devDependency — zero bytes shipped to the browser.
- Generation runs automatically in `pnpm build` and `pnpm cloudflare:deploy`.

## Test plan
- [ ] `pnpm generate-resume` produces 3 PDFs in `public/resume/`
- [ ] `pnpm build` completes end-to-end; PDFs land in `dist/resume/`
- [ ] `pnpm dev` — Resume link downloads the Modern PDF
- [ ] `pnpm check` and `pnpm lint` pass with zero warnings
- [ ] Each PDF opens cleanly in Preview / Chrome with no visual glitches
- [ ] (Optional) ATS template scanned with Jobscan parses all sections

See design spec: \`docs/superpowers/specs/2026-04-30-dynamic-resume-pdf-design.md\`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed. Share it with the user for review before merge.

---

## Appendix: Relevant skills

- @superpowers:verification-before-completion — run before claiming any task done
- @superpowers:systematic-debugging — if a PDF render fails or visually breaks
- @superpowers:finishing-a-development-branch — once this plan is executed, to decide merge flow
