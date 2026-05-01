export interface Certification {
	name: string;
	issuer: string;
	year?: string;
	url?: string;
}

export const certifications: Certification[] = [
	{
		name: "EF SET English Certificate (B2 Upper Intermediate)",
		issuer: "EF SET",
	},
	{ name: "Visual Elements of User Interface Design", issuer: "Coursera" },
	{ name: "React Hooks Professional Course", issuer: "Platzi" },
	{ name: "Advanced React Course", issuer: "Platzi" },
	{ name: "ECMAScript 6+ Course", issuer: "Platzi" },
];
