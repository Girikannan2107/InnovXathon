/**
 * INNOVXATHON 2026 - Centralized Event Configuration
 * 
 * Strict single source of truth for all event data, rules, deadlines, prizes, and contacts.
 * Placeholder values must be prefixed with "REPLACE_WITH_" or clearly labeled.
 */

export interface CoordinatorInfo {
  name: string;
  phone: string;
  phoneClean: string;
  telHref: string;
  role?: string;
}

export interface TimelineItem {
  id: string;
  step: string;
  title: string;
  dateDisplay: string;
  dateISO: string;
  participantAction: string;
  resultOrNext: string;
  status: 'upcoming' | 'current' | 'completed';
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  clarification?: string;
}

export interface CriterionItem {
  name: string;
  weightPercent: number;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Registration' | 'Eligibility' | 'Prizes & Fees' | 'Event Day' | 'Submissions';
}

export interface OrganizerPartner {
  name: string;
  role: 'Organized by' | 'Institutional Partner' | 'Innovation Partner' | 'Event Identity' | 'Sponsor';
  logoPath: string;
  alt: string;
  width: number;
  height: number;
  surfaceClass: string;
}

export interface EventConfiguration {
  metadata: {
    name: string;
    edition: string;
    year: number;
    tagline: string;
    subTagline: string;
    format: string;
    targetAudience: string;
    teamSizeRule: string;
    teamSize: number;
    shortlistedTeamsCount: number;
    totalPrizePool: number;
    currency: string;
    initialRegistrationFee: number;
    shortlistFeePerTeam: number;
  };
  schedule: {
    eventDateDisplay: string;
    eventDateISO: string; // ISO 8601 with IST (+05:30)
    eventEndDateISO: string;
    reportingTimeDisplay: string;
    registrationOpensDisplay: string;
    registrationOpensISO: string;
    registrationClosesDisplay: string;
    registrationClosesISO: string; // ISO 8601 with IST (+05:30)
    shortlistAnnouncementDisplay: string;
    shortlistAnnouncementISO: string;
  };
  venue: {
    institutionName: string;
    hallOrBuilding: string;
    fullAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    googleMapsUrl: string;
    travelNotes: string;
  };
  contacts: {
    primaryEmail: string;
    coordinators: CoordinatorInfo[];
    primaryPhone: string;
    primaryPhoneClean: string;
    coordinatorName: string;
    secondaryCoordinatorName: string;
    instagramUrl: string;
    linkedinUrl: string;
  };
  links: {
    googleFormUrl: string;
    guidelinesDocUrl: string;
    slideTemplateUrl: string;
    canonicalUrl: string;
  };
  prizes: {
    totalPoolAmount: number;
    title: string;
    description: string;
    currencyNote: string;
  };
  rulesAndEligibility: {
    institutionEligibility: string;
    studentEligibility: string;
    teamSizeRequirement: string;
    crossCollegeAllowed: boolean;
    crossDepartmentAllowed: boolean;
    facultyMentorRequired: boolean;
    collegeIdRequired: boolean;
    maxSubmissionsPerTeam: number;
    aiUsagePolicy: string;
    plagiarismPolicy: string;
    disqualificationConditions: string[];
    juryDecisionPolicy: string;
  };
  submissionRequirements: {
    formSubmissionIncludes: string[];
    requiredFields: string[];
    allowedFileFormats: string[];
    maxFileSizeMb: number;
    singleFormNotice: string;
  };
  presentationGuidelines: {
    maxSlides: number;
    pitchDurationMinutes: number;
    qaDurationMinutes: number;
    fileFormat: string;
    prototypeRequirement: string;
    laptopRequirement: string;
    projectorConnectivity: string;
    internetAvailability: string;
    lateSubmissionPolicy: string;
  };
  judgingCriteria: {
    preliminaryStage: {
      stageName: string;
      criteria: CriterionItem[];
    };
    finalStage: {
      stageName: string;
      criteria: CriterionItem[];
    };
  };
  timeline: TimelineItem[];
  process: ProcessStep[];
  organizersAndSponsors: OrganizerPartner[];
  faqs: FAQItem[];
  legal: {
    privacyNotice: string;
    ipOwnershipPolicy: string;
    codeOfConduct: string;
    aiDisclosurePolicy: string;
    cancellationPolicy: string;
    grievanceChannel: string;
  };
  results: {
    isPublished: boolean;
    expectedPublishDateTime: string;
    winners: Array<{
      award: string;
      teamName: string;
      college: string;
      ideaTitle: string;
      projectSummary: string;
      teamPhoto?: string;
    }>;
  };
}

export const EVENT_CONFIG: EventConfiguration = {
  metadata: {
    name: 'INNOVXATHON',
    edition: 'First Edition / 2026',
    year: 2026,
    tagline: 'A spark of thought. A universe of possibility.',
    subTagline: 'National-Level Student Innovation Ideathon',
    format: 'Offline In-Person Ideathon',
    targetAudience: 'College & University Students across India',
    teamSizeRule: 'Up to 4 members per team',
    teamSize: 4,
    shortlistedTeamsCount: 20,
    totalPrizePool: 50000,
    currency: 'INR',
    initialRegistrationFee: 0,
    shortlistFeePerTeam: 500,
  },
  schedule: {
    eventDateDisplay: '24 October 2026',
    eventDateISO: '2026-10-24T09:00:00+05:30',
    eventEndDateISO: '2026-10-24T18:00:00+05:30',
    reportingTimeDisplay: '9:00 AM IST',
    registrationOpensDisplay: '26 September 2026',
    registrationOpensISO: '2026-09-26T00:00:00+05:30',
    registrationClosesDisplay: '16 October 2026, 11:59 PM IST',
    registrationClosesISO: '2026-10-16T23:59:59+05:30',
    shortlistAnnouncementDisplay: '20 October 2026',
    shortlistAnnouncementISO: '2026-10-20T18:00:00+05:30',
  },
  venue: {
    institutionName: 'Karpagam Innovation Centre (KIC), Karpagam College of Engineering',
    hallOrBuilding: 'Auditorium & Innovation Complex (To be confirmed at reporting)',
    fullAddress: 'Myleripalayam Village, Othakkal Mandapam, Coimbatore, Tamil Nadu — 641032',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    postalCode: '641032',
    country: 'India',
    googleMapsUrl: 'https://maps.app.goo.gl/KVHMxNZo1FzsPkkM8',
    travelNotes: 'Located 18 km from Coimbatore Junction Railway Station and 26 km from Coimbatore International Airport. Direct bus routes available to Othakkal Mandapam.',
  },
  contacts: {
    primaryEmail: 'stratupclubkic@kce.ac.in',
    coordinators: [
      {
        name: 'Lathika M',
        phone: '+91 81220 51205',
        phoneClean: '+918122051205',
        telHref: 'tel:+918122051205',
        role: 'Event Coordinator',
      },
      {
        name: 'Sujeet S',
        phone: '+91 63823 56586',
        phoneClean: '+916382356586',
        telHref: 'tel:+916382356586',
        role: 'Event Coordinator',
      },
    ],
    primaryPhone: '+91 81220 51205',
    primaryPhoneClean: '+918122051205',
    coordinatorName: 'Lathika M & Sujeet S',
    secondaryCoordinatorName: 'Sujeet S (+91 63823 56586)',
    instagramUrl: 'https://instagram.com/innovxera',
    linkedinUrl: 'https://linkedin.com/company/innovxera',
  },
  links: {
    // Official registration link for InnovXathon 2026.
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfNXPfvexSl6gFxhhMHbd8lVy6qWmKpZNhWU3LWADoq4lGweg/viewform?usp=dialog',
    guidelinesDocUrl: 'REPLACE_WITH_OFFICIAL_GUIDELINES_DOC_URL',
    slideTemplateUrl: '/INNOVXATHON_26_Template.pptx',
    canonicalUrl: 'https://innovxathon.in',
  },
  prizes: {
    totalPoolAmount: 50000,
    title: 'Attractive Prizes Worth ₹50,000',
    description: 'Pioneering solutions merit grand recognition. Standout student innovators will be awarded cash prizes, prestigious trophies, and official certificates.',
    currencyNote: 'All prize amounts are in INR (₹). In addition, all finalist teams receive official Certificates of Participation.',
  },
  rulesAndEligibility: {
    institutionEligibility: 'Open to bona fide undergraduate and postgraduate students from any recognized college or university in India.',
    studentEligibility: 'Students from all engineering, arts, science, and management departments are eligible.',
    teamSizeRequirement: 'Each team may consist of up to four (4) student members. Cross-department and cross-college teams are welcome.',
    crossCollegeAllowed: true,
    crossDepartmentAllowed: true,
    facultyMentorRequired: false,
    collegeIdRequired: true,
    maxSubmissionsPerTeam: 1,
    aiUsagePolicy: 'Participants may use AI tools for research, brainstorming, code assistance, and presentation design, but must clearly disclose where and how AI was used. Direct submission of unmodified AI outputs without original reasoning will be penalized.',
    plagiarismPolicy: 'All concepts, designs, and pitch materials must be original work of the team. Plagiarism from existing products, academic papers, or previous hackathons will result in immediate disqualification.',
    disqualificationConditions: [
      'Submission of plagiarized work or false participant credentials',
      'Non-disclosure of substantial generative AI assistance',
      'Failure to report with valid institutional photo ID cards on event day',
      'Misconduct or violation of college campus discipline guidelines',
      'Late payment of shortlist confirmation fee after the deadline',
    ],
    juryDecisionPolicy: 'The decision of the jury panel and organizing committee is final, binding, and not subject to appeal.',
  },
  submissionRequirements: {
    formSubmissionIncludes: [
      'Team details & leader contact coordinates',
      'All team members’ full names, college IDs, departments & emails (up to 4 members)',
      'Idea Title & Category Domain',
      'Problem Statement (Context & User Pain Points)',
      'Proposed Solution & Value Proposition',
      'Innovation & Uniqueness factor',
      'Feasibility, Technology Architecture & Implementation Plan',
      'Expected Societal / Business Impact',
      'Generative AI Tool Usage Declaration',
      'Pitch Deck / Presentation Link (PDF / Google Slides)',
    ],
    requiredFields: [
      'Team Name',
      'Leader Email & Mobile',
      'Team Members Details (Up to 4)',
      'Idea Title',
      'Problem Description',
      'Solution Summary',
      'AI Disclosure Statement',
    ],
    allowedFileFormats: ['PDF', 'PPTX', 'Google Slides View Link'],
    maxFileSizeMb: 10,
    singleFormNotice: 'Both team registration and initial idea materials are submitted simultaneously via the official Google Form.',
  },
  presentationGuidelines: {
    maxSlides: 10,
    pitchDurationMinutes: 7,
    qaDurationMinutes: 3,
    fileFormat: 'PDF or PPTX',
    prototypeRequirement: 'A working prototype is not mandatory for initial screening, but functional demos or interactive mockups will earn additional credit during final stage judging.',
    laptopRequirement: 'Shortlisted teams must bring at least one working laptop equipped with standard HDMI/Type-C output.',
    projectorConnectivity: 'Standard HDMI projectors and display screens will be provided in all presentation rooms.',
    internetAvailability: 'High-speed campus Wi-Fi will be provisioned for participant teams.',
    lateSubmissionPolicy: 'Presentation decks must be submitted before the briefing on event day. No deck changes allowed once presentations begin.',
  },
  judgingCriteria: {
    preliminaryStage: {
      stageName: 'Stage 1: Preliminary Shortlisting (Online)',
      criteria: [
        {
          name: 'Idea Quality & Relevance',
          weightPercent: 30,
          description: 'Clarity of the problem statement and significance of the target issue.',
        },
        {
          name: 'Innovation & Uniqueness',
          weightPercent: 25,
          description: 'Novelty of approach compared to existing market solutions and conventional methods.',
        },
        {
          name: 'Technical & Practical Feasibility',
          weightPercent: 20,
          description: 'Realistic implementation roadmap, engineering viability, and resource requirements.',
        },
        {
          name: 'Presentation & Concept Clarity',
          weightPercent: 15,
          description: 'Structure, visual clarity, and coherence of the submitted pitch deck.',
        },
        {
          name: 'Expected Impact',
          weightPercent: 10,
          description: 'Potential for societal, environmental, or commercial impact and scalability.',
        },
      ],
    },
    finalStage: {
      stageName: 'Stage 2: Event-Day Grand Finale (On-Campus)',
      criteria: [
        {
          name: 'Problem Deep-Dive & Domain Insight',
          weightPercent: 20,
          description: 'Thorough understanding of root causes, user personas, and real-world constraints.',
        },
        {
          name: 'Originality & Technical Execution',
          weightPercent: 25,
          description: 'Architecture robustness, ingenuity of the engineering design, and original thinking.',
        },
        {
          name: 'Feasibility, Business Model & Scalability',
          weightPercent: 20,
          description: 'Financial viability, adoption barriers, and roadmap for real-world rollout.',
        },
        {
          name: 'Team Pitch & Communication',
          weightPercent: 15,
          description: 'Articulate delivery, visual storytelling, time management, and team synergy.',
        },
        {
          name: 'Jury Q&A & Demo / Mockup',
          weightPercent: 15,
          description: 'Handling challenging inquiries, depth of defence, and functional demo demonstration.',
        },
        {
          name: 'AI Transparency & Ethical Integrity',
          weightPercent: 5,
          description: 'Clear, honest disclosure of AI utilization and demonstration of independent intellect.',
        },
      ],
    },
  },
  timeline: [
    {
      id: 'applications-open',
      step: '01',
      title: 'Applications Open',
      dateDisplay: '26 Sep 2026',
      dateISO: '2026-09-26T00:00:00+05:30',
      participantAction: 'Form a team of up to 4 members and submit your idea pitch via the official Google Form.',
      resultOrNext: 'Team leader receives automated submission receipt.',
      status: 'upcoming',
    },
    {
      id: 'applications-close',
      step: '02',
      title: 'Applications Close',
      dateDisplay: '16 Oct 2026',
      dateISO: '2026-10-16T23:59:59+05:30',
      participantAction: 'Ensure final pitch deck and idea details are submitted before 11:59 PM IST.',
      resultOrNext: 'Applications enter screening evaluation.',
      status: 'upcoming',
    },
    {
      id: 'shortlist-announcement',
      step: '03',
      title: 'Shortlist Announcement',
      dateDisplay: '20 Oct 2026',
      dateISO: '2026-10-20T18:00:00+05:30',
      participantAction: 'Check registered email for selection letter; pay ₹500 confirmation fee per team.',
      resultOrNext: 'Slot confirmed for 20 finalist teams.',
      status: 'upcoming',
    },
    {
      id: 'grand-finale',
      step: '04',
      title: 'Grand Finale',
      dateDisplay: '24 Oct 2026',
      dateISO: '2026-10-24T09:00:00+05:30',
      participantAction: 'Report to KCE Coimbatore at 9:00 AM IST with college IDs and laptops for jury presentation.',
      resultOrNext: 'Attractive prizes worth ₹50,000 awarded to winners.',
      status: 'upcoming',
    },
  ],
  process: [
    {
      stepNumber: 1,
      title: 'Form Your Team & Register',
      description: 'Assemble a team of up to four students and submit your idea pitch deck through the official Google Form.',
      clarification: 'Registration is free for initial submission.',
    },
    {
      stepNumber: 2,
      title: 'Submit Problem & Solution Deck',
      description: 'Highlight problem context, proposed solution, innovation, feasibility, impact, and AI disclosures.',
      clarification: 'Single submission per team via team leader.',
    },
    {
      stepNumber: 3,
      title: 'Preliminary Screening',
      description: 'Expert panel evaluates submissions based on innovation, feasibility, clarity, and potential impact.',
      clarification: 'Screening criteria weighted out of 100%.',
    },
    {
      stepNumber: 4,
      title: 'Top 20 Teams Shortlisted',
      description: 'Up to 20 selected teams receive an official selection notification and confirmation link on 20 October.',
      clarification: 'Shortlist published on website & sent via email.',
    },
    {
      stepNumber: 5,
      title: 'Confirm Slot (₹500 / Selected Team)',
      description: 'If shortlisted, confirm your slot by completing the ₹500 team registration. Snacks and lunch are included for confirmed teams.',
      clarification: 'Snacks and lunch included for confirmed teams.',
    },
    {
      stepNumber: 6,
      title: 'Report to KCE Campus',
      description: 'Teams arrive at Karpagam College of Engineering, Coimbatore at 9:00 AM IST for verification.',
      clarification: 'Carry valid college photo ID cards.',
    },
    {
      stepNumber: 7,
      title: 'Pitch to the Grand Jury',
      description: 'Deliver your 7-minute presentation followed by 3-minute Q&A with industry experts and academic leaders.',
      clarification: 'Projector & presentation aids provided.',
    },
    {
      stepNumber: 8,
      title: 'Awards & Victory Celebration',
      description: 'Standout teams announced on stage, receiving attractive prizes worth ₹50,000, trophies, and certificates.',
      clarification: 'Awards presented on event day.',
    },
  ],
  organizersAndSponsors: [
    {
      name: 'Karpagam College of Engineering',
      role: 'Institutional Partner',
      logoPath: '/brands/kce-cropped.png',
      alt: 'Karpagam College of Engineering Official Logo',
      width: 7930,
      height: 1014,
      surfaceClass: 'kce-surface',
    },
    {
      name: 'Karpagam Innovation Centre',
      role: 'Innovation Partner',
      logoPath: '/brands/kic-cropped.png',
      alt: 'Karpagam Innovation Centre (KIC) Official Logo',
      width: 589,
      height: 219,
      surfaceClass: 'kic-surface',
    },
    {
      name: 'INNOVXERA Startup Club',
      role: 'Organized by',
      logoPath: '/brands/innovxera-cropped.png',
      alt: 'INNOVXERA Startup Club Official Logo',
      width: 980,
      height: 313,
      surfaceClass: 'innovxera-surface',
    },
  ],
  faqs: [
    {
      category: 'Registration',
      question: 'Is initial registration free?',
      answer: 'Yes, submitting your application and initial idea pitch is completely free. There is no fee required at the time of initial application.',
    },
    {
      category: 'Prizes & Fees',
      question: 'Who needs to pay the ₹500 fee, and is it per team or per person?',
      answer: 'The ₹500 fee is payable ONLY by the top 20 shortlisted teams who receive an official selection email on 20 October. It is ₹500 per team in total (not per person). Non-shortlisted applicants do not pay anything.',
    },
    {
      category: 'Eligibility',
      question: 'Who is eligible to participate in INNOVXATHON 2026?',
      answer: 'Any bona fide undergraduate or postgraduate student from any recognized university or college across India can participate. Teams may consist of up to four members. Cross-department and cross-college teams are welcome.',
    },
    {
      category: 'Submissions',
      question: 'Can we use Generative AI tools (ChatGPT, Claude, Midjourney, etc.)?',
      answer: 'Yes, you may use AI tools to aid brainstorming, research, UI design, or code development. However, your team must transparently declare what tools were used and how they contributed. Submitting unedited, generic AI outputs without critical human innovation will lead to lower scores.',
    },
    {
      category: 'Submissions',
      question: 'Is a working prototype mandatory?',
      answer: 'A functional prototype is not mandatory for initial shortlisting. However, for the final pitch on 24 October, having a working prototype, video demonstration, or interactive UI mockup will significantly strengthen your scoring in the technical execution criterion.',
    },
    {
      category: 'Registration',
      question: 'Can a team edit their submission after submitting the Google Form?',
      answer: 'Yes, Google Forms allows editing responses until the submission deadline (16 October 2026, 11:59 PM IST) as long as you use the same Google account.',
    },
    {
      category: 'Event Day',
      question: 'What documents and equipment do participants need to carry on event day?',
      answer: 'Every team member must carry their physical college photo ID card. Each team should bring at least one laptop with necessary chargers and presentation adaptors.',
    },
    {
      category: 'Event Day',
      question: 'Where and when does the event take place?',
      answer: 'The event takes place on 24 October 2026 at Karpagam College of Engineering (KCE), Coimbatore. Reporting time is 9:00 AM IST sharp.',
    },
    {
      category: 'Event Day',
      question: 'Will all participants receive certificates?',
      answer: 'Yes, all members of shortlisted teams who present on event day will receive official Certificates of Participation. Standout teams will receive certificates along with their trophies and cash prizes.',
    },
  ],
  legal: {
    privacyNotice: 'INNOVXERA and Karpagam College of Engineering respect participant privacy. Personal contact information collected during registration is used solely for event administration, verification, and shortlist communications. We never sell or share participant data with third-party advertisers.',
    ipOwnershipPolicy: 'Participants retain full intellectual property rights over their submitted concepts, prototypes, codebases, and presentations. Presenting at INNOVXATHON does not transfer any IP rights to the organizers or sponsors.',
    codeOfConduct: 'INNOVXATHON is committed to providing a safe, inclusive, harassment-free environment for all participants, judges, mentors, and volunteers regardless of gender, sexual orientation, disability, physical appearance, race, or religion.',
    aiDisclosurePolicy: 'Transparency is a core value of INNOVXATHON. Participants are encouraged to leverage state-of-the-art AI tooling ethically, provided all prompt engineering, synthesis, and model assistance are openly documented.',
    cancellationPolicy: 'If the event schedule is altered due to unforeseen administrative or force majeure circumstances, confirmed teams will be notified immediately via email and the website with updated schedules.',
    grievanceChannel: 'For any disputes, evaluation queries, or harassment reports, participants may reach out directly to stratupclubkic@kce.ac.in. All inquiries will be handled confidentially by the faculty advisory board.',
  },
  results: {
    isPublished: false,
    expectedPublishDateTime: '24 October 2026, 5:00 PM IST',
    winners: [],
  },
};

export type EventPhase =
  | 'COMING_SOON'
  | 'APPLICATIONS_OPEN'
  | 'APPLICATIONS_CLOSED'
  | 'UNDER_REVIEW'
  | 'SHORTLIST_ANNOUNCED'
  | 'GRAND_FINALE'
  | 'EVENT_COMPLETED';

export function getEventPhase(now: Date = new Date()): EventPhase {
  const current = now.getTime();
  const regOpen = new Date(EVENT_CONFIG.schedule.registrationOpensISO).getTime();
  const regClose = new Date(EVENT_CONFIG.schedule.registrationClosesISO).getTime();
  const shortlist = new Date(EVENT_CONFIG.schedule.shortlistAnnouncementISO).getTime();
  const finaleStart = new Date(EVENT_CONFIG.schedule.eventDateISO).getTime();
  const finaleEnd = new Date(EVENT_CONFIG.schedule.eventEndDateISO).getTime();

  if (current < regOpen) return 'COMING_SOON';
  if (current <= regClose) return 'APPLICATIONS_OPEN';
  if (current < shortlist) return 'UNDER_REVIEW';
  if (current < finaleStart) return 'SHORTLIST_ANNOUNCED';
  if (current <= finaleEnd) return 'GRAND_FINALE';
  return 'EVENT_COMPLETED';
}

/**
 * Validates critical math and configuration integrity.
 * Throws runtime error in development / tests if rules are violated.
 */
export function validateEventConfiguration(config: EventConfiguration = EVENT_CONFIG): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate Total Prize Pool
  if (config.prizes.totalPoolAmount !== 50000) {
    errors.push(
      `Total prize pool amount (₹${config.prizes.totalPoolAmount}) must equal ₹50,000`
    );
  }

  // Validate Preliminary Judging Criteria Weights
  const prelimWeight = config.judgingCriteria.preliminaryStage.criteria.reduce(
    (acc, c) => acc + c.weightPercent,
    0
  );
  if (prelimWeight !== 100) {
    errors.push(
      `Preliminary judging criteria weights sum to ${prelimWeight}%, expected exactly 100%`
    );
  }

  // Validate Final Judging Criteria Weights
  const finalWeight = config.judgingCriteria.finalStage.criteria.reduce(
    (acc, c) => acc + c.weightPercent,
    0
  );
  if (finalWeight !== 100) {
    errors.push(
      `Final judging criteria weights sum to ${finalWeight}%, expected exactly 100%`
    );
  }

  // Validate Chronological Timestamps
  const regOpen = new Date(config.schedule.registrationOpensISO).getTime();
  const regClose = new Date(config.schedule.registrationClosesISO).getTime();
  const shortlist = new Date(config.schedule.shortlistAnnouncementISO).getTime();
  const eventDay = new Date(config.schedule.eventDateISO).getTime();

  if (isNaN(regOpen) || isNaN(regClose) || isNaN(shortlist) || isNaN(eventDay)) {
    errors.push('One or more ISO schedule timestamps are invalid dates');
  } else {
    if (regOpen > regClose) errors.push('Registration open date is after registration close date');
    if (regClose > shortlist) errors.push('Registration close date is after shortlist announcement');
    if (shortlist > eventDay) errors.push('Shortlist announcement is after event date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Perform development time validation
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const validation = validateEventConfiguration();
  if (!validation.isValid) {
    console.error('⚠️ [EVENT_CONFIG ERROR] Configuration validation failed:', validation.errors);
  }
}
