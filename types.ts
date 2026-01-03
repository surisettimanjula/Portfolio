export interface Project {
  id: number;
  title: string;
  desc: string;
  tech: string[];
  link: string;
  linkLabel: string;
  updated: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  date: string;
  desc: string;
  type: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  formActionUrl?: string; // URL for form submission service (e.g., Formspree)
  socials: {
    github: string;
    linkedin: string;
  };
  stats: {
    yearsExp: string;
    certs: string;
    uptime: string;
  };
}

export interface StatProps {
  label: string;
  value: string;
}

export interface SocialIconProps {
  label: string;
  href: string;
}