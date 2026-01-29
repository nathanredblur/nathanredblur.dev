export const skillsData = [
	"React",
	"Next JS",
	"Typescript",
	"Javascript",
	"Tailwind",
	"HTML",
	"CSS",
	"Git",
	"Figma",
	"Sketch",
] as const;

export type Skill = (typeof skillsData)[number];

export const softSkillsData = [
	"Communication",
	"Collaboration",
	"Creative Problem Solving",
	"Critical thinking",
	"Time management",
	"Team Leadership",
] as const;

export type SoftSkill = (typeof softSkillsData)[number];

// Skill icon mapping using SVG paths from public folder
export const skillIcons: Record<string, string> = {
	React: "/svg/skills/react.svg",
	"Next JS": "/svg/skills/nextJS.svg",
	Typescript: "/svg/skills/typescript.svg",
	Javascript: "/svg/skills/javascript.svg",
	Tailwind: "/svg/skills/tailwind.svg",
	HTML: "/svg/skills/html.svg",
	CSS: "/svg/skills/css.svg",
	Git: "/svg/skills/git.svg",
	Figma: "/svg/skills/figma.svg",
	Sketch: "/svg/skills/sketch.svg",
};
