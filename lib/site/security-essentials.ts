import { buildAmazonUkSearchUrl } from "@/lib/site/amazon-affiliate";

export const recommendedSecurityEssentialsPath = "/recommended-security-essentials";

export const recommendedSecurityEssentialsMetadata = {
  title: "Recommended Security Essentials for UK Security Professionals",
  description:
    "Practical Amazon UK search recommendations for security officers, supervisors and managers choosing work supplies, PPE, study materials and control-room essentials.",
} as const;

export const securityEssentialsCategories = [
  {
    title: "Notebooks, Pocketbooks and Incident-Reporting Supplies",
    description:
      "Useful for patrol notes, pocket observations, occurrence entries and incident-report preparation before details are transferred into the approved reporting system.",
    searchTerm: "security officer pocket notebook incident report book",
    linkText: "Search Amazon UK for security pocket notebooks and report books",
  },
  {
    title: "Pens, Permanent Markers and Clipboards",
    description:
      "Simple writing supplies for signing visitors in, marking evidence bags where authorised, completing checklists and keeping forms tidy during busy shifts.",
    searchTerm: "security clipboard waterproof pens permanent markers",
    linkText: "Search Amazon UK for pens, markers and clipboards",
  },
  {
    title: "Torches and Replacement Batteries",
    description:
      "Lighting for lawful patrol, lock-up checks and emergency readiness. Choose site-appropriate brightness and battery type, and follow assignment instructions.",
    searchTerm: "security patrol torch rechargeable batteries UK",
    linkText: "Search Amazon UK for patrol torches and batteries",
  },
  {
    title: "Hi-Vis Clothing and Weather Protection",
    description:
      "Outerwear and visibility options may help outdoor posts, car parks and gatehouse duties, subject to uniform rules and the employer risk assessment.",
    searchTerm: "hi vis waterproof jacket security officer",
    linkText: "Search Amazon UK for hi-vis and weather protection",
  },
  {
    title: "Comfortable Footwear and Insoles",
    description:
      "Long shifts can mean long periods standing or walking. Use employer uniform standards, PPE requirements and site risk assessments when choosing footwear.",
    searchTerm: "comfortable black work shoes security officer insoles",
    linkText: "Search Amazon UK for work footwear and insoles",
  },
  {
    title: "Watches and Timekeeping Accessories",
    description:
      "Reliable timekeeping helps with patrol logs, handovers, incident timelines and welfare checks where phones are not suitable or permitted.",
    searchTerm: "digital watch security officer work watch",
    linkText: "Search Amazon UK for work watches and timekeeping accessories",
  },
  {
    title: "Radios, Earpieces and Compatible Accessories",
    description:
      "Only use accessories that are compatible with employer-issued radios and approved for the site. Do not replace or modify communications equipment without permission.",
    searchTerm: "security radio earpiece compatible accessory",
    linkText: "Search Amazon UK for radio earpieces and accessories",
  },
  {
    title: "Power Banks and Charging Cables",
    description:
      "Backup charging can help supervisors keep authorised phones, tablets and body-worn admin devices available during long shifts or emergency disruption.",
    searchTerm: "power bank charging cable work phone",
    linkText: "Search Amazon UK for power banks and charging cables",
  },
  {
    title: "Document Folders and Secure Storage",
    description:
      "Folders, binders and lockable organisers can support assignment instructions, checklists, permit folders and office paperwork where the data-handling policy allows it.",
    searchTerm: "document folder lockable storage office security",
    linkText: "Search Amazon UK for document folders and secure storage",
  },
  {
    title: "First-Aid Reference Materials",
    description:
      "Reference guides can support training refreshers, but they do not replace approved first-aid training, workplace procedures or emergency-service advice.",
    searchTerm: "first aid pocket guide workplace UK",
    linkText: "Search Amazon UK for first-aid reference materials",
  },
  {
    title: "Security Management and Leadership Books",
    description:
      "Books on leadership, supervision and security management can help supervisors develop judgement, communication and team-management habits.",
    searchTerm: "security management leadership books UK",
    linkText: "Search Amazon UK for security management and leadership books",
  },
  {
    title: "Study Materials for Professional Development",
    description:
      "Study resources can support continuing professional development, but always check current SIA, awarding-body or employer requirements before relying on any material.",
    searchTerm: "SIA security training study guide UK",
    linkText: "Search Amazon UK for security study materials",
  },
  {
    title: "Desk Equipment for Control Rooms and Security Offices",
    description:
      "Desk supplies can help control-room operators organise logs, keys, handover notes, charging points and daily admin without disrupting site procedures.",
    searchTerm: "control room desk organiser office supplies security",
    linkText: "Search Amazon UK for control-room and security office equipment",
  },
].map((category) => ({
  ...category,
  slug: category.title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  href: buildAmazonUkSearchUrl(category.searchTerm),
}));

export const restrictedEquipmentNotice = [
  "Do not buy or carry weapons, restraints, unlawful surveillance devices, licence-restricted items or equipment your employer has not authorised.",
  "Radio accessories must be compatible with employer-issued equipment and approved before use.",
  "PPE, hi-vis clothing and footwear should be selected using your employer's risk assessment, assignment instructions and uniform requirements.",
  "Purchases are completed through Amazon; 100 Security Prompts does not process orders, deliveries, refunds, returns or warranties.",
] as const;
