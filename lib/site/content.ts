import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const siteUrl = "https://100securityprompts.com";

export const product = {
  brand: "100SecurityPrompts.com",
  name: "100 AI Prompts for Security Managers",
  headline: "100 Practical ChatGPT Prompts for Security Managers & Supervisors",
  subheadline:
    "Save hours every week with proven AI prompts for incident reports, investigations, shift handovers, risk assessments, team management, client communication and security operations.",
  price: "£19",
  priceMinor: 1900,
  currency: "gbp",
  bonus: "25 Real-World Security Manager AI Use Cases",
  supportEmail: "support@100securityprompts.com",
  stripePaymentLink: "https://buy.stripe.com/14AeVdcaw9Xw8bPciSgA809",
};

export const navItems = [
  ["What's Included", "/#included"],
  ["Samples", "/#samples"],
  ["About", "/about"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
] as const;

export const includedItems = [
  "100 Security-Focused ChatGPT Prompts",
  "25 Real-World Security Manager AI Use Cases",
  "Copy-and-Paste Format",
  "Incident Reporting Prompts",
  "Investigation Prompts",
  "Risk Assessment Prompts",
  "Leadership & Management Prompts",
  "Client Communication Prompts",
  "Shift Handover Prompts",
  "Emergency Response Prompts",
  "Instant PDF Download",
];

export const audiences = [
  "Security Supervisors",
  "Security Managers",
  "Duty Managers",
  "Control Room Managers",
  "Contract Managers",
  "Security Company Owners",
  "Corporate Security Teams",
];

export const faqs = [
  {
    question: "Is this a generic AI prompt bundle?",
    answer:
      "No. It is built specifically for security managers and supervisors, with prompts for real operational tasks such as incident reports, investigations, handovers, risk assessments, team communication and client updates.",
  },
  {
    question: "What do I receive after purchase?",
    answer:
      "You receive instant access to a downloadable PDF containing 100 security-focused ChatGPT prompts plus 25 practical AI use cases for security managers.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. This is a one-time payment of £19. There are no memberships, dashboards, subscriptions or user accounts.",
  },
  {
    question: "Can my team use it?",
    answer:
      "The launch license is intended for personal professional use by the purchaser. Security companies or teams that want wider internal use can contact support for permission.",
  },
  {
    question: "How is payment handled?",
    answer:
      "Payments are processed securely through Stripe Checkout. 100SecurityPrompts.com does not store card details.",
  },
  {
    question: "What if I have trouble downloading the PDF?",
    answer:
      `Email ${product.supportEmail} with your purchase details and support will help you access the file.`,
  },
];

export const samplePrompts = [
  {
    title: "Incident Report Clarity",
    prompt:
      "Rewrite this incident report in a clear, objective and professional security management style. Keep the facts, remove emotion, highlight actions taken, and list any follow-up recommendations.",
  },
  {
    title: "Shift Handover",
    prompt:
      "Create a concise shift handover summary from these notes. Include open risks, incidents, patrol issues, visitor concerns, equipment faults and actions for the incoming supervisor.",
  },
  {
    title: "Client Update",
    prompt:
      "Turn these operational notes into a calm client update. Summarise what happened, what the security team did, current status, next steps and any management decisions required.",
  },
];

type BlogPost = {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  published: string;
  readingTime?: string;
  articleType?: string;
  targetKeyword?: string;
  tags?: string[];
  cta?: string;
  body?: string;
  sections: readonly (readonly [string, string])[];
};

type GeneratedBlogPost = {
  slug?: string;
  title?: string;
  seoTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  description?: string;
  date?: string;
  publishedDate?: string;
  readingTime?: string;
  readingTimeMinutes?: number;
  articleType?: string;
  targetKeyword?: string;
  tags?: string[];
  keywordVariations?: string[];
  cta?: string;
  content?: string;
  body?: string;
  articleMarkdown?: string;
};

const contentDirectory = path.join(process.cwd(), "content", "blog");

const manualBlogPosts = [
  {
    slug: "ai-prompts-for-security-managers",
    title: "AI Prompts for Security Managers",
    description:
      "A practical guide to using AI prompts for security managers without losing professional judgement, accuracy or operational control.",
    published: "2026-06-06",
    sections: [
      [
        "Why security managers are using AI prompts",
        "Security managers write constantly: incident reports, handovers, risk updates, client emails, investigation summaries and team briefings. AI prompts help turn rough notes into clearer first drafts so managers can spend more time checking facts, making decisions and leading the operation.",
      ],
      [
        "Where prompts add the most value",
        "The highest-value use cases are structured writing tasks. Prompts can help organise evidence, improve tone, create checklists, prepare meeting notes and standardise recurring operational communication.",
      ],
      [
        "Keep professional oversight",
        "AI should support security judgement, not replace it. Managers should verify every fact, remove sensitive information where needed, follow company policy and make sure any final document reflects what actually happened.",
      ],
    ],
  },
  {
    slug: "how-security-managers-can-use-chatgpt",
    title: "How Security Managers Can Use ChatGPT",
    description:
      "Seven practical ways security managers can use ChatGPT for reports, briefings, leadership communication and operational planning.",
    published: "2026-06-06",
    sections: [
      [
        "Start with repeatable management tasks",
        "ChatGPT works best when the task has a clear format. Security managers can use it to draft shift briefings, convert bullet points into reports, prepare client updates and build patrol checklists.",
      ],
      [
        "Use context, not confidential data",
        "A useful prompt explains the audience, desired tone, format and objective. Avoid entering personal data, confidential client information or sensitive operational details unless your organisation has approved that use.",
      ],
      [
        "Build a prompt library",
        "A prompt library gives supervisors consistent starting points. Over time, managers can adapt prompts for their site, contract, reporting templates and escalation process.",
      ],
    ],
  },
  {
    slug: "chatgpt-for-incident-reports",
    title: "ChatGPT for Incident Reports",
    description:
      "How to use ChatGPT to improve incident report structure, clarity and follow-up actions while keeping the report factual.",
    published: "2026-06-06",
    sections: [
      [
        "Better structure from rough notes",
        "Incident notes are often written quickly during a busy shift. ChatGPT can help turn those notes into a logical report with time, location, people involved, actions taken, outcome and recommendations.",
      ],
      [
        "Keep the facts intact",
        "The manager remains responsible for accuracy. The safest approach is to ask AI to improve structure and language while preserving the original facts and flagging anything that is missing or unclear.",
      ],
      [
        "Use prompts for follow-up actions",
        "After the report is drafted, AI can help create a follow-up checklist for CCTV review, witness statements, client notification, maintenance issues, training needs or escalation.",
      ],
    ],
  },
  {
    slug: "security-supervisor-tools",
    title: "Security Supervisor Tools: Where AI Fits",
    description:
      "A practical look at AI as a security supervisor tool for handovers, patrol notes, briefings and daily operational communication.",
    published: "2026-06-06",
    sections: [
      [
        "AI as an assistant, not a replacement",
        "Security supervisors need tools that save time without weakening accountability. AI can assist with drafts, summaries and checklists, but the supervisor must still verify events and apply site procedures.",
      ],
      [
        "Useful supervisor workflows",
        "Common workflows include handover summaries, daily occurrence logs, briefing notes, officer coaching points, incident timelines and client-facing updates.",
      ],
      [
        "Standardisation helps teams",
        "When supervisors use consistent prompts, reporting quality becomes easier to manage across shifts. That can improve continuity, reduce omissions and make contract communication more professional.",
      ],
    ],
  },
  {
    slug: "ai-tools-for-corporate-security",
    title: "AI Tools for Corporate Security Teams",
    description:
      "How corporate security teams can use AI prompts for communication, reporting, risk reviews and operational leadership.",
    published: "2026-06-06",
    sections: [
      [
        "Corporate security needs clear communication",
        "Corporate security teams often brief stakeholders who are not security specialists. AI prompts can help translate operational detail into clear summaries for facilities, HR, legal, executives and clients.",
      ],
      [
        "Support risk and incident workflows",
        "Prompts can support risk assessment drafts, post-incident reviews, lessons learned documents and recurring governance updates. The benefit is speed and structure, not automatic decision-making.",
      ],
      [
        "Use policy-led controls",
        "Teams should set rules for sensitive data, approved platforms, record keeping and review. AI works best when it sits inside a controlled management process.",
      ],
    ],
  },
] as const satisfies readonly BlogPost[];

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function toGeneratedBlogPost(raw: GeneratedBlogPost): BlogPost | null {
  if (!raw.slug || !raw.title) return null;

  const body = raw.articleMarkdown || raw.content || raw.body || "";
  if (!body.trim()) return null;

  const tags = Array.isArray(raw.tags)
    ? raw.tags
    : Array.isArray(raw.keywordVariations)
      ? raw.keywordVariations
      : [];

  return {
    slug: raw.slug,
    title: raw.title,
    seoTitle: raw.seoTitle || raw.metaTitle || raw.title,
    description: raw.metaDescription || raw.excerpt || raw.description || raw.title,
    published: raw.publishedDate || raw.date || new Date().toISOString(),
    readingTime:
      raw.readingTime ||
      (raw.readingTimeMinutes ? `${raw.readingTimeMinutes} min read` : estimateReadingTime(body)),
    articleType: raw.articleType || "Security Management",
    targetKeyword: raw.targetKeyword || tags[0] || "",
    tags,
    cta: raw.cta,
    body,
    sections: [],
  };
}

function getGeneratedBlogPosts() {
  if (!existsSync(contentDirectory)) return [];

  return readdirSync(contentDirectory)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      try {
        const raw = readFileSync(path.join(contentDirectory, file), "utf8");
        const post = toGeneratedBlogPost(JSON.parse(raw) as GeneratedBlogPost);
        return post ? [post] : [];
      } catch {
        return [];
      }
    });
}

const generatedBlogPosts = getGeneratedBlogPosts();
const generatedSlugs = new Set(generatedBlogPosts.map((post) => post.slug));

export const blogPosts: BlogPost[] = [
  ...generatedBlogPosts,
  ...manualBlogPosts.filter((post) => !generatedSlugs.has(post.slug)),
].sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
