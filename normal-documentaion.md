<our business name> – A Trusted Platform for Training, Certifying, and Matching Houseworkers
<our business name> is a digital platform designed to professionalize the domestic labor market by providing structured training, certification, and matching services for houseworkers. It also introduces a guarantee system that gives employers confidence in hiring vetted, skilled, and reliable workers.
The platform bridges the gap between households seeking trusted houseworkers and individuals seeking fair employment and skills development. It provides training, assessment, certification, digital profiles, and a smart matching engine supported by guarantees and digital contracts.

Objectives
The project aims to build a system that:
Delivers training and certification programs for domestic workers.


Matches certified workers with households and employers.


Provides employer guarantees, including replacement and performance assurance.


Supports digital contracts, payments, and transparent reviews.


Encourages professional growth for workers through upskilling and performance tracking.


Core Platform Components
The platform will include a training and certification module, where houseworkers can learn new skills through online and offline sessions and receive certificates upon assessment.
 Each worker will have a digital profile containing verified information, background checks, skill certifications, experience, and ratings.
An intelligent matching engine will connect employers and workers based on criteria such as skills, location, salary expectations, and availability. A guarantee and support system will ensure employer satisfaction, offering trial periods, replacements, or insurance coverage if needed.
The system will also provide a digital contract and payment management feature, allowing secure escrow payments and automated release upon job completion. Employers and workers can leave mutual ratings and feedback to build trust and quality over time.

Functional Modules
1.1 User Management Module
1.1.1 Overview
The User Management Module governs registration, authentication, authorization, and lifecycle management for all platform participants — employers, housemaids, and administrators.
1.1.2 Functional Scope
User registration (with mobile verification or email confirmation)


Authentication (secure login with encrypted password handling)


Role-based access control (employer, maid, admin)


Profile setup and editing


Account verification and document management


Password recovery and account suspension


Audit tracking for user actions (admin use)


1.1.3 Business Rules
Each phone number and email address must be unique.


A user can only hold one role per account (maid or employer).


Profile visibility is restricted until mandatory data fields are completed.


Administrators must manually verify identification documents (for MVP phase).


Unverified users have limited visibility and cannot initiate job-related actions.


1.1.4 User Validation
Email and phone verification via OTP or link confirmation.


Passwords must meet security standards (minimum 8 characters, upper/lowercase, number, symbol).


ID document images must be clear and verifiable before approval.


1.2 Housemaid Profile Module
1.2.1 Overview
The Housemaid Profile Module establishes structured, detailed representations of domestic workers’ qualifications, availability, and preferences, enabling fair and transparent evaluation by employers.
1.2.2 Functional Scope
Profile creation and editing with guided step-by-step forms.


Data capture for demographics, skills, work history, and preferences.


Availability toggling (available, on-job, unavailable).


ID verification workflow integration.


Skill categorization and tagging (cleaning, cooking, childcare, elder care, laundry, gardening, etc.).


Upload and management of documents such as ID cards, certificates, or references.


Experience visualization through previous employment summaries.


Public profile visibility with limited details until contact initiation.


Integration with review and rating subsystems.



1.2.3 Data Validation
Date of birth must indicate an age above legal working age (e.g., 18 years).


Expected salary must be within the reasonable market range defined per region.


Uploaded images and IDs undergo human moderation before approval.


1.3 Employer Profile Module
1.3.1 Overview
Employers maintain structured profiles outlining their household context and employment needs, forming the foundation for job postings and trust establishment.
1.3.2 Functional Scope
Employer account creation and authentication.


Profile fields for household details, preferred work type, and location.


Employer verification mandatory in MVP.


Job management dashboard for posting, editing, or closing listings.


Visibility of ratings and feedback from previously hired workers.


1.3.3 Business Logic
Employers can manage multiple job postings under one account.


Employers must maintain an active profile before posting jobs.


Employers who receive multiple complaints may be suspended.


Verified employers gain higher ranking in maid search visibility.


1.4 Job Posting Module
1.4.1 Overview
This module manages the creation, publication, and lifecycle of job listings submitted by employers.
1.4.2 Functional Scope
Job creation with structured fields (title, description, skills required, salary, duration, work type, and city).


Ability to edit, pause, or close job listings.


Job visibility duration (default 30 days, renewable).


Employer dashboard to monitor applicant statistics and shortlists.


1.4.3 Business Logic
Each job must specify at least one skill requirement and one location.


Job listings cannot be published without active employer verification.


Closed or expired jobs are automatically hidden from search results.


Employers may reopen archived listings with updated information.


System triggers matching engine immediately after job posting.


1.4.4 Operational Constraints
Maximum of 10 active listings per employer account for MVP phase.


All salary and offer fields must specify currency and be validated within defined range thresholds.



1.6 Application Management Module
1.6.1 Overview
This module manages the workflow of job applications submitted by housemaids and reviewed by employers.
1.6.2 Functional Scope
Application submission by maids for open job listings.


Application dashboard for employers to view, shortlist, reject, or hire.


Application status tracking with timestamps for every stage.


Notifications for both parties upon each status change.


Integration with chat system once an application is shortlisted.


1.6.3 Application Lifecycle
Applied: Maid expresses interest in the job.


Shortlisted: Employer marks a maid as a potential fit.


Interview Scheduled (optional): Employer requests interview date/time.


Hired: Both parties confirm employment.


Completed: Employment engagement marked as done.


# <our business name> — User-facing Documentation and Flows

Last updated: 2025-11-01

This document describes the user-facing flows and responsibilities for the MaidConnect platform: workers (maids), employers (clients), and administrators. It is intended for product managers, frontend and backend engineers, and QA teams preparing to implement features and APIs.

## 1. High-level overview

MaidConnect connects verified, trained houseworkers with employers looking to hire for short- and long-term household work. Core capabilities:

- Training and certification for workers.
- Multi-step worker profile creation and admin verification.
- Job posting, matching, and application lifecycle for employers and workers.
- Guarantee/guarantor system for additional employer protection.
- Secure messaging, notifications, and audit logs for moderation.

Key actors
- Worker (maid): creates a profile, uploads documents, applies to jobs, communicates with employers.
- Employer (client): searches, shortlists, interviews, hires, and rates workers.
- Admin: verifies documents, approves profiles, moderates content, and manages platform settings.

## 2. Principles and rules

- Unique identity: phone (and optionally email) are unique per account.
- Role separation: accounts are either worker or employer (admins are assigned separately).
- Safety first: uploaded ID documents and certificates are human-moderated before full visibility.
- Minimal PII in the core auth record; documents are stored in controlled storage and accessed via signed URLs.

## 3. Worker (maid) onboarding — 7 step guided flow

The worker onboarding is deliberately stepwise to improve completion and verification rates. The front-end should persist partial progress to allow resumption.

Step 1 — Basic registration (required)
- Fields (example): name, phone, email (optional), date of birth, gender, city, region, primary language, secondary languages, emergency contact.
- Validation: phone OTP, age >= legal working age.
- Outcome: account is created; worker status = `pending_profile`.

Step 2 — Background details
- Fields: location details, availability, expected salary range (min/max + currency), specialties, years of experience.
- Outcome: saved to worker profile (partial completion percentage updated).

Step 3 — Education & employment history
- Fields: education entries (degree, institution, year), work history entries (employer, role, start/end, notes). Support add/edit/delete for entries.

Step 4 — Skills & services
- Fields: skill tags (cleaning, cooking, childcare, elderly care, laundry, gardening, pet care), service descriptions, certification list.

Step 5 — Identity verification details
- Fields: idType, idNumber, issuingCountry, idExpiry, idImage(s) URL(s).
- Outcome: verification record created; admin review required.

Step 6 — Document uploads
- Uploads: ID front/back, certificates, references (images or PDFs). Prefer signed uploads (S3) for large files.
- Outcome: documents stored in secure storage; doc metadata stored in profile.

Step 7 — Final review & submit
- Worker reviews profile summary and submits for admin approval.
- Outcome: profile moves to `under_review` and later `active` or `rejected` based on admin action.

UX notes
- Show a progress bar (e.g., 7 steps) and allow resuming partially completed steps.
- Keep validation errors inline, and provide clear guidance for image quality for ID documents.

## 4. Employer onboarding and hiring flow

Employer registration
- Fields: name, phone, email, location, household size, preferred work types.
- Validation: phone OTP and optional employer verification for higher visibility.

Creating a job post
- Fields: title, description, required skills, work type (live_in/live_out), salary (amount + currency), start date, duration, visibility (public/private), location (city + coords optional).
- Business rules: employer must be verified to publish job.

Search & shortlist
- Employers use filters: city, skills, availability, rating, expected salary range.
- System provides ranked suggestions (matching score + reason). Employer can shortlist or invite to interview.

Interview & messaging
- When shortlisted, a secure chat is enabled. Contact details remain masked until both consent.

Hiring & guarantees
- Employer confirms a hire in-app. Optionally attach a guarantee requirement: the worker provides a guarantor (legal person) record.
- Platform records the contract and, if used, handles escrow/payment flows.

Post-hire
- Employer and worker can leave ratings/reviews after engagement. Ratings affect worker visibility and matching score.

## 5. Guarantees (guarantor) workflow

Purpose
- Reduce employer risk by adding a third-party guarantor who accepts limited liability for damages or breaches.

Guarantor capture
- Worker submits guarantor: name, relation, phone, idType, idNumber, idDocumentUrl, signed agreement (if required).

Verification
- Admin may validate guarantor identity and contact details. Guarantor status stored on worker profile.

Use during hiring
- Employer can require a verified guarantor as condition of hire. The hiring flow shows guarantor status and documents.

## 6. Application lifecycle and limits

Statuses
- applied, shortlisted, interviewing, hired, completed, rejected, withdrawn.

Rules
- Worker can have up to N active job applications (e.g., 5) to reduce spamming.
- Employers should act within a configured SLA (e.g., 14 days) or applications auto-expire.

Integration
- Application transitions trigger notifications and enable the chat module for shortlisted applicants.

## 7. Messaging & privacy

When messaging is allowed
- Only between users who have been matched or where the worker is shortlisted for a job.

Privacy controls
- Contact details masked until mutual consent.
- Users can block or report conversations; flagged records appear in admin moderation queues.

Retention and moderation
- Conversations are retained for a configurable period (default 90 days). Admins can view flagged content for compliance and audit purposes.

## 8. Admin responsibilities & workflows

Core responsibilities
- Verify ID documents and worker profiles.
- Manage suspended users and resolve disputes.
- Monitor audits and generate reports.

Verification flow
- Admin sees `under_review` items with the submitted docs and a checklist (ID check, certificates, references). Approve or reject with notes.

Audit logging
- All admin actions are logged (who performed action, timestamp, reason) for traceability.

Reporting
- Dashboards for pending verifications, hires, active listings, and complaints. Exportable CSV/JSON reports for BI.

## 9. Payments, contracts, and escrows (high level)

- The platform supports holding employer payments in escrow until job completion if enabled.
- Digital contract templates are attached to hires; both parties accept terms in-app.
- Integrate payment provider (Stripe/PayPal/local gateways) and webhook handlers to update payment status.

## 10. Security, privacy, and compliance

- Minimal PII in `users` collection; store documents in protected storage with signed URLs.
- Password policies, rate-limited OTP flows, and JWT-based auth for APIs.
- Role-based access control: endpoints gated by role.
- Admin audit trails; data export capabilities for compliance (e.g., GDPR-like requests).

## 11. API / Frontend implementation notes

- Use the canonical API doc at `api-docs/full-api.md` for endpoint shapes, request and response examples.
- Frontend should implement step-resume for worker onboarding using local caching + server-side draft endpoints.
- Use S3 signed uploads for documents and avoid direct binary transfers through the API server where possible.

## 12. Common user journeys (concise step lists)

Housemaid (quick): Register → Complete profile steps 1–7 → Submit for review → Wait for admin approval → Browse jobs → Apply → Chat if shortlisted → Accept hire → Complete job → Leave review.

Employer (quick): Register → Verify profile → Create job → Review matches → Shortlist → Interview via chat → Confirm hire → Release payment → Leave review.

Admin (quick): Login → Review verifications → Approve/reject profiles/docs → Monitor flagged content → Generate reports.

## 13. Acceptance criteria (MVP)

- Workers can complete all 7 onboarding steps and be approved by admin.
- Employers can post jobs, search, shortlist, and hire.
- Messaging is available for shortlisted matches with basic moderation.
- Admin can approve/reject verifications and view audit logs.

## 14. Next steps (recommended)

1. Convert `api-docs/full-api.md` into OpenAPI 3.0 YAML and generate server stubs for the first 20 endpoints.
2. Add UI mockups for the 7-step worker onboarding and the employer job-post flow.
3. Implement contract tests for auth, worker creation, and job posting endpoints.

---

If you'd like, I can now convert this into a prettier HTML or add example UI wireframes for each step. Also happy to generate the OpenAPI YAML and route stubs next.






