export interface PersonalProject {
	title: string;
	description: string;
	github: string;
	website?: string;
	screenshot?: string;
	status?: string;
	tools: string[];
}

export const personalProjects: PersonalProject[] = [
	{
		title: "Mac Snap",
		description:
			"A comprehensive macOS setup tool designed to streamline the process of configuring a new Mac or refreshing an existing one. Features 105+ curated applications, 42+ system tweaks, smart selection tools, and one-click Homebrew installation scripts.",
		github: "https://github.com/nathanredblur/osx-setup",
		website: "https://macsnap.nathanredblur.dev/",
		status: "Code will be published soon",
		tools: ["TypeScript", "React", "Tailwind CSS", "Homebrew"],
	},
	{
		title: "Brutal Print",
		description:
			"A modern web application for designing and printing on MXW01 thermal printers. Drag, resize, and rotate elements like Canva, then print directly via Bluetooth. Features 5 dithering algorithms, layer management, and auto-save.",
		github: "https://github.com/nathanredblur/brutal-print",
		status: "Will be online soon",
		tools: ["Astro", "React", "TypeScript", "Fabric.js", "Web Bluetooth"],
	},
];
