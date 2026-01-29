export interface Experience {
	title: string;
	company: string;
	type?: "React" | "Manager" | "Developer";
	duration: string;
	description: string;
}

export const experiences: Experience[] = [
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
