import { product, siteUrl } from "@/lib/site/content";

export type PromptSample = {
  title: string;
  helpsWith: string;
  prompt: string;
  variables: readonly string[];
};

export type PromptCollection = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  primaryKeyword: string;
  audience: readonly string[];
  intro: string;
  useCases: readonly string[];
  samples: readonly PromptSample[];
  customisationTips: readonly string[];
  responsibleUse: readonly string[];
  relatedCollections: readonly string[];
  blogLinks: readonly {
    slug: string;
    label: string;
  }[];
  sourceData: readonly string[];
};

const sharedResponsibleUse = [
  "Remove personal data, confidential client details and sensitive site information unless your organisation has approved that AI use.",
  "Check every fact against the original notes before sending, filing or escalating the output.",
  "Treat each response as drafting support. The security manager, supervisor or authorised reviewer remains responsible for judgement and final wording.",
] as const;

export const rejectedPromptCollectionSlugs = [
  "cybersecurity-incident-response-prompts",
  "security-prompts-london",
  "retail-security-prompts",
  "healthcare-security-prompts",
  "physical-security-prompts",
] as const;

export const promptCollections: readonly PromptCollection[] = [
  {
    slug: "incident-report-prompts",
    title: "Security Incident Report Prompts",
    h1: "Security Incident Report Prompts",
    description:
      "Sample AI prompts that help security managers turn rough incident notes into clearer reports, follow-up actions and management summaries.",
    primaryKeyword: "security incident report prompts",
    audience: ["Security supervisors", "Security managers", "Control room managers"],
    intro:
      "Incident reporting is one of the highest-pressure writing tasks in security management. These sample prompts are designed to help structure facts, actions, impact and follow-up without changing what happened or replacing the manager's review.",
    useCases: [
      "Turning rough shift notes into a clear incident narrative",
      "Identifying missing facts before a report is submitted",
      "Preparing a short management summary after a serious incident",
      "Creating proportionate follow-up actions after a breach, alarm activation or disorder incident",
    ],
    samples: [
      {
        title: "Incident report structure prompt",
        helpsWith: "Converts rough notes into a factual report format.",
        prompt:
          "Act as a security operations manager reviewing rough incident notes. Create a clear draft incident report with sections for timeline, people involved, location, actions taken, current status, evidence available and recommended follow-up. Do not add facts that are not in the notes. Flag any missing information as questions.",
        variables: ["incident notes", "site or area", "time period", "actions already taken"],
      },
      {
        title: "Missing information check",
        helpsWith: "Finds gaps before the report is sent to a client or manager.",
        prompt:
          "Review the incident summary below and list the information that is missing or unclear. Group the gaps under time, location, people, evidence, immediate actions, escalation and next steps. Keep the wording neutral and practical.",
        variables: ["draft report", "reporting standard", "required escalation route"],
      },
      {
        title: "Executive incident summary",
        helpsWith: "Creates a concise version for senior stakeholders.",
        prompt:
          "Summarise this security incident for a senior manager who needs the facts, operational impact and next decision. Use plain English, separate confirmed facts from assumptions, and include no more than five recommended actions.",
        variables: ["full incident report", "stakeholder", "decision needed"],
      },
      {
        title: "Post-incident action list",
        helpsWith: "Turns the report into practical follow-up.",
        prompt:
          "Create a post-incident action list from this report. Include action owner, priority, deadline, evidence to check and whether the action is for security, facilities, HR, client management or training.",
        variables: ["incident report", "available owners", "required review date"],
      },
    ],
    customisationTips: [
      "Add the required report headings used by your employer or client.",
      "Tell the AI whether the output is for an internal log, client update or senior summary.",
      "Ask for missing information separately before asking for final wording.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["investigation-prompts", "shift-handover-prompts", "client-communication-prompts"],
    blogLinks: [
      { slug: "how-to-write-a-clear-security-incident-report-that-managers-can-act-on", label: "incident report guide" },
      { slug: "chatgpt-for-incident-reports", label: "ChatGPT for incident reports" },
    ],
    sourceData: ["Product prompts 1-15", "Homepage incident report sample", "Existing incident report blog guidance"],
  },
  {
    slug: "investigation-prompts",
    title: "Security Investigation Prompts",
    h1: "Security Investigation Prompts",
    description:
      "Practical sample prompts for security investigation planning, witness questions, CCTV review notes and evidence-gap analysis.",
    primaryKeyword: "security investigation prompts",
    audience: ["Security managers", "Corporate security teams", "Contract managers"],
    intro:
      "Security investigations need structure, neutrality and careful separation between evidence, assumptions and recommended action. These prompts help managers plan the work and organise findings while keeping decisions under human control.",
    useCases: [
      "Planning a proportionate fact-finding investigation",
      "Preparing witness interview questions",
      "Organising CCTV review notes",
      "Closing an investigation with evidence gaps and recommendations clearly stated",
    ],
    samples: [
      {
        title: "Investigation plan prompt",
        helpsWith: "Sets out the work before interviews or evidence review begin.",
        prompt:
          "Create a security investigation plan for the issue described below. Include scope, known facts, people to speak to, evidence to review, risks to manage, confidentiality points and a suggested sequence of actions. Keep the plan neutral and do not decide the outcome.",
        variables: ["issue summary", "site context", "available evidence", "deadline"],
      },
      {
        title: "Witness interview questions",
        helpsWith: "Builds open questions that avoid leading the witness.",
        prompt:
          "Draft open, non-leading witness interview questions for this security incident. Group the questions by what the witness saw, heard, did, reported and can clarify. Add a final section for documents or evidence to request.",
        variables: ["incident type", "witness role", "known timeline"],
      },
      {
        title: "CCTV review framework",
        helpsWith: "Keeps video review notes consistent.",
        prompt:
          "Create a CCTV review note template for this investigation. Include camera reference, review time, observed activity, confidence level, gaps in coverage and follow-up checks. Use factual language only.",
        variables: ["camera list", "time window", "incident location"],
      },
      {
        title: "Evidence gap analysis",
        helpsWith: "Shows what is known and what still needs verification.",
        prompt:
          "Review the investigation notes and create an evidence-gap table with columns for allegation or issue, evidence available, evidence missing, reliability concerns, next action and who should confirm the information before any conclusion is reached.",
        variables: ["investigation notes", "policy requirements", "decision deadline"],
      },
    ],
    customisationTips: [
      "State whether the work is fact-finding, disciplinary support, client assurance or operational review.",
      "Ask the AI to identify uncertainty instead of smoothing it away.",
      "Keep interview and evidence prompts separate so the output remains easier to audit.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["incident-report-prompts", "risk-assessment-prompts", "client-communication-prompts"],
    blogLinks: [
      { slug: "ai-tools-for-corporate-security", label: "AI tools for corporate security teams" },
      { slug: "how-security-managers-can-use-chatgpt", label: "using ChatGPT safely" },
    ],
    sourceData: ["Product prompts 41-55", "Bonus use cases 11-15"],
  },
  {
    slug: "risk-assessment-prompts",
    title: "Security Risk Assessment Prompts",
    h1: "Security Risk Assessment Prompts",
    description:
      "Sample prompts for security risk assessments, threat reviews, vulnerability checks, risk registers and mitigation planning.",
    primaryKeyword: "security risk assessment prompts",
    audience: ["Security managers", "Contract managers", "Corporate security teams"],
    intro:
      "Risk work is most useful when the output is specific enough to guide action. These sample prompts help security managers describe threats, vulnerabilities, controls, residual risk and mitigation plans without pretending that AI can inspect the site for them.",
    useCases: [
      "Preparing a first draft risk assessment from manager notes",
      "Reviewing vulnerabilities in access control, perimeter or lone-worker arrangements",
      "Creating a risk register for security actions",
      "Explaining risk recommendations to non-security stakeholders",
    ],
    samples: [
      {
        title: "Risk assessment draft",
        helpsWith: "Structures known hazards, threats and controls.",
        prompt:
          "Using only the information provided, draft a security risk assessment summary with sections for asset or area, threat, vulnerability, existing controls, possible impact, likelihood, residual concern and recommended mitigation. Flag anything that needs a site inspection or specialist confirmation.",
        variables: ["site notes", "asset or area", "known incidents", "current controls"],
      },
      {
        title: "Risk register builder",
        helpsWith: "Turns assessment findings into trackable actions.",
        prompt:
          "Create a security risk register from these findings. Include risk statement, current control, proposed action, owner, priority, review date and evidence needed to close the action.",
        variables: ["assessment findings", "available owners", "review cycle"],
      },
      {
        title: "Threat and vulnerability split",
        helpsWith: "Stops risk notes blending cause, weakness and impact.",
        prompt:
          "Separate these security notes into threats, vulnerabilities, current controls, evidence and assumptions. Add short questions where the notes are not specific enough to support a recommendation, especially where a site inspection or manager confirmation is still needed.",
        variables: ["raw risk notes", "site type", "known constraints"],
      },
      {
        title: "Executive risk summary",
        helpsWith: "Creates a concise summary for decision makers.",
        prompt:
          "Summarise this security risk review for a senior stakeholder. Focus on the top risks, why they matter, recommended decisions, cost or operational considerations and what should be reviewed next.",
        variables: ["risk review", "stakeholder group", "decision required"],
      },
    ],
    customisationTips: [
      "Provide current controls and known incidents, not just a location or asset name.",
      "Ask for assumptions to be labelled clearly.",
      "Add your organisation's risk scoring method only if you are authorised to use it.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["security-sop-prompts", "investigation-prompts", "emergency-response-prompts"],
    blogLinks: [
      { slug: "how-security-managers-can-use-ai-to-save-10-hours-per-week", label: "AI for security managers" },
      { slug: "ai-tools-for-corporate-security", label: "corporate security AI guidance" },
    ],
    sourceData: ["Product prompts 71-85", "Bonus use cases 8-9"],
  },
  {
    slug: "shift-handover-prompts",
    title: "Security Shift Handover Prompts",
    h1: "Security Shift Handover Prompts",
    description:
      "Sample prompts for clearer security shift handovers, open-risk summaries, patrol issues and incoming-supervisor action lists.",
    primaryKeyword: "security handover prompts",
    audience: ["Security supervisors", "Duty managers", "Control room managers"],
    intro:
      "A handover is not just a note at the end of a shift. It is the transfer of live risk, unfinished action and operational context. These prompts focus on concise handover outputs that the next supervisor can use quickly.",
    useCases: [
      "Summarising live risks before the incoming team takes over",
      "Separating completed actions from unresolved issues",
      "Highlighting patrol, access control, visitor and equipment concerns",
      "Creating an incoming supervisor checklist",
    ],
    samples: [
      {
        title: "Live handover summary",
        helpsWith: "Creates a concise handover from rough shift notes.",
        prompt:
          "Turn these shift notes into a clear security handover for the incoming supervisor. Include incidents, live risks, unresolved actions, patrol issues, visitor or contractor concerns, equipment faults and first checks for the next shift.",
        variables: ["shift notes", "site priorities", "incoming supervisor role"],
      },
      {
        title: "Open actions prompt",
        helpsWith: "Makes unfinished work visible.",
        prompt:
          "Extract all open actions from this shift record. For each action, state what is needed, why it matters, who should own it, suggested priority and what evidence confirms completion.",
        variables: ["shift record", "available owners", "priority rules"],
      },
      {
        title: "Repeat issue flag",
        helpsWith: "Shows patterns that should not be lost between shifts.",
        prompt:
          "Review these handover notes and identify any repeat issues, recurring patrol gaps, repeated equipment faults or unresolved client concerns. Suggest what the next supervisor should verify first.",
        variables: ["handover notes", "recent incidents", "patrol records"],
      },
      {
        title: "Verbal briefing script",
        helpsWith: "Prepares a short spoken handover.",
        prompt:
          "Create a two-minute verbal handover script from this written note. Keep it direct, prioritise live risk and include only the details the incoming team needs immediately.",
        variables: ["written handover", "shift change time", "priority risks"],
      },
    ],
    customisationTips: [
      "Tell the prompt which risks are still live, not just what happened earlier.",
      "Include the format your incoming supervisor expects.",
      "Ask for a separate first-check list for the next shift.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["incident-report-prompts", "control-room-security-prompts", "security-supervisor-prompts"],
    blogLinks: [
      { slug: "how-to-run-a-security-shift-handover-that-reduces-repeat-incidents", label: "shift handover guide" },
      { slug: "how-to-write-better-security-handover-notes", label: "handover notes guide" },
    ],
    sourceData: ["Product prompt 56", "Homepage shift handover sample", "Existing handover blog guidance"],
  },
  {
    slug: "client-communication-prompts",
    title: "Security Client Communication Prompts",
    h1: "Security Client Communication Prompts",
    description:
      "Sample prompts for security client updates, monthly reports, complaint responses, executive summaries and improvement plans.",
    primaryKeyword: "security client update prompts",
    audience: ["Contract managers", "Security managers", "Security company owners"],
    intro:
      "Client communication needs to be calm, factual and useful. These sample prompts help security leaders turn operational notes into updates that explain what happened, what has been done and what decision or support is needed.",
    useCases: [
      "Writing weekly or monthly client updates",
      "Responding professionally to service concerns",
      "Preparing security improvement proposals",
      "Summarising performance, KPIs and operational risk for review meetings",
    ],
    samples: [
      {
        title: "Client update from notes",
        helpsWith: "Turns operational notes into a calm client-facing update.",
        prompt:
          "Turn these operational security notes into a concise client update. Include what happened, current status, actions taken, risks being monitored, support needed from the client and next review point. Keep the tone professional and avoid blame.",
        variables: ["operational notes", "client audience", "review date"],
      },
      {
        title: "Complaint response draft",
        helpsWith: "Creates a measured first draft after a service concern.",
        prompt:
          "Draft a professional response to this client complaint. Acknowledge the concern, summarise the facts known so far, explain immediate actions, state what is being reviewed and avoid admitting fault before the investigation is complete.",
        variables: ["complaint details", "known facts", "actions taken"],
      },
      {
        title: "Monthly report outline",
        helpsWith: "Builds a structure for recurring client reporting.",
        prompt:
          "Create a monthly security report outline for this contract. Include incidents, near misses, staffing, patrol completion, visitor issues, access control concerns, training, improvement actions and decisions needed from the client.",
        variables: ["contract type", "month", "available KPIs"],
      },
      {
        title: "Service improvement proposal",
        helpsWith: "Frames recommendations without overpromising.",
        prompt:
          "Write a short security service improvement proposal using these findings. Include the issue, operational impact, recommended change, benefit, implementation considerations and how success should be reviewed.",
        variables: ["findings", "constraints", "success measure"],
      },
    ],
    customisationTips: [
      "Identify whether the message is for a facilities manager, HR contact, senior leader or contract owner.",
      "Provide the desired tone before asking for the draft.",
      "Separate facts from recommendations when the issue is sensitive.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["incident-report-prompts", "risk-assessment-prompts", "security-leadership-prompts"],
    blogLinks: [
      { slug: "ai-tools-for-corporate-security", label: "corporate security communication" },
      { slug: "how-security-managers-can-use-chatgpt", label: "ChatGPT guidance for managers" },
    ],
    sourceData: ["Product prompts 31-40", "Homepage client update sample", "Bonus use cases 6-7 and 24"],
  },
  {
    slug: "security-leadership-prompts",
    title: "Security Leadership Prompts",
    h1: "Security Leadership Prompts",
    description:
      "Sample AI prompts for security leadership communication, coaching, attendance management, performance conversations and team briefings.",
    primaryKeyword: "security leadership prompts",
    audience: ["Security supervisors", "Security managers", "Duty managers"],
    intro:
      "Security leadership often depends on clear, fair and consistent communication. These prompts help managers prepare for coaching, briefings and team conversations while keeping policy, fairness and judgement in human hands.",
    useCases: [
      "Preparing for officer coaching conversations",
      "Structuring fair performance and attendance discussions",
      "Creating briefings that turn incidents into learning points",
      "Reflecting on team morale, delegation and leadership priorities",
    ],
    samples: [
      {
        title: "Officer coaching preparation",
        helpsWith: "Plans a practical coaching conversation.",
        prompt:
          "Help me prepare for a security officer coaching conversation. Use the facts below to create a fair conversation structure covering what happened, expected standard, questions to ask, support to offer and agreed next steps.",
        variables: ["facts", "expected standard", "support options"],
      },
      {
        title: "Team briefing from incident",
        helpsWith: "Turns a real issue into a constructive briefing.",
        prompt:
          "Create a short team briefing from this security incident. Focus on learning points, expected behaviours, escalation reminders and practical prevention steps. Do not name individuals or include confidential details.",
        variables: ["incident summary", "team role", "site procedure"],
      },
      {
        title: "Performance conversation structure",
        helpsWith: "Keeps sensitive conversations organised.",
        prompt:
          "Create a structured agenda for a performance conversation with a security team member. Include facts to confirm, questions to ask, standards to restate, support options, agreed actions and review date.",
        variables: ["performance concern", "policy context", "review date"],
      },
      {
        title: "Leadership reflection prompt",
        helpsWith: "Reviews management approach after a difficult week.",
        prompt:
          "Ask me ten reflective questions to review my security leadership this week. Cover communication, decisions, team support, client confidence, unresolved risks and what I should improve before the next shift cycle.",
        variables: ["week summary", "team size", "main pressures"],
      },
    ],
    customisationTips: [
      "Use policy-approved wording for formal HR processes.",
      "Keep coaching prompts separate from disciplinary decisions.",
      "Ask for a balanced tone that is clear, fair and specific.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["security-supervisor-prompts", "client-communication-prompts", "shift-handover-prompts"],
    blogLinks: [
      { slug: "security-supervisor-tools", label: "AI as a supervisor tool" },
      { slug: "security-briefing-template-for-shift-supervisors", label: "security briefing template" },
    ],
    sourceData: ["Product prompts 16-30", "Recruitment and training prompts 86-100", "Bonus use cases 3-5 and 18-22"],
  },
  {
    slug: "emergency-response-prompts",
    title: "Security Emergency Response Prompts",
    h1: "Security Emergency Response Prompts",
    description:
      "Sample prompts for emergency response planning, evacuation reports, lockdown notes, medical emergency records and drill briefings.",
    primaryKeyword: "security emergency response prompts",
    audience: ["Security managers", "Duty managers", "Security supervisors"],
    intro:
      "Emergency response prompts must be used carefully. They can help organise planning notes, drill briefings and post-incident summaries, but they must never replace site procedures, emergency services guidance or authorised command decisions.",
    useCases: [
      "Preparing emergency drill briefings",
      "Structuring evacuation, lockdown or medical emergency reports",
      "Reviewing business continuity support actions",
      "Creating post-drill learning points for security teams",
    ],
    samples: [
      {
        title: "Emergency drill briefing",
        helpsWith: "Prepares a controlled briefing before a drill.",
        prompt:
          "Create a security team briefing for an emergency drill. Include the drill objective, roles, communication points, safety reminders, escalation route, observation notes to capture and debrief questions.",
        variables: ["drill type", "site procedure", "team roles"],
      },
      {
        title: "Evacuation report draft",
        helpsWith: "Structures post-event facts and learning points.",
        prompt:
          "Draft an evacuation report from the notes below. Include timeline, trigger, response actions, communication, issues encountered, people or areas affected, recovery status and recommendations for review.",
        variables: ["evacuation notes", "site areas", "recovery status"],
      },
      {
        title: "Lockdown review questions",
        helpsWith: "Reviews readiness without inventing procedures.",
        prompt:
          "Create review questions for a security lockdown procedure tabletop exercise. Cover communication, access control, accountability, vulnerable people, escalation, equipment and handover to emergency services.",
        variables: ["procedure summary", "site type", "exercise objective"],
      },
      {
        title: "Post-emergency action tracker",
        helpsWith: "Captures follow-up after a serious event or drill.",
        prompt:
          "Turn these emergency response notes into an action tracker. Include action, owner, urgency, dependency, evidence needed and review date. Mark any action that needs senior approval.",
        variables: ["response notes", "owners", "approval process"],
      },
    ],
    customisationTips: [
      "Reference approved site procedures before asking for planning or review help.",
      "Keep live emergency instructions out of AI tools unless explicitly authorised.",
      "Use prompts for preparation, documentation and debriefing rather than command decisions.",
    ],
    responsibleUse: [
      ...sharedResponsibleUse,
      "In a live emergency, follow site procedures, emergency services instructions and authorised command arrangements.",
    ],
    relatedCollections: ["incident-report-prompts", "risk-assessment-prompts", "security-sop-prompts"],
    blogLinks: [
      { slug: "security-briefing-template-for-shift-supervisors", label: "briefing template for supervisors" },
      { slug: "how-to-run-a-security-shift-handover-that-reduces-repeat-incidents", label: "handover process guide" },
    ],
    sourceData: ["Product prompts 7-10, 68-69 and 95", "Bonus use case 23"],
  },
  {
    slug: "security-sop-prompts",
    title: "Security SOP Prompts",
    h1: "Security SOP Prompts",
    description:
      "Sample prompts for drafting and reviewing security SOPs, assignment instructions, access control procedures and visitor management workflows.",
    primaryKeyword: "security SOP prompts",
    audience: ["Security managers", "Contract managers", "Corporate security teams"],
    intro:
      "AI can help organise SOP drafts, but it cannot know the site, contract or legal duties on its own. These prompts are designed for managers who already have site knowledge and need a clearer first draft or review checklist.",
    useCases: [
      "Drafting assignment instructions from existing site notes",
      "Reviewing visitor, contractor, key control or access-control procedures",
      "Finding unclear steps in an SOP draft",
      "Creating supervisor briefing points from a new procedure",
    ],
    samples: [
      {
        title: "SOP draft structure",
        helpsWith: "Builds a practical first draft from approved notes.",
        prompt:
          "Using the approved site notes below, draft a security SOP with sections for purpose, scope, roles, step-by-step process, escalation, records, exceptions, review owner and training points. Flag any information that is missing.",
        variables: ["approved site notes", "procedure name", "review owner"],
      },
      {
        title: "Procedure clarity review",
        helpsWith: "Finds vague or risky wording in an SOP.",
        prompt:
          "Review this security procedure for unclear wording, missing responsibilities, weak escalation points and steps that could be misunderstood by a new officer. Suggest improvements without changing the intended process.",
        variables: ["SOP draft", "audience", "site constraints"],
      },
      {
        title: "Access control procedure prompt",
        helpsWith: "Structures access-control instructions.",
        prompt:
          "Create a clear access control procedure outline from these requirements. Include authorisation checks, visitor handling, denied access, escalation, record keeping and end-of-shift checks.",
        variables: ["requirements", "access points", "authorised contacts"],
      },
      {
        title: "SOP briefing notes",
        helpsWith: "Turns a procedure into a team briefing.",
        prompt:
          "Turn this SOP into briefing notes for security officers. Include what changed, why it matters, critical steps, common mistakes, escalation reminders and questions supervisors should ask to confirm understanding.",
        variables: ["SOP text", "team role", "change summary"],
      },
    ],
    customisationTips: [
      "Use approved source notes, not memory or assumptions.",
      "Ask the AI to flag missing steps instead of filling gaps.",
      "Have the final SOP reviewed by the appropriate manager or client owner.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["risk-assessment-prompts", "security-supervisor-prompts", "emergency-response-prompts"],
    blogLinks: [
      { slug: "how-to-create-a-security-sop-with-ai-without-losing-operational-control", label: "security SOP with AI guide" },
      { slug: "how-security-managers-can-use-chatgpt", label: "ChatGPT for security managers" },
    ],
    sourceData: ["Product prompts 61-67", "Existing SOP blog guidance", "Bonus use case 10"],
  },
  {
    slug: "security-supervisor-prompts",
    title: "Security Supervisor Prompts",
    h1: "Security Supervisor Prompts",
    description:
      "Sample AI prompts for security supervisors handling briefings, handovers, patrol notes, officer coaching and daily operational updates.",
    primaryKeyword: "security supervisor prompts",
    audience: ["Security supervisors", "Duty managers", "Newly promoted team leaders"],
    intro:
      "Security supervisors sit close to the live operation. These prompts focus on practical shift-level communication: what happened, what needs action, what the team must understand and what the manager should review.",
    useCases: [
      "Preparing shift briefings and debriefs",
      "Turning patrol and occurrence notes into manager-ready updates",
      "Coaching officers after missed standards or good practice",
      "Escalating live risk clearly at the end of a shift",
    ],
    samples: [
      {
        title: "Supervisor shift briefing",
        helpsWith: "Creates a short briefing before the team deploys.",
        prompt:
          "Create a security supervisor shift briefing from these notes. Include site priorities, expected standards, known risks, patrol focus, equipment checks, escalation reminders and one question to confirm team understanding.",
        variables: ["shift notes", "site priorities", "team size"],
      },
      {
        title: "Patrol note summary",
        helpsWith: "Turns patrol observations into useful reporting.",
        prompt:
          "Summarise these patrol notes for a security manager. Separate routine checks, exceptions, risks, maintenance concerns, client issues and actions that need follow-up, then highlight anything the next supervisor should verify before the next patrol cycle.",
        variables: ["patrol notes", "site areas", "follow-up owner"],
      },
      {
        title: "Officer coaching note",
        helpsWith: "Prepares constructive coaching after a shift issue.",
        prompt:
          "Draft a supervisor coaching note for this officer performance issue. Keep it fair, specific and practical. Include observed behaviour, expected standard, questions to ask, support offered and agreed next action.",
        variables: ["observed issue", "expected standard", "support available"],
      },
      {
        title: "Escalation summary",
        helpsWith: "Makes urgent updates clearer for managers.",
        prompt:
          "Turn this live security issue into a concise escalation summary. Include the issue, immediate risk, actions taken, support needed, decision required and next update time.",
        variables: ["live issue", "actions taken", "manager decision needed"],
      },
    ],
    customisationTips: [
      "Keep supervisor prompts short enough to use during a busy shift.",
      "State whether the output is for the team, the manager or the client.",
      "Ask for action lists when a note contains unresolved risk.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["shift-handover-prompts", "security-leadership-prompts", "control-room-security-prompts"],
    blogLinks: [
      { slug: "security-supervisor-tools", label: "security supervisor tools" },
      { slug: "security-briefing-template-for-shift-supervisors", label: "shift supervisor briefing template" },
    ],
    sourceData: ["Homepage audience list", "Product prompts 22-23, 56-60 and 90-100", "Bonus use cases 16-19"],
  },
  {
    slug: "control-room-security-prompts",
    title: "Control Room Security Prompts",
    h1: "Control Room Security Prompts",
    description:
      "Sample prompts for control room managers handling logs, CCTV review notes, escalations, handovers and operational summaries.",
    primaryKeyword: "control room security prompts",
    audience: ["Control room managers", "Security supervisors", "Duty managers"],
    intro:
      "Control room work depends on clear logs, accurate summaries and timely escalation. These prompts help organise information from multiple inputs while preserving the distinction between what is confirmed and what still needs checking.",
    useCases: [
      "Summarising control room logs for supervisors",
      "Structuring CCTV review notes",
      "Preparing escalation updates during live incidents",
      "Creating end-of-shift summaries for management review",
    ],
    samples: [
      {
        title: "Control room log summary",
        helpsWith: "Creates a management summary from a busy log.",
        prompt:
          "Summarise this control room log for the duty manager. Group entries into incidents, alarms, access control, CCTV observations, calls received, unresolved issues and recommended follow-up.",
        variables: ["control room log", "shift period", "manager priorities"],
      },
      {
        title: "CCTV observation note",
        helpsWith: "Keeps observation wording factual.",
        prompt:
          "Rewrite these CCTV observation notes in a factual and neutral style. Keep time references, camera locations and observed actions clear. Do not identify intent unless the notes contain evidence for it.",
        variables: ["CCTV notes", "camera references", "time window"],
      },
      {
        title: "Alarm escalation prompt",
        helpsWith: "Structures an update after an alarm or alert.",
        prompt:
          "Create an escalation update for this security alarm event. Include trigger, time received, checks completed, current status, risk level, who has been informed and what decision or support is needed.",
        variables: ["alarm details", "checks completed", "contacts informed"],
      },
      {
        title: "Control room handover",
        helpsWith: "Transfers open issues between operators or supervisors.",
        prompt:
          "Turn these control room notes into an end-of-shift handover. Include open incidents, active monitoring points, technical faults, pending calls, access issues and first actions for the incoming operator.",
        variables: ["control room notes", "incoming operator", "monitoring priorities"],
      },
    ],
    customisationTips: [
      "Preserve original times and references exactly.",
      "Ask the AI to mark unverified information rather than presenting it as fact.",
      "Use the output as a draft summary, not a replacement for the original log.",
    ],
    responsibleUse: sharedResponsibleUse,
    relatedCollections: ["shift-handover-prompts", "incident-report-prompts", "investigation-prompts"],
    blogLinks: [
      { slug: "how-to-write-a-better-security-daily-occurrence-report-with-ai", label: "daily occurrence report guide" },
      { slug: "how-to-run-a-security-shift-handover-that-reduces-repeat-incidents", label: "shift handover guide" },
    ],
    sourceData: ["Homepage audience list", "Product prompts 47, 56-60", "Bonus use cases 13, 16-17"],
  },
];

export const promptCollectionPaths = [
  "/prompts",
  ...promptCollections.map((collection) => `/prompts/${collection.slug}`),
] as const;

export function getPromptCollection(slug: string) {
  return promptCollections.find((collection) => collection.slug === slug);
}

export function getPromptCollectionUrl(slug: string) {
  return `${siteUrl}/prompts/${slug}`;
}

export function buildPromptCollectionSchema(collection: PromptCollection) {
  const pageUrl = getPromptCollectionUrl(collection.slug);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: collection.h1,
        headline: collection.h1,
        description: collection.description,
        inLanguage: "en-GB",
        isPartOf: {
          "@type": "WebSite",
          name: product.brand,
          url: siteUrl,
        },
        about: collection.primaryKeyword,
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#samples`,
        name: `${collection.h1} sample prompts`,
        itemListElement: collection.samples.map((sample, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: sample.title,
          description: sample.helpsWith,
        })),
      },
    ],
  };
}
