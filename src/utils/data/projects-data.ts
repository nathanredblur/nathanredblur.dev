export type ProjectData = {
    id: number;
    name: string;
    description: string;
    tools: string[];
    role: string;
    code: string;
    demo: string;
    image: string;
    tags?: string[];
};

export const projectsData = [
    {
        id: 1,
        name: 'Getaround',
        description: "As a member of Getaround's Uber squad, we incorporated Uber's platform to allow Uber drivers to rent cars. This required proficiency in Ruby on Rails and an understanding of a new full-stack architecture. I worked closely with the design, product, and data science teams to anticipate issues and guarantee optimal performance. Learning Ruby on Rails was a challenge, but it was crucial to the project's success, demonstrating our team's diligence and commitment.",
        tools: ['Typescript', 'Cobalt', 'React', 'Ruby on Rails', 'Mapbox', 'React Query', 'Redux', 'Jaml', 'Storybook',],
        role: 'Senior Frontend Developer',
        code: '',
        demo: 'https://getaround.com/',
        image: '',
    },
    {
        id: 2,
        name: 'AirTM',
        description: 'I solve numerouse issues and added new features to the platform.',
        tools: ['React', 'SCSS', "TypeScript"],
        role: 'Senior Frontend Developer',
        code: '',
        demo: 'https://www.airtm.com/',
        image: '',
    },
    {
        id: 3,
        name: 'AllTheRooms Analytics',
        description: 'My team and I developed a dashboard showcasing advanced graphs and maps providing insights into the vacation rental market. We utilized React, Next.js, TypeScript, the Google Maps API, and Stripe.',
        tools: ['React', 'Next JS', 'Apollo GraphQL', 'Stripe', 'TypeScript', 'JWT'],
        code: '',
        role: 'Frontend Lead',
        demo: 'https://analytics.alltherooms.com/',
        image: '',
    },
    {
        id: 4,
        name: 'AllTheRooms',
        description: `I played a pivotal role in shaping the user experience and technical aspects. I defined the frontend architecture, selected the most suitable framework, and established an efficient workflow. My mentorship and guidance helped the technical team members, fostering a collaborative environment. Coordinating team efforts, I assigned tasks to individual team members, streamlining our development process. Actively contributing to enhancing the user experience, I focused on making the frontend intuitive and engaging. My attention to detail and adherence to best practices ensured that our frontend components were robust and efficient. Overall, my role was instrumental in delivering a successful project that combined functionality, aesthetics, and user satisfaction.`,
        tools: ['Angular 1', 'React', 'TypeScript', 'Google Maps', 'SEO',],
        code: '',
        role: 'Frontend Lead',
        demo: 'https://www.alltherooms.com/',
        image: ''
    }
];


// Do not remove any property.
// Leave it blank instead as shown below

// {
//     id: 1,
//     name: '',
//     description: "",
//     tools: [],
//     role: '',
//     code: '',
//     demo: '',
//     image: crefin,
// },