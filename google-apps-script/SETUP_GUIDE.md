# InnovXathon 2026 — Google Apps Script Email Confirmation Setup Guide

This guide details how to deploy the production Google Apps Script backend to automatically dispatch real branded email confirmations whenever a participant team submits the official InnovXathon 2026 Google Registration Form.

---

## 🚀 Architecture Overview

```
Student Submits Google Form
           │
           ▼
Responses saved in linked Google Sheet
           │
           ▼
Apps Script Installable Trigger ("On form submit") fires
           │
           ▼
[LockService] Concurrency-safe Application ID generated (INX26-A-0001)
           │
           ▼
Status persisted as "SUBMITTED"
           │
           ▼
Idempotency Check: (EMAIL_STATUS != "SENT")
           │
           ▼
Sanitize & Validate Team Leader Email + HTML escaping
           │
           ▼
Verify Daily Email Quota (MailApp.getRemainingDailyQuota() > 0)
           │
           ▼
Send Branded HTML & Plain-Text Email via MailApp
           │
           ▼
Write EMAIL_STATUS = "SENT" and log in "15_EMAIL_LOG" & "16_AUDIT_LOG"
```

---

## 🛠️ Step-by-Step Deployment Instructions

### Step 1: Open the Google Sheet Linked to the Google Form
1. Open the **Google Sheet** that receives responses from the InnovXathon Google Registration Form.
2. In the top menu, click **Extensions** $\rightarrow$ **Apps Script**.
3. Name your Apps Script project (e.g., `InnovXathon-2026-Backend`).

---

### Step 2: Copy the Backend Code
1. In the Apps Script code editor, delete any boilerplate code in `Code.gs`.
2. Open [`google-apps-script/Code.gs`](./Code.gs) from this repository.
3. Paste the entire code into the `Code.gs` file in the Apps Script editor.
4. Click the **Save** icon (floppy disk) or press `Ctrl + S` / `Cmd + S`.

---

### Step 3: Install the Trigger (One-Click)
1. In the toolbar function dropdown, select **`installTrigger`**.
2. Click **Run**.
3. **Authorization Dialog**: When prompted for permissions, click **Review Permissions**, choose your Google Workspace/Gmail account, click **Advanced** $\rightarrow$ **Go to InnovXathon-2026-Backend (unsafe)**, and click **Allow**.
4. The execution log will confirm:
   ```
   ✅ Successfully installed "onFormSubmit" trigger on spreadsheet: InnovXathon 2026 Responses
   ```

*(Alternative Manual Trigger Setup: Click the clock icon on the left sidebar $\rightarrow$ **Add Trigger** $\rightarrow$ Function: `onFormSubmit`, Deployment: `Head`, Event Source: `From spreadsheet`, Event Type: `On form submit` $\rightarrow$ **Save**).*

---

### Step 4: Run the Self-Test
1. In the function dropdown, select **`testRegistrationFlow`**.
2. Click **Run**.
3. Check the execution logs to verify that email validation, HTML escaping, and email builders pass with `PASSED ✅`.

---

## 📋 Features & Safeguards

### 1. Concurrency-Safe Application ID (`INX26-A-0001`)
- Employs `LockService.getScriptLock()` with a 30-second lock window.
- Synchronized using `PropertiesService` counter `INX26_LAST_APPLICATION_COUNTER`.
- Automatically initializes from existing sheet maximum ID if any exist, preventing duplicate ID collisions.

### 2. Flexible Fuzzy Header Resolution (`FORM_FIELDS`)
- Automatically detects variations in Google Form question labels:
  - Team Name: `"Team Name"`, `"Name of the Team"`, `"team_name"`
  - Leader Name: `"Team Leader Full Name"`, `"Team Leader Name"`, `"Leader Name"`
  - Leader Email: `"Team Leader Email"`, `"Team Leader Email ID"`, `"Email Address"`
  - College: `"College / Institution Name"`, `"College Name"`, `"Institution"`
  - Idea Title: `"Idea Title"`, `"Title of Idea"`, `"Project Title"`

### 3. Idempotency & Duplicate Prevention
- Checks `Confirmation Email Status` on the response row before dispatching.
- If already `SENT`, suppresses automatic resends to prevent duplicate notifications upon trigger retries.

### 4. Separate Registration & Email Failure Handling
- If the Team Leader email is invalid or daily quota is exhausted:
  - Registration is **NOT deleted or lost** — it remains safely stored as `SUBMITTED`.
  - `Confirmation Email Status` is marked `FAILED` with details written to `Backend Error Log`.
  - The failed attempt is logged in `15_EMAIL_LOG`.

### 5. Automated Audit & Logging Sheets
The script automatically provisions and maintains two structured sheets:
- **`15_EMAIL_LOG`**: Records `email_log_id`, `application_id`, `team_name`, `recipient`, `email_type`, `subject`, `status`, `attempted_at`, `sent_at`, `error_message`.
- **`16_AUDIT_LOG`**: Records `audit_id`, `event_type` (`REGISTRATION_CONFIRMATION_EMAIL_SENT`), `application_id`, `team_name`, `recipient`, `timestamp`, `details`.

### 6. Email Quota & Utility Tools
- **`reprocessFailedEmails()`**: A utility function in `Code.gs` that can be executed anytime to retry all failed/pending emails once daily quota resets.

---

## 📧 Email Appearance & Copy

- **Subject**: `InnovXathon 2026 — Application Successfully Submitted | {{APPLICATION_ID}}`
- **Sender Name**: `InnovXathon 2026`
- **Reply-To**: `innovxera@kce.ac.in`
- **Visual Identity**: Dark theme `#050811` / `#0D1222` with `#FF7300` accents, clear `SUBMITTED` status pill, application parameters, explicit warning that submission does not guarantee shortlisting, and key event parameters.
