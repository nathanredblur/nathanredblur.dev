export interface Experience {
	title: string;
	company: string;
	type?: "React" | "Manager" | "Developer" | "Full-time" | "Freelance";
	duration: string;
	description: string;
}

export const experiences: Experience[] = [
	{
		title: "Senior Frontend Engineer",
		company: "Parser",
		type: "Full-time",
		duration: "May 2025 - Present",
		description:
			"Developing mission-critical banking applications serving millions in the financial services sector. Leading accessibility initiatives to achieve WCAG 2.1 AA compliance while building modern React/TypeScript interfaces. Pioneering AI-assisted development with Claude 4.5, GPT 5.2, and Cursor to accelerate code quality, architectural decisions, and automated reviews. Maintaining excellence through Jest, React Testing Library, and Playwright testing.",
	},
	{
		title: "Senior Software Engineer",
		company: "EPAM Systems",
		type: "Full-time",
		duration: "Sep 2024 - May 2025",
		description:
			"Built enterprise-grade supply chain and inventory management solutions for a top US retail giant. Architected React/TypeScript interfaces with Ant Design, integrated TanStack Query for seamless data flow, developed NodeJS/Nest backend endpoints with GraphQL in a BFF architecture, and ensured quality through comprehensive testing with Jest, Enzyme, React Testing Library, and Cypress.",
	},
	{
		title: "Senior Frontend Developer",
		company: "Terminal49",
		type: "Freelance",
		duration: "Jun 2024 - Sep 2024",
		description:
			"Elevated the digital presence of a leading logistics technology company. Optimized their NextJS website, crafted reusable components for Sanity CMS, boosted performance across platforms, enhanced EmberJs internal tools, and collaborated with marketing to strengthen SEO and web visibility.",
	},
	{
		title: "Senior React Developer",
		company: "Getaround",
		type: "React",
		duration: "May 2022 - Feb 2024",
		description:
			"I led the development of new product features from start to finish, including conception, research, documentation, maintenance, and refinement. I also contributed to key initiatives to enhance system elegance and productivity, focusing on streamlining processes and internal tools. Over time, I took ownership of part of the codebase, adhering to standards and best practices while driving its growth. Additionally, I conducted peer code reviews, contributed to our design system, and collaborated on product vision and software design decisions.",
	},
	{
		title: "Senior React Developer",
		company: "AirTm",
		type: "React",
		duration: "Jan 2021 - May 2022",
		description:
			"Front-end development for a financial services application that relies on a cryptocurrency backend.",
	},
	{
		title: "Front-end Manager",
		company: "AllTheRooms",
		type: "Manager",
		duration: "Jun 2013 - Jan 2021",
		description:
			"I was the lead front-end developer for a travel metasearch product with a cutting-edge front-end that became a touchstone throughout the travel industry. Started in Angular and successfully migrated to React/Redux. I developed the front end for a self-service B2B analytics product, using React, Next.js, GraphQL and Apollo client. My responsibilities included UX design.",
	},
	{
		title: "Front-End Developer",
		company: "Victory Productions",
		type: "Developer",
		duration: "Dec 2010 - Jun 2013",
		description:
			"Develop a complex front-end application for an e-learning product, using web frameworks like Angular and Backbone.",
	},
	{
		title: "Front-end Developer",
		company: "PRAGMA",
		type: "Developer",
		duration: "Feb 2009 - Dec 2010",
		description: "Develop sites in Adobe Flash and HTML/CSS.",
	},
	{
		title: "Front-end Developer",
		company: "ITM University, Peesco, Revista Kanzen, and others",
		type: "Developer",
		duration: "Jul 2005 - Feb 2009",
		description:
			"Creating engaging interactive games with Adobe Flash and ActionScript for ITM University's online education platform. Experienced Entrepreneur and Tech Lead specializing in creating custom WordPress templates and plugins for Joomla, ELGG, and Moodle platforms. Skilled in leading teams and delivering innovative solutions to drive business growth. Passionate about leveraging technology to enhance user experiences.",
	},
];
