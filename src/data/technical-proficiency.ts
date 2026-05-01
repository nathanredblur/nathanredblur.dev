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
    items: [
      "Git",
      "Webpack",
      "Vite",
      "Storybook",
      "Eslint",
      "Launch Darkly",
      "Sentry",
      "LogRocket",
    ],
  },
  {
    label: "Quality Engineering",
    items: [
      "Unit",
      "Integration",
      "E2E",
      "Jest",
      "Puppeteer",
      "Cypress",
      "Mocha",
    ],
  },
  {
    label: "Other",
    items: [
      "UX Design",
      "Figma",
      "Sketch",
      "Adobe XD",
      "Responsive Design",
      "VSCode",
    ],
  },
];
