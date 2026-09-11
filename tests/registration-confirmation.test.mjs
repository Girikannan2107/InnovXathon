import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test implementation replicating the Google Apps Script business logic

const CONFIG = {
  EVENT_NAME: 'INNOVXATHON 2026',
  SENDER_NAME: 'InnovXathon 2026',
  REPLY_TO_EMAIL: 'innovxera@kce.ac.in',
  ID_PREFIX: 'INX26-A-',
  ID_DIGITS: 4,
  EVENT_DATE: '16 October 2026',
  REPORTING_TIME: '9:00 AM IST',
  VENUE: 'Karpagam College of Engineering, Coimbatore, Tamil Nadu — 641032',
  TEAM_SIZE: 'Up to 4 Members / Team',
  FINALIST_COUNT: '20 Finalist Teams',
  FOOD_NOTE: 'Snacks and lunch are included for confirmed teams.',
};

const FORM_FIELDS = {
  LEADER_NAME: [
    'full name team leader',
    'team leader full name',
    'full name of team leader',
    'team leader name',
    'leader full name',
    'leader name',
    'name of team leader',
    'name of leader',
    'team leader',
  ],
  TEAM_NAME: [
    'team name',
    'name of the team',
    'name of team',
    'team_name',
  ],
  LEADER_EMAIL: [
    'email',
    'email address',
    'team leader email',
    'team leader email id',
    'leader email',
    'team leader email address',
    'email id',
  ],
  LEADER_PHONE: [
    'team leader mobile whatsapp number',
    'team leader mobile number',
    'team leader phone',
    'leader phone',
    'mobile number',
    'contact number',
    'phone number',
    'phone',
  ],
  COLLEGE: [
    'college',
    'college institution name',
    'college name',
    'institution name',
    'institution',
    'name of college university',
    'university college name',
  ],
  DEPARTMENT: [
    'department',
    'branch department',
    'department branch',
    'dept',
    'branch',
  ],
  YEAR: [
    'year',
    'year of study',
    'current year',
  ],
  IDEA_TITLE: [
    'idea title',
    'title of idea',
    'project title',
    'title of the project',
    'idea project title',
    'project name',
    'idea name',
  ],
  PROBLEM_STATEMENT: [
    'problem statement',
    'problem description',
    'problem statement context user pain points',
    'description',
    'problem',
  ],
  PROPOSED_SOLUTION: [
    'proposed solution',
    'solution summary',
    'proposed solution value proposition',
    'solution',
  ],
};

function cleanHeader(header) {
  return String(header || '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTeamMemberCol(headerStr) {
  return /team member \d+/i.test(headerStr) || /member \d+/i.test(headerStr);
}

function extractFormData(rowHeaders, rowValues, namedValues) {
  const headerMap = {};
  rowHeaders.forEach((h, idx) => {
    headerMap[cleanHeader(h)] = idx;
  });

  function getByAliases(aliasList, defaultValue = '') {
    // 1. Exact match in namedValues
    if (namedValues) {
      for (const alias of aliasList) {
        for (const [key, val] of Object.entries(namedValues)) {
          const cleanedKey = cleanHeader(key);
          if (isTeamMemberCol(cleanedKey)) continue;
          if (cleanedKey === alias) {
            const result = Array.isArray(val) ? val[0] : val;
            if (result && String(result).trim() !== '') {
              return String(result).trim();
            }
          }
        }
      }
    }

    // 2. Exact match in rowHeaders
    for (const alias of aliasList) {
      for (const [header, colIdx] of Object.entries(headerMap)) {
        if (isTeamMemberCol(header)) continue;
        if (header === alias) {
          const val = rowValues[colIdx];
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            return String(val).trim();
          }
        }
      }
    }

    // 3. Fallback: Substring match
    if (namedValues) {
      for (const alias of aliasList) {
        for (const [key, val] of Object.entries(namedValues)) {
          const cleanedKey = cleanHeader(key);
          if (isTeamMemberCol(cleanedKey)) continue;
          if (cleanedKey.includes(alias)) {
            const result = Array.isArray(val) ? val[0] : val;
            if (result && String(result).trim() !== '') {
              return String(result).trim();
            }
          }
        }
      }
    }

    for (const alias of aliasList) {
      for (const [header, colIdx] of Object.entries(headerMap)) {
        if (isTeamMemberCol(header)) continue;
        if (header.includes(alias)) {
          const val = rowValues[colIdx];
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            return String(val).trim();
          }
        }
      }
    }

    return defaultValue;
  }

  return {
    leaderEmail: getByAliases(FORM_FIELDS.LEADER_EMAIL, '').trim().toLowerCase(),
    leaderName: getByAliases(FORM_FIELDS.LEADER_NAME, 'Team Leader'),
    teamName: getByAliases(FORM_FIELDS.TEAM_NAME, 'Participant Team'),
    college: getByAliases(FORM_FIELDS.COLLEGE, 'Engineering College'),
    ideaTitle: getByAliases(FORM_FIELDS.IDEA_TITLE, 'Innovative Technology Concept'),
  };
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Team Leader email address is empty or missing.' };
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Team Leader email is blank.' };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: `Invalid email address format: "${trimmed}"` };
  }
  return { isValid: true, error: null };
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateApplicationId(counter) {
  const padded = String(counter).padStart(CONFIG.ID_DIGITS, '0');
  return `${CONFIG.ID_PREFIX}${padded}`;
}

function buildSubject(appId) {
  return `InnovXathon 2026 — Application Successfully Submitted | ${appId}`;
}

describe('InnovXathon 2026 — Automatic Email Confirmation Backend Tests', () => {
  test('Application ID format matches INX26-A-0001 pattern', () => {
    assert.equal(generateApplicationId(1), 'INX26-A-0001');
    assert.equal(generateApplicationId(47), 'INX26-A-0047');
    assert.equal(generateApplicationId(120), 'INX26-A-0120');
    assert.equal(generateApplicationId(9999), 'INX26-A-9999');
  });

  test('Email Subject format strictly includes event name and Application ID', () => {
    const subject = buildSubject('INX26-A-0047');
    assert.equal(subject, 'InnovXathon 2026 — Application Successfully Submitted | INX26-A-0047');
  });

  test('Email validator accepts valid team leader emails and normalizes', () => {
    const valid = validateEmail('stratupclubkic@kce.ac.in');
    assert.equal(valid.isValid, true);
    assert.equal(valid.error, null);

    const valid2 = validateEmail('student.lead_2026@gmail.com');
    assert.equal(valid2.isValid, true);
  });

  test('Email validator rejects missing or invalid emails with clear errors', () => {
    assert.equal(validateEmail('').isValid, false);
    assert.equal(validateEmail(null).isValid, false);
    assert.equal(validateEmail('not-an-email').isValid, false);
    assert.equal(validateEmail('@domain.com').isValid, false);
  });

  test('HTML Escaper neutralizes XSS characters safely', () => {
    const raw = '<script>alert("hack")</script> & \'quotes\'';
    const escaped = escapeHtml(raw);
    assert.equal(escaped, '&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt; &amp; &#039;quotes&#039;');
  });

  test('REAL InnovXathon Form Data extraction correctly maps Team Leader, Team Name, and prevents Team Member 2/3/4 overwrites', () => {
    const headers = [
      'Timestamp',
      'Email',
      'Full Name (Team Leader)',
      'Team Name',
      'Team Member 2',
      'Team Member 3',
      'Team Member 4',
      'College',
      'Department',
      'Year',
      'I understand that I will have to pay $$ upon arrival',
      'Idea Title',
      'Description',
      'Drive Link'
    ];
    const values = [
      '9/11/2026 12:19:57',
      '717823i207@kce.ac.in',
      'Girikannan M P',
      'UV',
      'NAM',
      'jee',
      'deepti',
      'KCE',
      'AD',
      'II',
      'Yes',
      'zyra',
      'jklrtyuiopzxcvbnm,',
      'https://drive.google.com/open?id=1a17OvfEJDPm1IoLCCR05dOZP25YRWIy2'
    ];

    const extracted = extractFormData(headers, values, null);
    assert.equal(extracted.leaderEmail, '717823i207@kce.ac.in');
    assert.equal(extracted.leaderName, 'Girikannan M P');
    assert.equal(extracted.teamName, 'UV');
    assert.equal(extracted.college, 'KCE');
    assert.equal(extracted.ideaTitle, 'zyra');
  });

  test('Fuzzy extraction also works with namedValues from Form Submit event', () => {
    const namedValues = {
      'Email': ['717823i207@kce.ac.in'],
      'Full Name (Team Leader)': ['Girikannan M P'],
      'Team Name': ['UV'],
      'Team Member 2': ['NAM'],
      'Team Member 3': ['jee'],
      'Team Member 4': ['deepti'],
      'College': ['KCE'],
      'Idea Title': ['zyra']
    };

    const extracted = extractFormData([], [], namedValues);
    assert.equal(extracted.leaderEmail, '717823i207@kce.ac.in');
    assert.equal(extracted.leaderName, 'Girikannan M P');
    assert.equal(extracted.teamName, 'UV');
    assert.equal(extracted.college, 'KCE');
    assert.equal(extracted.ideaTitle, 'zyra');
  });

  test('Missing optional Idea Title falls back gracefully', () => {
    const headers = ['Team Name', 'Team Leader Email'];
    const values = ['Alpha Team', 'alpha@gmail.com'];
    const extracted = extractFormData(headers, values, null);

    assert.equal(extracted.teamName, 'Alpha Team');
    assert.equal(extracted.leaderEmail, 'alpha@gmail.com');
    assert.ok(extracted.ideaTitle.length > 0);
  });
});
