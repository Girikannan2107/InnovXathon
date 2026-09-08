# INNOVXATHON 2026 - Content Requirements for Event Administrators

This document outlines the specific configuration parameters in `lib/event-config.ts` that currently have placeholder values or await final confirmation from the organizing committee.

---

## 1. Public Submission & Document URLs

| Parameter | Location in `lib/event-config.ts` | Current Value | Required Action from Organizers |
| :--- | :--- | :--- | :--- |
| **Official Google Form URL** | `links.googleFormUrl` | `"REPLACE_WITH_OFFICIAL_GOOGLE_FORM_URL"` | Provide the published Google Form URL for participant registration. |
| **Guidelines Handbook PDF** | `links.guidelinesDocUrl` | `"REPLACE_WITH_OFFICIAL_GUIDELINES_DOC_URL"` | Provide Google Drive / CDN link to the finalized event guidelines PDF. |
| **Slide Presentation Template** | `links.slideTemplateUrl` | `"REPLACE_WITH_OFFICIAL_SLIDE_TEMPLATE_URL"` | Provide the Google Slides / PPTX presentation deck template link. |

*Note: The website UI automatically displays safe fallback notices and disabled states while these remain placeholders, preventing broken links for participants.*

---

## 2. On-Campus Specifics & Contact Refinements

| Parameter | Location in `lib/event-config.ts` | Current Value | Status |
| :--- | :--- | :--- | :--- |
| **Specific Auditorium / Hall** | `venue.hallOrBuilding` | `"Auditorium & Innovation Complex (To be confirmed at reporting)"` | Update with exact building number/hall once room allocation is finalized. |
| **Faculty Coordinator Contact** | `contacts.secondaryCoordinatorName` | `"Faculty Coordinator (To be announced)"` | Add faculty advisor's name and official institutional email if desired. |
| **Results Publication** | `results.isPublished` | `false` | Set to `true` on 16 October 2026 and populate the `results.winners` array with winning team names, colleges, and idea titles. |

---

## 3. Verified & Locked Parameters (No Changes Needed Unless Schedule Changes)

- **Event Date:** 16 October 2026 (Reporting Time: 9:00 AM IST)
- **Registration Window:** 10 September 2026 — 10 October 2026 (11:59 PM IST)
- **Shortlist Notification:** 12 October 2026 (6:00 PM IST)
- **Total Prize Pool:** ₹50,000 (Winner: ₹25,000, Runner-up: ₹15,000, Second Runner-up: ₹10,000)
- **Team Size:** Exactly 4 college students per team
- **Shortlist Fee:** ₹500 per shortlisted team (Initial application is ₹0 Free)
- **Venue:** Karpagam College of Engineering, Coimbatore, Tamil Nadu — 641032
- **Organizer Email:** `innovxera@kce.ac.in`
- **Student Helpline:** `+91 99658 06889`
