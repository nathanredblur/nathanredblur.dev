export const resumeProfile = {
  fullName: "Jonathan Rico",
  title: "Senior Software Engineer & UX Designer",
  summary:
    "Dynamic front-end developer with 15 years of experience, specializing in React, Next.js, and modern web development frameworks. Proven track record in building scalable, user-centric applications and mentoring front-end teams to foster continuous learning. Passionate about leveraging cutting-edge technologies and best practices to drive innovation and deliver high-quality software solutions.",
  location: "Medellín, CO",
  yearsExperience: "20+ years",
  availability: "Remote worldwide",
  email: "jon.nathan.rich@gmail.com",
  website: "https://nathanredblur.dev/",
  linkedin: "linkedin.com/in/nathanredblur",
  photo: "/photo.jpeg",
  softSkills: [
    "Systems Thinking",
    "Technical Leadership",
    "Creative Problem Solving",
    "Critical Thinking",
    "Async Collaboration",
    "Clear Written Communication",
  ],
} as const;

export type ResumeProfile = typeof resumeProfile;
