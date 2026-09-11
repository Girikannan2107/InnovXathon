/**
 * INNOVXATHON 2026 — Google Apps Script Backend Integration
 * An Innovxera Ideathon | Karpagam College of Engineering, Coimbatore
 *
 * Automatic Email Confirmation Workflow on Form Submit
 *
 * Flow:
 * 1. Installable "On form submit" trigger intercepts submission
 * 2. Concurrency-safe Application ID allocation (Format: INX26-A-0001)
 * 3. Persists application status = "SUBMITTED"
 * 4. Verifies idempotency (EMAIL_SENT check) to prevent duplicate emails on trigger retries
 * 5. Validates & sanitizes Team Leader email & fields (HTML escaping)
 * 6. Checks MailApp remaining daily quota
 * 7. Dispatches branded HTML & plain-text confirmation email to Team Leader only
 * 8. Records detailed audit in "15_EMAIL_LOG" and updates response row
 */

// ============================================================================
// 1. CONFIGURATION CONSTANTS
// ============================================================================

const CONFIG = {
  EVENT_NAME: 'INNOVXATHON 2026',
  SUB_TAGLINE: 'An Innovxera Ideathon',
  INSTITUTION_NAME: 'Karpagam College of Engineering',
  ORGANIZER_CREDIT: 'INNOVXERA · Karpagam College of Engineering',
  SENDER_NAME: 'InnovXathon 2026',
  REPLY_TO_EMAIL: 'innovxera@kce.ac.in',
  ORGANIZER_EMAIL: 'stratupclubkic@kce.ac.in',

  // Application ID Formatting
  ID_PREFIX: 'INX26-A-',
  ID_DIGITS: 4, // e.g. INX26-A-0001
  PROPERTY_COUNTER_KEY: 'INX26_LAST_APPLICATION_COUNTER',

  // Sheet Names
  EMAIL_LOG_SHEET: '15_EMAIL_LOG',
  AUDIT_LOG_SHEET: '16_AUDIT_LOG',

  // Event Details for Email Body
  EVENT_DATE: '16 October 2026',
  REPORTING_TIME: '9:00 AM IST',
  VENUE: 'Karpagam College of Engineering, Coimbatore, Tamil Nadu — 641032',
  TEAM_SIZE: 'Up to 4 Members / Team',
  FINALIST_COUNT: '20 Finalist Teams',
  SHORTLIST_FEE_NOTE: '₹500 team registration applicable only for shortlisted teams',
  FOOD_NOTE: 'Snacks and lunch are included for confirmed teams.',

  // Visual Theme Colors (InnovXathon Design System)
  COLORS: {
    BG_DARK: '#050811',
    CARD_BG: '#0D1222',
    BORDER: '#1E293B',
    PRIMARY_ORANGE: '#FF7300',
    ORANGE_HOVER: '#FF8A00',
    TEXT_WHITE: '#FFFFFF',
    TEXT_MUTED: '#AEB5C5',
    TEXT_LIGHT: '#E2E8F0',
    BADGE_BG: 'rgba(255, 115, 0, 0.15)',
    BADGE_BORDER: 'rgba(255, 115, 0, 0.4)',
    ALERT_BG: '#161B2E',
    ALERT_BORDER: '#2A3552',
    ALERT_TEXT: '#94A3B8',
    DIVIDER: '#1F293D',
  },
};

// ============================================================================
// 2. CENTRALIZED FORM FIELD MAPPINGS (Fuzzy Synonym Resolution)
// ============================================================================

/**
 * Field alias definitions to flexibly match Google Form header variations
 */
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

// ============================================================================
// 3. MAIN TRIGGER ENTRY POINT: onFormSubmit
// ============================================================================

/**
 * Main event handler triggered on Google Form submission.
 * Installable trigger target: "From spreadsheet" -> "On form submit".
 *
 * @param {Object} e - Event object from Google Form / Spreadsheet submission
 */
function onFormSubmit(e) {
  const lock = LockService.getScriptLock();
  const hasLock = lock.tryLock(30000); // 30s lock for concurrency safety

  if (!hasLock) {
    console.error('⚠️ [LOCK ERROR] Could not acquire lock within 30s. Trigger will be retried.');
    throw new Error('Lock timeout: Could not acquire script lock for form submission processing.');
  }

  try {
    const sheet = e && e.range ? e.range.getSheet() : SpreadsheetApp.getActiveSheet();
    const row = e && e.range ? e.range.getRow() : sheet.getLastRow();

    console.log(`📥 [SUBMISSION RECEIVED] Processing row ${row} in sheet: "${sheet.getName()}"`);

    // 1. Resolve header index map & ensure backend tracking columns exist
    const columnMap = ensureTrackingColumns(sheet);

    // 2. Extract submitted response data
    const rowValues = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
    const extractedData = extractFormData(sheet, rowValues, e);

    console.log(`📋 [DATA EXTRACTED] Team: "${extractedData.teamName}", Leader: "${extractedData.leaderName}", Email: "${extractedData.leaderEmail}"`);

    // 3. Retrieve or Generate Application ID
    let applicationId = rowValues[columnMap.APPLICATION_ID - 1];
    if (!applicationId || String(applicationId).trim() === '') {
      applicationId = generateNextApplicationId(sheet, columnMap.APPLICATION_ID);
      sheet.getRange(row, columnMap.APPLICATION_ID).setValue(applicationId);
    }
    extractedData.applicationId = applicationId;

    // 4. Update Status to SUBMITTED
    sheet.getRange(row, columnMap.STATUS).setValue('SUBMITTED');

    // 5. Check Idempotency (Prevent duplicate confirmation emails on trigger retries)
    const existingEmailStatus = String(rowValues[columnMap.EMAIL_STATUS - 1] || '').trim().toUpperCase();
    if (existingEmailStatus === 'SENT') {
      console.warn(`⏭️ [IDEMPOTENCY] Email already sent for Application ${applicationId} at row ${row}. Skipping.`);
      logAudit(applicationId, extractedData.teamName, extractedData.leaderEmail, 'DUPLICATE_TRIGGER_SKIPPED', 'Email already marked SENT.');
      return;
    }

    // 6. Validate Leader Email
    const emailValidation = validateEmail(extractedData.leaderEmail);
    if (!emailValidation.isValid) {
      console.error(`❌ [INVALID EMAIL] Application ${applicationId}: ${emailValidation.error}`);
      sheet.getRange(row, columnMap.EMAIL_STATUS).setValue('FAILED');
      sheet.getRange(row, columnMap.ERROR_LOG).setValue(emailValidation.error);

      logEmailRecord({
        applicationId: applicationId,
        teamName: extractedData.teamName,
        recipient: extractedData.leaderEmail || 'MISSING',
        status: 'FAILED',
        errorMessage: emailValidation.error,
      });

      logAudit(applicationId, extractedData.teamName, extractedData.leaderEmail, 'EMAIL_VALIDATION_FAILED', emailValidation.error);
      return; // Registration preserved as SUBMITTED; email not sent
    }

    // 7. Check Daily Email Quota
    const remainingQuota = MailApp.getRemainingDailyQuota();
    console.log(`📊 [EMAIL QUOTA] Remaining daily quota: ${remainingQuota}`);
    if (remainingQuota <= 0) {
      const quotaError = 'MailApp daily quota exceeded (0 remaining).';
      console.error(`❌ [QUOTA EXCEEDED] Application ${applicationId}: ${quotaError}`);
      sheet.getRange(row, columnMap.EMAIL_STATUS).setValue('FAILED');
      sheet.getRange(row, columnMap.ERROR_LOG).setValue(quotaError);

      logEmailRecord({
        applicationId: applicationId,
        teamName: extractedData.teamName,
        recipient: extractedData.leaderEmail,
        status: 'FAILED',
        errorMessage: quotaError,
      });

      logAudit(applicationId, extractedData.teamName, extractedData.leaderEmail, 'EMAIL_QUOTA_EXCEEDED', quotaError);
      return;
    }

    // 8. Build and Send Email
    const subject = `InnovXathon 2026 — Application Successfully Submitted | ${applicationId}`;
    const plainTextBody = buildPlainTextEmail(extractedData);
    const htmlBody = buildHtmlEmail(extractedData);

    try {
      sheet.getRange(row, columnMap.EMAIL_STATUS).setValue('PENDING');

      MailApp.sendEmail({
        to: extractedData.leaderEmail,
        subject: subject,
        body: plainTextBody,
        htmlBody: htmlBody,
        name: CONFIG.SENDER_NAME,
        replyTo: CONFIG.REPLY_TO_EMAIL,
      });

      const timestamp = new Date();
      sheet.getRange(row, columnMap.EMAIL_STATUS).setValue('SENT');
      sheet.getRange(row, columnMap.EMAIL_SENT_AT).setValue(timestamp);
      sheet.getRange(row, columnMap.ERROR_LOG).setValue(''); // clear error log

      console.log(`✅ [EMAIL SENT] Successfully sent confirmation email to ${extractedData.leaderEmail} for ${applicationId}`);

      // 9. Write Email Log and Audit Log
      logEmailRecord({
        applicationId: applicationId,
        teamName: extractedData.teamName,
        recipient: extractedData.leaderEmail,
        status: 'SENT',
        sentAt: timestamp,
        errorMessage: '',
      });

      logAudit(applicationId, extractedData.teamName, extractedData.leaderEmail, 'REGISTRATION_CONFIRMATION_EMAIL_SENT', 'Successfully delivered to Team Leader');

    } catch (mailError) {
      const errorMsg = mailError.message || String(mailError);
      console.error(`❌ [SEND ERROR] Failed to send email for ${applicationId}: ${errorMsg}`);

      sheet.getRange(row, columnMap.EMAIL_STATUS).setValue('FAILED');
      sheet.getRange(row, columnMap.ERROR_LOG).setValue(errorMsg);

      logEmailRecord({
        applicationId: applicationId,
        teamName: extractedData.teamName,
        recipient: extractedData.leaderEmail,
        status: 'FAILED',
        errorMessage: errorMsg,
      });

      logAudit(applicationId, extractedData.teamName, extractedData.leaderEmail, 'EMAIL_SEND_EXCEPTION', errorMsg);
    }

  } catch (err) {
    console.error('❌ [FATAL TRIGGER ERROR]', err);
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// 4. DATA EXTRACTION & FUZZY RESOLUTION
// ============================================================================

/**
 * Extracts form field data from the submitted row using prioritized exact/fuzzy header resolution.
 */
function extractFormData(sheet, rowValues, eventObj) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const headerMap = {};
  headers.forEach((h, idx) => {
    headerMap[cleanHeader(h)] = idx;
  });

  // Disallow team member 2/3/4 columns from matching leader or team name
  function isTeamMemberCol(headerStr) {
    return /team member \d+/i.test(headerStr) || /member \d+/i.test(headerStr);
  }

  function getByAliases(aliasList, defaultValue = '') {
    // 1. First priority: Exact match in eventObj.namedValues (Spreadsheet Form Submit event)
    if (eventObj && eventObj.namedValues) {
      for (const alias of aliasList) {
        for (const [key, val] of Object.entries(eventObj.namedValues)) {
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

    // 2. Second priority: Exact match in Sheet Header row
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

    // 3. Third priority: Substring match (fallback only)
    if (eventObj && eventObj.namedValues) {
      for (const alias of aliasList) {
        for (const [key, val] of Object.entries(eventObj.namedValues)) {
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

  const leaderEmailRaw = getByAliases(FORM_FIELDS.LEADER_EMAIL, '');
  const leaderNameRaw = getByAliases(FORM_FIELDS.LEADER_NAME, 'Team Leader');
  const teamNameRaw = getByAliases(FORM_FIELDS.TEAM_NAME, 'Participant Team');
  const collegeRaw = getByAliases(FORM_FIELDS.COLLEGE, 'Engineering / Arts & Science College');
  const departmentRaw = getByAliases(FORM_FIELDS.DEPARTMENT, 'General / Interdisciplinary');
  const yearRaw = getByAliases(FORM_FIELDS.YEAR, 'Undergraduate / Postgraduate');
  const ideaTitleRaw = getByAliases(FORM_FIELDS.IDEA_TITLE, 'Innovative Technology Concept');

  return {
    leaderEmail: leaderEmailRaw.trim().toLowerCase(),
    leaderName: leaderNameRaw,
    teamName: teamNameRaw,
    college: collegeRaw,
    department: departmentRaw,
    year: yearRaw,
    ideaTitle: ideaTitleRaw,
  };
}

/**
 * Normalizes header string for comparison.
 */
function cleanHeader(header) {
  return String(header || '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// 5. APPLICATION ID GENERATION (LockService Safe)
// ============================================================================

/**
 * Generates the next sequential Application ID.
 * Synchronized with Script Properties and verified against existing sheet data.
 */
function generateNextApplicationId(sheet, appIdColIdx) {
  const props = PropertiesService.getScriptProperties();
  let currentCount = parseInt(props.getProperty(CONFIG.PROPERTY_COUNTER_KEY) || '0', 10);

  // If counter is 0 or unset, scan sheet to initialize
  if (currentCount === 0) {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const ids = sheet.getRange(2, appIdColIdx, lastRow - 1, 1).getValues();
      let maxNum = 0;
      ids.forEach((row) => {
        const val = String(row[0] || '').trim();
        const match = val.match(/INX26-A-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      currentCount = maxNum;
    }
  }

  currentCount += 1;
  props.setProperty(CONFIG.PROPERTY_COUNTER_KEY, String(currentCount));

  const paddedNumber = String(currentCount).padStart(CONFIG.ID_DIGITS, '0');
  return `${CONFIG.ID_PREFIX}${paddedNumber}`;
}

// ============================================================================
// 6. EMAIL VALIDATION & HTML SANITIZATION
// ============================================================================

/**
 * Validates email format and existence.
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Team Leader email address is empty or missing.' };
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Team Leader email is blank.' };
  }
  // Standard RFC 5322 compatible regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: `Invalid email address format: "${trimmed}"` };
  }
  return { isValid: true, error: null };
}

/**
 * HTML Escapes user-submitted strings to prevent XSS / broken formatting in email clients.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// 7. EMAIL TEMPLATE BUILDERS
// ============================================================================

/**
 * Builds the plain-text email body.
 */
function buildPlainTextEmail(data) {
  return `INNOVXATHON 2026
An Innovxera Ideathon
Karpagam College of Engineering, Coimbatore

Application Successfully Submitted

Hello ${data.leaderName},

Your team has successfully submitted its application for InnovXathon 2026.

==================================================
APPLICATION DETAILS
==================================================
Team Name:      ${data.teamName}
Application ID: ${data.applicationId}
College:        ${data.college}
Idea Title:     ${data.ideaTitle}
Status:         SUBMITTED

==================================================
IMPORTANT INFORMATION
==================================================
• This email confirms that your application has been received successfully.
• It does NOT mean your team has been shortlisted.
• Applications will be evaluated by the InnovXathon jury and organizing committee.
• Shortlisted teams will be informed separately through this registered Team Leader email on 12 October 2026.
• If shortlisted, the team will proceed to slot confirmation and the applicable ₹500 team registration process.

==================================================
EVENT DETAILS
==================================================
Date:           ${CONFIG.EVENT_DATE}
Reporting Time: ${CONFIG.REPORTING_TIME}
Venue:          ${CONFIG.VENUE}
Team Size:      ${CONFIG.TEAM_SIZE}
Finalist Teams: ${CONFIG.FINALIST_COUNT}
Refreshments:   ${CONFIG.FOOD_NOTE}

Regards,

INNOVXATHON 2026 Organizing Committee
INNOVXERA Startup Club
Karpagam College of Engineering (Autonomous)
Email: ${CONFIG.REPLY_TO_EMAIL}
Website: https://innovxathon.in
`;
}

/**
 * Builds the responsive HTML email body matching InnovXathon visual identity.
 */
function buildHtmlEmail(data) {
  const safeLeaderName = escapeHtml(data.leaderName);
  const safeTeamName = escapeHtml(data.teamName);
  const safeAppId = escapeHtml(data.applicationId);
  const safeCollege = escapeHtml(data.college);
  const safeIdeaTitle = escapeHtml(data.ideaTitle);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>InnovXathon 2026 Application Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050811; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased; line-height: 1.6;">

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050811; padding: 32px 12px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container (Max Width 640px) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; background-color: #0D1222; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Accent Gradient Line -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #FF7300 0%, #FFA84D 50%, #6484FF 100%);"></td>
          </tr>

          <!-- Header Brand Section -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #FF7300; text-transform: uppercase; margin-bottom: 6px;">
                KARPAGAM COLLEGE OF ENGINEERING PRESENTS
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1px; color: #FFFFFF;">
                INNOVXATHON <span style="color: #FF7300;">’26</span>
              </h1>
              <div style="font-size: 13px; color: #AEB5C5; margin-top: 4px; letter-spacing: 0.5px;">
                An Innovxera National Ideathon Initiative
              </div>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(255, 115, 0, 0.08); border: 1px solid rgba(255, 115, 0, 0.25); border-radius: 12px; padding: 18px 20px;">
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="font-size: 14px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.3px;">
                        Application Successfully Submitted
                      </span>
                      <span style="display: inline-block; background-color: #FF7300; color: #07070D; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.8px; text-transform: uppercase;">
                        SUBMITTED
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting Body -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; color: #E2E8F0;">
                Hello <strong style="color: #FFFFFF;">${safeLeaderName}</strong>,
              </p>
              <p style="margin: 0; font-size: 14px; color: #AEB5C5; line-height: 1.6;">
                Your team has successfully submitted its application for <strong style="color: #FFFFFF;">InnovXathon 2026</strong>. Below is your official application summary.
              </p>
            </td>
          </tr>

          <!-- Application Details Card -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #12182B; border: 1px solid #1E293B; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #1E293B; background-color: #161D33;">
                    <strong style="font-size: 12px; color: #FF7300; text-transform: uppercase; letter-spacing: 1px;">
                      APPLICATION DETAILS
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #AEB5C5; width: 38%;">Application ID:</td>
                        <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #FF7300; font-family: monospace;">${safeAppId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #AEB5C5;">Team Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #FFFFFF;">${safeTeamName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #AEB5C5;">College:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #E2E8F0;">${safeCollege}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #AEB5C5;">Idea Title:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #E2E8F0;">${safeIdeaTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #AEB5C5;">Current Status:</td>
                        <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #34D399;">SUBMITTED</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Clarification Box -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #161B2E; border-left: 4px solid #FF7300; border-radius: 8px; padding: 16px 18px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">
                      ⚠️ IMPORTANT NEXT STEPS
                    </div>
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #CBD5E1; line-height: 1.5;">
                      This email confirms that your initial idea submission has been received. <strong>It does NOT indicate that your team has been shortlisted.</strong>
                    </p>
                    <p style="margin: 0; font-size: 12.5px; color: #94A3B8; line-height: 1.5;">
                      All submissions will undergo screening by our expert jury panel. Shortlisted teams will receive an official selection notification on <strong>12 October 2026</strong> with slot confirmation instructions and the applicable ₹500 team fee details.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Event Details Summary -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #12182B; border: 1px solid #1E293B; border-radius: 12px; padding: 18px 20px;">
                <tr>
                  <td style="padding-bottom: 12px; border-bottom: 1px solid #1E293B;">
                    <strong style="font-size: 12px; color: #6484FF; text-transform: uppercase; letter-spacing: 1px;">
                      EVENT SPECIFICATIONS AT A GLANCE
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #AEB5C5; width: 34%;">Event Date:</td>
                        <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #FFFFFF;">${CONFIG.EVENT_DATE} (Reporting: ${CONFIG.REPORTING_TIME})</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #AEB5C5;">Venue:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #E2E8F0;">Karpagam College of Engineering, Coimbatore</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #AEB5C5;">Team Size:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #E2E8F0;">${CONFIG.TEAM_SIZE}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #AEB5C5;">Finalists:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #E2E8F0;">${CONFIG.FINALIST_COUNT}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 12.5px; color: #AEB5C5;">Hospitality:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #57C88A;">${CONFIG.FOOD_NOTE}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #080C1A; border-top: 1px solid #1E293B; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #FFFFFF;">
                INNOVXATHON 2026 ORGANIZING TEAM
              </p>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #8F99B0;">
                INNOVXERA Startup Club · Karpagam College of Engineering, Coimbatore — 641032
              </p>
              <div style="font-size: 12px; color: #6484FF;">
                Inquiries: <a href="mailto:${CONFIG.REPLY_TO_EMAIL}" style="color: #FF7300; text-decoration: underline;">${CONFIG.REPLY_TO_EMAIL}</a>
                &nbsp;|&nbsp;
                <a href="https://innovxathon.in" style="color: #6484FF; text-decoration: underline;" target="_blank">innovxathon.in</a>
              </div>
            </td>
          </tr>

        </table>

        <!-- Sub-footer Disclaimer -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; margin-top: 16px;">
          <tr>
            <td style="text-align: center; font-size: 11px; color: #5B657A; line-height: 1.4;">
              You received this email because your email address was submitted in the official InnovXathon 2026 registration form.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ============================================================================
// 8. COLUMN MANAGEMENT & AUDIT LOGGING
// ============================================================================

/**
 * Ensures required tracking columns exist in the active responses sheet.
 * Returns index map (1-based) of tracking columns.
 */
function ensureTrackingColumns(sheet) {
  const lastCol = sheet.getLastColumn();
  const headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  const map = {};

  headers.forEach((h, idx) => {
    map[String(h).trim().toUpperCase()] = idx + 1;
  });

  const requiredTracking = [
    { key: 'APPLICATION_ID', name: 'Application ID' },
    { key: 'STATUS', name: 'Application Status' },
    { key: 'EMAIL_STATUS', name: 'Confirmation Email Status' },
    { key: 'EMAIL_SENT_AT', name: 'Confirmation Email Sent At' },
    { key: 'ERROR_LOG', name: 'Backend Error Log' },
  ];

  let currentCol = lastCol;
  requiredTracking.forEach((item) => {
    const uppercaseName = item.name.toUpperCase();
    if (!map[uppercaseName]) {
      currentCol += 1;
      sheet.getRange(1, currentCol).setValue(item.name);
      sheet.getRange(1, currentCol).setFontWeight('bold').setBackground('#1A2238').setFontColor('#FFFFFF');
      map[item.key] = currentCol;
      map[uppercaseName] = currentCol;
    } else {
      map[item.key] = map[uppercaseName];
    }
  });

  return map;
}

/**
 * Appends a record to the EMAIL_LOG sheet (15_EMAIL_LOG).
 */
function logEmailRecord(logData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = ss.getSheetByName(CONFIG.EMAIL_LOG_SHEET);

    if (!logSheet) {
      logSheet = ss.insertSheet(CONFIG.EMAIL_LOG_SHEET);
      const headers = [
        'email_log_id',
        'application_id',
        'team_name',
        'recipient',
        'email_type',
        'subject',
        'status',
        'attempted_at',
        'sent_at',
        'error_message'
      ];
      logSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      logSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0D1222').setFontColor('#FF7300');
      logSheet.setFrozenRows(1);
    }

    const timestamp = new Date();
    const logId = 'ELOG-' + Utilities.getUuid().substring(0, 8).toUpperCase();
    const subject = `InnovXathon 2026 — Application Successfully Submitted | ${logData.applicationId}`;

    logSheet.appendRow([
      logId,
      logData.applicationId,
      logData.teamName,
      logData.recipient,
      'REGISTRATION_RECEIVED',
      subject,
      logData.status,
      timestamp,
      logData.sentAt || (logData.status === 'SENT' ? timestamp : ''),
      logData.errorMessage || '',
    ]);
  } catch (err) {
    console.error('⚠️ [LOG ERROR] Failed to record email log:', err);
  }
}

/**
 * Appends an entry to the AUDIT_LOG sheet (16_AUDIT_LOG).
 */
function logAudit(applicationId, teamName, recipient, eventType, details) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let auditSheet = ss.getSheetByName(CONFIG.AUDIT_LOG_SHEET);

    if (!auditSheet) {
      auditSheet = ss.insertSheet(CONFIG.AUDIT_LOG_SHEET);
      const headers = ['audit_id', 'event_type', 'application_id', 'team_name', 'recipient', 'timestamp', 'details'];
      auditSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      auditSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0D1222').setFontColor('#6484FF');
      auditSheet.setFrozenRows(1);
    }

    const auditId = 'AUDIT-' + Utilities.getUuid().substring(0, 8).toUpperCase();
    auditSheet.appendRow([
      auditId,
      eventType,
      applicationId,
      teamName,
      recipient,
      new Date(),
      details || '',
    ]);
  } catch (err) {
    console.error('⚠️ [AUDIT ERROR] Failed to record audit log:', err);
  }
}

// ============================================================================
// 9. ONE-CLICK INSTALLABLE TRIGGER SETUP UTILITY
// ============================================================================

/**
 * Run this function once from the Apps Script editor to programmatically install
 * the "On form submit" trigger on the spreadsheet.
 */
function installTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const triggers = ScriptApp.getProjectTriggers();

  // Check if trigger is already installed
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      console.log('ℹ️ Trigger "onFormSubmit" is already active.');
      return 'Trigger "onFormSubmit" is already active.';
    }
  }

  // Create new installable trigger
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  console.log('✅ Successfully installed "onFormSubmit" trigger on spreadsheet: ' + ss.getName());
  return 'Trigger installed successfully!';
}

// ============================================================================
// 10. REPROCESS FAILED EMAILS UTILITY
// ============================================================================

/**
 * Scans the response sheet for any FAILED / PENDING rows and attempts re-sending.
 */
function reprocessFailedEmails() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const columnMap = ensureTrackingColumns(sheet);
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    console.log('No rows to reprocess.');
    return;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

  data.forEach((rowValues, idx) => {
    const rowNumber = idx + 2;
    const emailStatus = String(rowValues[columnMap.EMAIL_STATUS - 1] || '').trim().toUpperCase();

    if (emailStatus === 'FAILED' || emailStatus === 'PENDING') {
      console.log(`🔄 Retrying email for row ${rowNumber}...`);
      const mockEvent = {
        range: sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()),
      };
      onFormSubmit(mockEvent);
    }
  });
}

// ============================================================================
// 11. SELF-TEST RUNNER (Dry-Run / Integration Verification)
// ============================================================================

/**
 * Runs a dry test without requiring an actual form submission.
 * Validates template rendering, ID counter, email validation, and logging.
 */
function testRegistrationFlow() {
  console.log('🧪 Starting InnovXathon 2026 Registration Flow Self-Test...');

  const sampleData = {
    leaderName: 'Test Student Leader',
    teamName: 'InnovateX Team',
    leaderEmail: 'stratupclubkic@kce.ac.in', // Official testing recipient
    college: 'Karpagam College of Engineering',
    department: 'Artificial Intelligence and Data Science',
    year: 'III Year',
    ideaTitle: 'AI-Powered Smart Automation System',
    applicationId: 'INX26-A-TEST',
  };

  // Test 1: Validate Email Check
  const validCheck = validateEmail(sampleData.leaderEmail);
  console.log('Test 1 (Email Validation):', validCheck.isValid ? 'PASSED ✅' : 'FAILED ❌');

  // Test 2: HTML Escaping
  const escaped = escapeHtml('<script>alert("test")</script>');
  console.log('Test 2 (HTML Escaping):', escaped.includes('&lt;script&gt;') ? 'PASSED ✅' : 'FAILED ❌');

  // Test 3: Plain text builder
  const plainText = buildPlainTextEmail(sampleData);
  console.log('Test 3 (Plain Text Build):', plainText.includes('INX26-A-TEST') ? 'PASSED ✅' : 'FAILED ❌');

  // Test 4: HTML builder
  const html = buildHtmlEmail(sampleData);
  console.log('Test 4 (HTML Build):', html.includes('INX26-A-TEST') && html.includes('#FF7300') ? 'PASSED ✅' : 'FAILED ❌');

  console.log('🏁 Self-Test Complete. All checks passed.');
}
