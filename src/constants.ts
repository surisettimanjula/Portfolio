import { Project, Experience, Profile } from "./types";

export const LAST_UPDATED = 1716300000000;

export const INITIAL_PROFILE_IMAGE: string | null = null;
export const INITIAL_RESUME_URL: string = "#";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Project Alpha",
    desc: "A sample project description describing what was built and the impact it had.",
    tech: ["React", "TypeScript", "Tailwind"],
    link: "#",
    linkLabel: "View Code",
    updated: "2025"
  }
];

export const INITIAL_SKILLS: string[] = ["React", "TypeScript", "DevOps"];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Corp",
    date: "2024 — Present",
    desc: "Building scalable applications.",
    type: "Full-time"
  }
];

export const INITIAL_PROFILE: Profile = {
  name: "Your Name",
  role: "Software Developer",
  tagline: "Building the future.",
  bio: "Brief bio about yourself.",
  location: "City, Country",
  email: "email@example.com",
  formActionUrl: "",
  socials: {
    github: "#",
    linkedin: "#"
  },
  stats: {
    yearsExp: "1+",
    certs: "0",
    uptime: "100%"
  }
};