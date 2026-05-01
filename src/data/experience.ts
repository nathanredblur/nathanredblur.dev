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
