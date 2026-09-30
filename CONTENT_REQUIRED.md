# INNOVXATHON 2026 - Content Requirements for Event Administrators

This document outlines the specific configuration parameters in `lib/event-config.ts` that currently have placeholder values or await final confirmation from the organizing committee.

---

## 1. Public Submission & Document URLs

| Parameter | Location in `lib/event-config.ts` | Current Value | Required Action from Organizers |
| :--- | :--- | :--- | :--- |
| **Official Google Form URL** | `links.googleFormUrl` | `Official Google Form Active` | Published Google Form URL for participant registration. |
| **Guidelines Handbook PDF** | `links.guidelinesDocUrl` | `"REPLACE_WITH_OFFICIAL_GUIDELINES_DOC_URL"` | Provide Google Drive / CDN link to the finalized event guidelines PDF. |
| **Slide Presentation Template** | `links.slideTemplateUrl` | `"REPLACE_WITH_OFFICIAL_SLIDE_TEMPLATE_URL"` | Provide the Google Slides / PPTX presentation deck template link. |

*Note: The website UI automatically displays safe fallback notices and disabled states while these remain placeholders, preventing broken links for participants.*

---

## 2. On-Campus Specifics & Contact Refinements

| Parameter | Location in `lib/event-config.ts` | Current Value | Status |
| :--- | :--- | :--- | :--- |
| **Specific Auditorium / Hall** | `venue.hallOrBuilding` | `"Auditorium & Innovation Complex (To be confirmed at reporting)"` | Update with exact building number/hall once room allocation is finalized. |
| **Event Coordinators** | `contacts.coordinators` | `Lathika M (+91 81220 51205), Sujeet S (+91 63823 56586)` | Confirmed official student coordinators. |
| **Results Publication** | `results.isPublished` | `false` | Set to `true` on 24 October 2026 and populate the `results.winners` array with winning team names, colleges, and idea titles. |

---

## 3. Verified & Confirmed Parameters

- **Grand Finale Date:** 24 October 2026 (Reporting Time: 9:00 AM IST)
- **Registration Window:** 26 September 2026 — 16 October 2026 (11:59 PM IST)
- **Shortlist Notification:** 20 October 2026 (6:00 PM IST)
- **Total Prize Pool:** Attractive Prizes Worth ₹50,000
- **Team Size:** Up to 4 college students per team
- **Shortlist Fee:** ₹500 per shortlisted team (Initial application is ₹0 Free)
- **Venue:** Karpagam College of Engineering, Coimbatore, Tamil Nadu — 641032
- **Organizer Email:** `stratupclubkic@kce.ac.in`
- **Coordinators:** Lathika M (+91 81220 51205), Sujeet S (+91 63823 56586)
