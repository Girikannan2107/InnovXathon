/**
 * INNOVXATHON 2026 - Centralized Event Configuration
 * 
 * Strict single source of truth for all event data, rules, deadlines, prizes, and contacts.
 * Placeholder values must be prefixed with "REPLACE_WITH_" or clearly labeled.
 */

export interface PrizeItem {
  rank: number;
  position: string;
  amount: number;
  label: string;
  perTeam: boolean;
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
  role: 'Organized by' | 'Institutional Partner' | 'Innovation Partner' | 'Sponsor';
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
    items: PrizeItem[];
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
    eventDateDisplay: '16 October 2026',
    eventDateISO: '2026-10-16T09:00:00+05:30',
    eventEndDateISO: '2026-10-16T18:00:00+05:30',
    reportingTimeDisplay: '9:00 AM IST',
    registrationOpensDisplay: '10 September 2026',
    registrationOpensISO: '2026-09-10T00:00:00+05:30',
    registrationClosesDisplay: '10 October 2026, 11:59 PM IST',
    registrationClosesISO: '2026-10-10T23:59:59+05:30',
    shortlistAnnouncementDisplay: '12 October 2026',
    shortlistAnnouncementISO: '2026-10-12T18:00:00+05:30',
  },
  venue: {
    institutionName: 'Karpagam College of Engineering',
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
    primaryEmail: 'innovxera@kce.ac.in',
    primaryPhone: '+91 99658 06889',
    primaryPhoneClean: '+919965806889',
    coordinatorName: 'INNOVXERA Student Core Team',
    secondaryCoordinatorName: 'Faculty Coordinator (To be announced)',
    instagramUrl: 'https://instagram.com/innovxera',
    linkedinUrl: 'https://linkedin.com/company/innovxera',
  },
  links: {
    // Official registration link for InnovXathon 2026.
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfNXPfvexSl6gFxhhMHbd8lVy6qWmKpZNhWU3LWADoq4lGweg/viewform?usp=dialog',
    guidelinesDocUrl: 'REPLACE_WITH_OFFICIAL_GUIDELINES_DOC_URL',
    slideTemplateUrl: 'REPLACE_WITH_OFFICIAL_SLIDE_TEMPLATE_URL',
    canonicalUrl: 'https://innovxathon.in',
  },
  prizes: {
    totalPoolAmount: 50000,
    items: [
      {
        rank: 1,
        position: 'Winner',
        amount: 25000,
        label: 'First Place Trophy, Certificates & Cash Prize',
        perTeam: true,
      },
      {
        rank: 2,
        position: 'Runner-Up',
        amount: 15000,
        label: 'Second Place Trophy, Certificates & Cash Prize',
        perTeam: true,
      },
      {
        rank: 3,
        position: 'Second Runner-Up',
        amount: 10000,
        label: 'Third Place Trophy, Certificates & Cash Prize',
        perTeam: true,
      },
    ],
    currencyNote: 'All prize amounts are in INR (₹) and awarded per winning team.',
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
      dateDisplay: '10 SEP 2026',
      dateISO: '2026-09-10T00:00:00+05:30',
      participantAction: 'Form a team of up to 4 members and submit your idea pitch via the official Google Form.',
      resultOrNext: 'Team leader receives automated submission receipt.',
      status: 'completed',
    },
    {
      id: 'applications-close',
      step: '02',
      title: 'Applications Close',
      dateDisplay: '10 OCT 2026',
      dateISO: '2026-10-10T23:59:59+05:30',
      participantAction: 'Ensure final pitch deck and idea details are submitted before 11:59 PM IST.',
      resultOrNext: 'Applications enter screening evaluation.',
      status: 'current',
    },
    {
      id: 'shortlist-announcement',
      step: '03',
      title: 'Shortlist Announcement',
      dateDisplay: '12 OCT 2026',
      dateISO: '2026-10-12T18:00:00+05:30',
      participantAction: 'Check registered email for selection letter; pay ₹500 confirmation fee per team.',
      resultOrNext: 'Slot confirmed for 20 finalist teams.',
      status: 'upcoming',
    },
    {
      id: 'grand-finale',
      step: '04',
      title: 'Grand Finale at KCE',
      dateDisplay: '16 OCT 2026',
      dateISO: '2026-10-16T09:00:00+05:30',
      participantAction: 'Report to KCE Coimbatore at 9:00 AM IST with college IDs and laptops for jury presentation.',
      resultOrNext: 'Winners announced and ₹50,000 prize pool awarded.',
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
      description: 'Up to 20 selected teams receive an official selection notification and confirmation link on 12 October.',
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
      description: 'Winners announced on stage, receiving ₹50,000 prize pool, trophies, and merit certificates.',
      clarification: 'Awards presented on event day.',
    },
  ],
  organizersAndSponsors: [
    {
      name: 'INNOVXERA Startup Club',
      role: 'Organized by',
      logoPath: '/brands/innovxera-cropped.png',
      alt: 'INNOVXERA Startup Club Logo',
      width: 655,
      height: 500,
      surfaceClass: 'innovxera-surface',
    },
    {
      name: 'Karpagam College of Engineering',
      role: 'Institutional Partner',
      logoPath: '/brands/kce-cropped.png',
      alt: 'Karpagam College of Engineering Logo',
      width: 7930,
      height: 1014,
      surfaceClass: 'kce-surface',
    },
    {
      name: 'Karpagam Innovation Centre',
      role: 'Innovation Partner',
      logoPath: '/brands/kic-cropped.png',
      alt: 'Karpagam Innovation Centre (KIC) Logo',
      width: 335,
      height: 134,
      surfaceClass: 'kic-surface',
    },
    {
      name: 'CIRCOR',
      role: 'Sponsor',
      logoPath: '/brands/circor-cropped.png',
      alt: 'CIRCOR Logo',
      width: 1053,
      height: 510,
      surfaceClass: 'circor-surface',
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
      answer: 'The ₹500 fee is payable ONLY by the top 20 shortlisted teams who receive an official selection email on 12 October. It is ₹500 per team in total (not per person). Non-shortlisted applicants do not pay anything.',
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
      answer: 'A functional prototype is not mandatory for initial shortlisting. However, for the final pitch on 16 October, having a working prototype, video demonstration, or interactive UI mockup will significantly strengthen your scoring in the technical execution criterion.',
    },
    {
      category: 'Registration',
      question: 'Can a team edit their submission after submitting the Google Form?',
      answer: 'Yes, Google Forms allows editing responses until the submission deadline (10 October 2026, 11:59 PM IST) as long as you use the same Google account.',
    },
    {
      category: 'Event Day',
      question: 'What documents and equipment do participants need to carry on event day?',
      answer: 'Every team member must carry their physical college photo ID card. Each team should bring at least one laptop with necessary chargers and presentation adaptors.',
    },
    {
      category: 'Event Day',
      question: 'Where and when does the event take place?',
      answer: 'The event takes place on 16 October 2026 at Karpagam College of Engineering (KCE), Coimbatore. Reporting time is 9:00 AM IST sharp.',
    },
    {
      category: 'Event Day',
      question: 'Will all participants receive certificates?',
      answer: 'Yes, all members of shortlisted teams who present on event day will receive official Certificates of Participation. Winners and runners-up will receive Certificates of Merit along with their trophies and cash prizes.',
    },
  ],
  legal: {
    privacyNotice: 'INNOVXERA and Karpagam College of Engineering respect participant privacy. Personal contact information collected during registration is used solely for event administration, verification, and shortlist communications. We never sell or share participant data with third-party advertisers.',
    ipOwnershipPolicy: 'Participants retain full intellectual property rights over their submitted concepts, prototypes, codebases, and presentations. Presenting at INNOVXATHON does not transfer any IP rights to the organizers or sponsors.',
    codeOfConduct: 'INNOVXATHON is committed to providing a safe, inclusive, harassment-free environment for all participants, judges, mentors, and volunteers regardless of gender, sexual orientation, disability, physical appearance, race, or religion.',
    aiDisclosurePolicy: 'Transparency is a core value of INNOVXATHON. Participants are encouraged to leverage state-of-the-art AI tooling ethically, provided all prompt engineering, synthesis, and model assistance are openly documented.',
    cancellationPolicy: 'If the event schedule is altered due to unforeseen administrative or force majeure circumstances, confirmed teams will be notified immediately via email and the website with updated schedules.',
    grievanceChannel: 'For any disputes, evaluation queries, or harassment reports, participants may reach out directly to innovxera@kce.ac.in. All inquiries will be handled confidentially by the faculty advisory board.',
  },
  results: {
    isPublished: false,
    expectedPublishDateTime: '16 October 2026, 5:00 PM IST',
    winners: [],
  },
};

/**
 * Validates critical math and configuration integrity.
 * Throws runtime error in development / tests if rules are violated.
 */
export function validateEventConfiguration(config: EventConfiguration = EVENT_CONFIG): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate Prize Mathematics
  const sumPrizes = config.prizes.items.reduce((acc, p) => acc + p.amount, 0);
  if (sumPrizes !== config.prizes.totalPoolAmount) {
    errors.push(
      `Prize pool mismatch: sum of individual prizes (₹${sumPrizes}) does not equal total prize pool (₹${config.prizes.totalPoolAmount})`
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
