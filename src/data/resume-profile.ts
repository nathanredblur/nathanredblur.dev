export const resumeProfile = {
  fullName: "Jonathan Rico",
  title: "Senior Software Engineer",
  summary:
    "AI-native Senior Software Engineer with 20 years of experience and deep frontend expertise in React, Next.js, and Astro, with ownership that extends to Node/Nest APIs and internal developer platforms. Works with agentic workflows (Claude Code, Cursor) applying context engineering to structure codebases and AI configurations so agents operate with full architectural awareness. Rigorous about architecture review, security validation, and code quality on AI-generated outputs. Track record across edtech, fintech, supply chain, travel aggregation, and peer-to-peer car sharing.",
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
