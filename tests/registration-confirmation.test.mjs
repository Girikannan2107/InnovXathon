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
  TEAM_NAME: ['team name', 'team_name', 'name of the team', 'team'],
  LEADER_NAME: ['team leader full name', 'team leader name', 'leader name', 'full name of team leader', 'name of leader'],
  LEADER_EMAIL: ['team leader email', 'team leader email id', 'leader email', 'email address', 'email id', 'email'],
  COLLEGE: ['college / institution name', 'college name', 'institution name', 'college'],
  IDEA_TITLE: ['idea title', 'title of idea', 'project title', 'title of the project', 'idea / project title'],
};

function cleanHeader(header) {
  return String(header || '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFormData(rowHeaders, rowValues, namedValues) {
  const headerMap = {};
  rowHeaders.forEach((h, idx) => {
    headerMap[cleanHeader(h)] = idx;
  });

  function getByAliases(aliasList, defaultValue = '') {
    if (namedValues) {
      for (const [key, val] of Object.entries(namedValues)) {
        const cleanedKey = cleanHeader(key);
        for (const alias of aliasList) {
          if (cleanedKey === alias || cleanedKey.includes(alias)) {
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
        if (header === alias || header.includes(alias)) {
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

  test('Fuzzy Form Data extraction handles varying Google Form header labels', () => {
    const headers = [
      'Timestamp',
      'Team Name',
      'Team Leader Full Name',
      'Team Leader Email ID',
      'College / Institution Name',
      'Idea / Project Title'
    ];
    const values = [
      '2026-09-11 10:00:00',
      'Apex Innovators',
      'Rahul S',
      'rahul@kce.ac.in',
      'Karpagam College of Engineering',
      'Autonomous Drone Navigation'
    ];

    const extracted = extractFormData(headers, values, null);
    assert.equal(extracted.teamName, 'Apex Innovators');
    assert.equal(extracted.leaderName, 'Rahul S');
    assert.equal(extracted.leaderEmail, 'rahul@kce.ac.in');
    assert.equal(extracted.college, 'Karpagam College of Engineering');
    assert.equal(extracted.ideaTitle, 'Autonomous Drone Navigation');
  });

  test('Fuzzy extraction also works with namedValues from Form Submit event', () => {
    const namedValues = {
      'team_name': ['Quantum Minds'],
      'Leader Name': ['Priya D'],
      'Email Address': ['priya@gmail.com'],
      'College': ['CIT Coimbatore'],
      'Title of Idea': ['Smart Water Purification']
    };

    const extracted = extractFormData([], [], namedValues);
    assert.equal(extracted.teamName, 'Quantum Minds');
    assert.equal(extracted.leaderName, 'Priya D');
    assert.equal(extracted.leaderEmail, 'priya@gmail.com');
    assert.equal(extracted.college, 'CIT Coimbatore');
    assert.equal(extracted.ideaTitle, 'Smart Water Purification');
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
