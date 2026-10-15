# TenderLink Ethiopia

**Ethiopian Furniture Workshop Consortium & Institutional Tender Platform**

TenderLink Ethiopia connects small and medium-sized furniture workshops in Addis Ababa (focusing initially on the **Masalemiya Woodcraft Cluster, Kality Joinery, and Merkato Craftsmen**) with large institutional procurement opportunities. It enables workshops to transparently pool manufacturing capacity, satisfy public bonding thresholds, form joint consortia, and execute high-volume contracts.

---

## 1. System Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Plus Jakarta Sans typography.
- **Backend & Database**: Firebase Authentication (Google Auth + Demo Persona switching), Cloud Firestore (with `firebase-applet-config.json` configuration and database ID: `ai-studio-tenderlinkethiop-2bd67c3b-edb5-4a4b-beb4-180ef3a65da5`).
- **Security & Authorization**: Hardened `firestore.rules` enforcing Role-Based Access Control (RBAC), immutable timestamps, role-tampering guards, and client error handling conforming to `FirestoreErrorInfo`.
- **Explainable Matching Engine**: Deterministic rules engine (`src/services/matchingEngine.ts`) calculating capability fit, geographic logistics, capacity contribution (e.g. decomposing 100 units into 40 + 35 + 25), and premium priority allocation.

---

## 2. Four User Roles & Demonstration Walkthrough

Use the **Role Switcher** in the top navigation bar to test all four user experiences instantly:

### A. Visitor / Free User
1. Browse public tenders (e.g. Ministry of Education 600 desks, Commercial Bank of Ethiopia teller counters).
2. Search verified historical awards with gazette citations (e.g. 6.24M ETB to Masalemiya-Gofa Joint Venture).
3. View procurement deadline calendar (agenda and month views).
4. Register a workshop profile via the 3-step registration wizard.

### B. Basic Workshop Member (`Masalemiya Woodcraft Cluster`)
1. View declared monthly capacity (180 units/mo), active machinery, and worker count (16 craftsmen).
2. Browse tender opportunities with calculated **Explainable Match Scores** and rationale.
3. Express Interest (EOI) in eligible small-to-medium contracts.
4. Review pending consortium invitations, examine proposed quantity/payment share in ETB, and submit explicit affirmative consent.
5. Track assigned production parcels and joint task lists.

### C. Premium Workshop Member (`Kality Precision Joinery`)
1. Priority queue ranking for eligible tenders.
2. First right of refusal on high-capacity contract segments.
3. Transparent explanation of match breakdown.
4. Lead organizer privileges to create and coordinate new consortia.

### D. Platform Administrator (`Samuel Nugusu - samuelnugusu7@gmail.com`)
1. **Platform Overview**: Monitor registered workshops, active listings, and pooled capacity.
2. **Workshop Verification**: Review pending profiles, verify audited machinery, approve or suspend accounts.
3. **Tender Management**: Create new official tenders, set deadlines, toggle joint bidding authorization, or close tenders.
4. **Historical Awards**: Record gazetted winning bids with official citations.
5. **Subscription & Payment Auditing**: Audit reported Telebirr and CBE Birr transaction references and grant tier upgrades.
6. **Audit Trail & CSV Export**: Immutable ledger of all system actions with 1-click operational CSV download.

---

## 3. Database Collections (`firestore.rules`)

| Collection | Access Control |
|---|---|
| `users/{userId}` | Read/write by owner or administrator. Role mutations restricted to admin. |
| `workshops/{workshopId}` | Public read; owner update; verification status strictly managed by admin. |
| `tenders/{tenderId}` | Public read; write restricted to platform administrator. |
| `tenderAwards/{awardId}` | Public read; write restricted to platform administrator. |
| `calendarEvents/{eventId}` | Public read; write restricted to admin or authenticated members. |
| `consortiums/{consortiumId}` | Authenticated read/create/update. |
| `consortiumMembers/{memberId}` | Authenticated read/create/update; deletion by admin or user. |
| `contractSegments/{segmentId}` | Authenticated read/write for consortium members. |
| `tasks/{taskId}` | Authenticated read/write for consortium members. |
| `subscriptionPlans/{planId}` | Public read; write restricted to administrator. |
| `paymentRecords/{paymentId}` | Read by owner or admin; verified strictly by admin. |
| `auditLogs/{logId}` | Read by administrator; create by system/authenticated users; immutable. |

---

## 4. Automated Test Suite

Run the automated test suite verifying capacity decomposition, matching rules, and permission boundaries:

```bash
npm test
```

### Verified Tests:
1. `Workshop A is marked eligible`
2. `Workshop A score reflects specialty and capacity fit`
3. `Rejected workshop is marked ineligible`
4. `Consortium fully covers 100 required units`
5. `Total committed capacity is exactly 100 units (got: 100)`
6. `Proposal combines all 3 eligible workshops (40 + 35 + 25 units)`
7. `Ordinary user CANNOT self-approve workshop verification status`
8. `Privilege escalation blocked: user CANNOT self-assign admin role`

---

## 5. Regulatory & Legal Disclosure

- **Contract Awards**: TenderLink Ethiopia facilitates consortium formation and does not guarantee tender award outcomes.
- **Bank Guarantees (CPO)**: Bid bonds and performance guarantees remain between the issuing commercial bank and registered enterprise.
- **Contract Payments**: All payment tracking reflects declared and verified milestone statements. Regulated financial disbursements must follow Ethiopian tax and banking requirements.
