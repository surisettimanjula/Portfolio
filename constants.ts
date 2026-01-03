import { Project, Experience, Profile } from "./types";

export const LAST_UPDATED = 1716300000000; // Initial timestamp

// These will hold the Base64 strings for your image and resume when exported
export const INITIAL_PROFILE_IMAGE: string | null = null;
export const INITIAL_RESUME_URL: string = "#";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "CI/CD Pipeline for E-Commerce API",
    desc: "Automated build, test, and deploy using GitHub Actions -> Jenkins -> AWS ECS. Blue/green deploys and canary testing.",
    tech: ["GitHub Actions", "Jenkins", "Docker", "AWS ECS", "Terraform"],
    link: "#",
    linkLabel: "View repo",
    updated: "2025"
  },
  {
    id: 2,
    title: "Infrastructure as Code (IaC)",
    desc: "Modular Terraform modules for VPC, RDS, and EKS clusters—policy-as-code with Sentinel/OPA.",
    tech: ["Terraform", "Helm", "Kubernetes", "AWS"],
    link: "#",
    linkLabel: "View repo",
    updated: "2025"
  },
  {
    id: 3,
    title: "Monitoring & Observability",
    desc: "Prometheus + Grafana for metrics, Fluentd -> ELK stack for logs and PagerDuty integration.",
    tech: ["Prometheus", "Grafana", "ELK", "PagerDuty"],
    link: "#",
    linkLabel: "View repo",
    updated: "2025"
  }
];

export const INITIAL_SKILLS: string[] = [
  "AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux", "Bash", "Ansible", "Prometheus", "Grafana"
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: 'Associate DevOps Engineer',
    company: 'Company name',
    date: '2024 — Present',
    desc: 'Owned CI pipelines, automated infra provisioning, and reduced deploy time by 40% using Docker and Terraform.',
    type: 'Full-time'
  },
  {
    id: 2,
    title: 'Site Reliability Intern',
    company: 'Another Company',
    date: '2023 — 2024',
    desc: 'Built dashboards, alerting rules, and runbooks. On-call rotations and incident postmortems.',
    type: 'Intern'
  }
];

export const INITIAL_PROFILE: Profile = {
  name: "Ramakrishna Peddhada",
  role: "DevOps Engineer",
  tagline: "DevOps Engineer • Cloud & Automation",
  bio: "I build reliable, scalable infrastructure and CI/CD systems that let engineering teams move fast without breaking things. I love automation, observability, and a good bash one-liner.",
  location: "City, Country",
  email: "ramakrishna.peddhada@gmail.com",
  formActionUrl: "https://formspree.io/f/xykzwyjn",
  socials: {
    github: "https://github.com/ramky3064",
    linkedin: "https://www.linkedin.com/in/rama-krishna-p"
  },
  stats: {
    yearsExp: "3+",
    certs: "2",
    uptime: "99.99%"
  }
};