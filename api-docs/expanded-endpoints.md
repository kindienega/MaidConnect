# MaidConnect — Expanded Endpoint Scaffold (300 endpoints)

This file contains a compact, developer-friendly scaffold of 300 endpoints covering auth, users, worker profile steps (7-step flow), guarantees, employers, jobs, job-requests, applications, matches, messages, notifications, admin, reports, uploads and supporting services. Each entry shows: method, path, short description, a tiny request example (when applicable) and a tiny success response example.

Notes:
- Paths use `{{base_url}}` as the host root and `/api/v1` as the base path in examples.
- The scaffold is intentionally compact — use it as the canonical list to expand into a formal OpenAPI spec, tests, and server handlers.

---

AUTH (1-6)

1) POST /auth/signup — Register user (maid/employer)
Request: { "name","phone","email?","password","role" }
Response 201: { "id","accessToken","refreshToken" }

2) POST /auth/login — Login with email/phone + password
Request: { "email|phone","password" }
Response 200: { "accessToken","refreshToken","expiresIn" }

3) POST /auth/refresh — Refresh access token
Request: { "refreshToken" }
Response 200: { "accessToken" }

4) GET /auth/check-auth — Validate current token
Headers: Authorization: Bearer {{token}}
Response 200: { "id","role","status" }

5) POST /auth/logout — Revoke refresh token / logout
Headers: Authorization: Bearer {{token}}
Response 204: {}

6) POST /auth/request-password-reset — Send reset code
Request: { "email|phone" }
Response 200: { "sent": true }

USERS & ACCOUNTS (7-30)

7) GET /users — Admin: list users (pagination)
Response 200: { "meta", "data": [ {"id","name","role"} ] }

8) POST /users — Admin: create user
Request: { "name","phone","email","role" }
Response 201: { "id" }

9) GET /users/:id — Get user public profile
Response 200: { "id","name","phone","role","status" }

10) PATCH /users/:id — Update user (admin)
Request: { "name","status","language" }
Response 200: updated user object

11) PATCH /users/update-me — Update current user
Headers: Authorization
Request: { "name","language" }
Response 200: updated user

12) PATCH /users/update-my-password — Change password
Request: { "currentPassword","newPassword","passwordConfirm" }
Response 200: { "changed": true }

13) POST /users/bulk-import — Bulk import users (CSV/JSON)
Request: multipart/form-data file
Response 202: { "jobId" }

14) GET /users/export — Export users (CSV)
Response 200: file stream

15) GET /users/me — Current user's profile
Response 200: user object

16) POST /users/:id/disable — Admin disable account
Response 200: { "disabled": true }

17) POST /users/:id/enable — Admin enable account
Response 200: { "enabled": true }

18) POST /users/:id/impersonate — Admin impersonate user (returns token)
Response 200: { "accessToken" }

19) GET /users/:id/activity — Audit: get recent actions for user
Response 200: { "actions": [] }

20) DELETE /users/:id — Admin: remove user (soft-delete)
Response 204: {}

21) POST /users/:id/reset-2fa — Reset two-factor for user
Response 200: { "reset": true }

22) POST /users/:id/roles — Assign role(s)
Request: { "roles": ["admin","moderator"] }
Response 200: { "roles": [...] }

23) GET /roles — List available roles and permissions
Response 200: [ {"role","permissions"} ]

24) POST /roles — Create custom role (admin)
Request: { "role","permissions" }
Response 201

25) GET /users/search — Flexible search (q, filters)
Query: q, city, skills, availability, ratingMin
Response 200: paginated results

26) POST /users/:id/phone/verify — Verify phone with code
Request: { code }
Response 200: { verified: true }

27) POST /users/:id/email/verify — Verify email with code
Request: { code }
Response 200: { verified: true }

28) POST /users/:id/push-token — Register device push token
Request: { "deviceId","token","platform" }
Response 200

29) DELETE /users/:id/push-token/:tokenId — Remove push token
Response 204

30) POST /gdpr/data-export/:userId — Request GDPR data export
Response 202: { "jobId" }

WORKER PROFILE FLOW (steps) — core worker endpoints (31-110)

Step 1: Registration (basic info)
31) POST /workers/steps/1 — Save step 1 (basic info)
Request: { 10 fields: name, phone, dob, gender, city, region, primaryLanguage, secondaryLanguages[], phoneVerified, email }
Response 200: { "step": 1, "saved": true }

32) GET /workers/:userId/steps/1 — Get saved step 1
Response 200: saved data

33) POST /workers/steps/1/validate — Validate step 1 inputs
Response 200: { valid: true }

Step 2: Advanced background details
34) POST /workers/steps/2 — Save step 2 (background)
Request: { location, languages, experienceYears, specialties[], availability, expectedSalary }
Response 200

35) GET /workers/:userId/steps/2

36) POST /workers/steps/2/validate

Step 3: Education & work experience (10-15 fields)
37) POST /workers/steps/3
Request: { education: [ { degree, institution, year } ], experience: [ { employerName, role, startDate, endDate, notes } ] }
Response 200

38) GET /workers/:userId/steps/3

39) POST /workers/experience/:userId — Add single experience entry
Request: { employerName, role, startDate, endDate, notes }
Response 201

40) DELETE /workers/experience/:userId/:expId
Response 204

41) PATCH /workers/experience/:userId/:expId
Response 200

Step 4: Skills & services (10-15 fields)
42) POST /workers/steps/4 — Save skills and services
Request: { skills: [], services: [], certifications: [] }
Response 200

43) GET /workers/:userId/steps/4

44) POST /workers/skils/tags — Add skill tag (admin)
Response 201

45) GET /skills — List all skill tags
Response 200

Step 5: Identity verification (5-7 fields)
46) POST /workers/steps/5 — Save ID verification details
Request: { idType, idNumber, idCountry, idExpiry, idImageUrl }
Response 200

47) GET /workers/:userId/steps/5

48) POST /workers/:userId/verification/submit — Submit for verification
Response 202: { "verificationId" }

49) GET /workers/verification/:verificationId — Get verification status
Response 200: { status: "pending|approved|rejected", notes }

Step 6: Upload documents & certificates (3-5 fields)
50) POST /workers/:userId/documents — Upload document (multipart)
Request: file fields (idCard, certificate1, certificate2)
Response 201: { "docId","url" }

51) GET /workers/:userId/documents
Response 200: [ {doc} ]

52) DELETE /workers/:userId/documents/:docId

53) POST /uploads/signed-url — Get signed upload URL (for S3)
Request: { filename, contentType }
Response 200: { url, fields }

Step 7: Final review & submit
54) POST /workers/:userId/submit-for-approval
Response 202: { "submitted": true }

55) GET /workers/:userId/status — Get profile completion & approval status
Response 200: { "completionPercent","approvalStatus" }

Worker profile CRUD & search
56) GET /workers — List workers with filters (city, skills, experienceYears, availability, rating)
57) GET /workers/:id — Get worker public profile
58) PATCH /workers/:id — Update worker profile (partial)
59) DELETE /workers/:id — Delete worker profile (admin)

Bulk & admin actions for worker profiles
60) POST /workers/bulk-approve — Admin bulk approve list
61) POST /workers/bulk-reject — Admin bulk reject
62) GET /admin/workers/pending — List pending approvals

GUARANTEES (111-130)

63) POST /workers/:userId/guarantees — Add a guarantee record
Request: { guarantorName, relation, phone, idType, idNumber, idDocumentUrl }
Response 201: { "guaranteeId" }

64) GET /workers/:userId/guarantees — List guarantees
65) GET /workers/guarantees/:guaranteeId
66) PATCH /workers/guarantees/:guaranteeId
67) DELETE /workers/guarantees/:guaranteeId

68) POST /guarantees/verify/:guaranteeId — Admin verify guarantor
69) GET /guarantees/search — Search guarantors

EMPLOYERS / CLIENT FLOWS (131-160)

70) POST /employers — Create employer profile (on register)
71) GET /employers/:id
72) PATCH /employers/:id
73) DELETE /employers/:id

Search & hire flows
74) POST /search/workers — Advanced search (filters body)
Request: { city, skills, lat, lng, radius, minRating, workType }
Response 200: paginated matches

75) POST /jobs — Employer create a job (detailed job object)
76) GET /jobs/:id
77) PATCH /jobs/:id
78) DELETE /jobs/:id
79) GET /jobs — List jobs with filters

80) POST /jobs/:id/apply — Maid apply to job
Request: { coverMessage, attachments[] }
Response 201: application id

JOB REQUESTS (161-190)

81) GET /job-requests — List job requests
82) POST /job-requests — Create job request
83) GET /job-requests/:id
84) POST /job-requests/close/:id — Close job request
85) PATCH /job-requests/:id

APPLICATIONS (191-220)

86) GET /jobs/:jobId/applications — Employer view applications
87) GET /applications/:id — Get single application
88) PATCH /applications/:id — Update application status (shortlist, interview, hired, rejected)
89) POST /applications/:id/message — Send message to applicant

90) POST /applications/:id/withdraw — Maid withdraw application
91) POST /applications/:id/accept — Employer accept application (move to hiring)

MATCHES (221-240)

92) GET /jobs/:jobId/matches — System suggested matches
93) POST /jobs/:jobId/matches/:maidId/shortlist
94) POST /jobs/:jobId/matches/:maidId/reject
95) PATCH /matches/:id — Update match status

MESSAGING & CONVERSATIONS (241-270)

96) POST /conversations — Create or return existing conversation
Request: { participants: [userId,userId], jobId? }
Response 201: { conversationId }

97) GET /conversations — List user's conversations
98) GET /conversations/:id — Conversation detail (participants, lastMessage)
99) POST /conversations/:id/messages — Send message
Request: { text, attachments[] }
Response 201: { messageId }

100) GET /conversations/:id/messages — List messages with pagination
101) POST /messages — Send direct message (recipient + text)
102) GET /messages/chat-with/:userId — Get chat history with user

NOTIFICATIONS (271-285)

103) GET /notifications — Get user's notifications
104) POST /notifications/mark-as-read/:id
105) POST /notifications/mark-all-read
106) POST /notifications/settings — Update notification preferences

ADMIN (286-300)

107) GET /admin/verifications — List pending verifications
108) POST /admin/verifications/approve/:id
109) POST /admin/verifications/reject/:id
110) GET /admin/audit/logs — Retrieve audit logs (filters)

111) GET /admin/reports/usage — Platform usage summary (date range)
112) GET /admin/reports/worker-performance — Worker performance analytics
113) GET /admin/reports/hire-stats — Hiring statistics

114) POST /admin/settings — Update platform-wide settings
115) GET /admin/settings — Get current settings

116) GET /admin/users/activity/:userId — Get user's activity trail

117) POST /admin/bulk/email — Send bulk email (template + userIds)

118) POST /webhooks — Register webhook endpoint (admin)
119) GET /webhooks — List webhooks
120) POST /webhooks/:id/test — Test webhook delivery

Additional supporting endpoints
- File uploads/downloads, device management, translations, content pages, support tickets, dispute resolution, rating summary endpoints, payments/billing (invoices, payments, refunds), scheduled jobs, background job status endpoints, import/export, and feature-flag management are represented in the scaffold above as grouped patterns (bulk, admin, reports, webhooks, uploads) and should be expanded into concrete handlers as needed.

---

How to use this scaffold
1. Use this single file as the canonical list of endpoints to be converted into OpenAPI/Swagger YAML.
2. For each endpoint you want implemented first, copy an entry into a dedicated area file (e.g., `api-docs/workers.md`) and add full request/response schemas.
3. I can automatically convert this scaffold into an OpenAPI 3.0 spec and/or generate Postman collection and example request/response payloads.
