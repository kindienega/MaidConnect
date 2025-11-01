<!--
  full-api.md
  Consolidated API reference for MaidConnect (derived from Postman collection, expanded scaffold, and documents.conf)
  Contains: HTTP method, path, description, example JSON request (when applicable), and example JSON success response.
  Use this file as the single-document reference before converting to OpenAPI or generating server code.
-->

# MaidConnect — Full API Reference (consolidated)

Base URL
- All example paths assume `{{base_url}}` as the root and `/api/v1` as the API prefix.

Authentication
- Use `Authorization: Bearer <accessToken>` for protected endpoints.
- Content-Type: `application/json` for JSON requests. File uploads use `multipart/form-data`.

Error response format (all errors)

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { "field": "reason" }
  }
}
```

Pagination meta

```json
"meta": { "total": 123, "page": 1, "perPage": 20 }
```

---

SECTION A — AUTH

1) POST /auth/signup
Description: Register a new user (maid or employer).
Request example:

```json
{
  "name": "Meskerem",
  "email": "meskerem@example.com",
  "phone": "+251912345678",
  "password": "StrongPass123!",
  "role": "maid"
}
```

Success response (201):

```json
{
  "id": "64f3b2...",
  "accessToken": "eyJhbGci...",
  "refreshToken": "..."
}
```

2) POST /auth/login
Request example:

```json
{ "email": "meskerem@example.com", "password": "StrongPass123!" }
```

Success response (200):

```json
{ "accessToken": "eyJ...", "refreshToken": "...", "expiresIn": 3600 }
```

3) POST /auth/refresh
Request: { "refreshToken": "..." }
Response: { "accessToken": "..." }

4) GET /auth/check-auth
Headers: Authorization
Response (200):

```json
{ "id": "64f3b2...", "role": "maid", "status": "active" }
```

5) POST /auth/logout
Headers: Authorization
Response: 204 No Content

6) POST /auth/request-password-reset
Request: { "email|phone": "..." }
Response: { "sent": true }

---

SECTION B — USERS & ACCOUNTS

7) GET /users
Description: Admin list users (supports pagination & filters).
Response (200):

```json
{
  "meta": { "total": 100, "page": 1, "perPage": 20 },
  "data": [ { "id": "...", "name": "...", "role": "maid" } ]
}
```

8) POST /users
Admin create user.
Request:

```json
{ "name": "Admin2", "phone": "+2519...", "email": "admin2@example.com", "role": "admin" }
```

Response (201): { "id": "..." }

9) GET /users/:id
Response:

```json
{ "id": "...", "name": "Aisha", "phone": "+2519..", "role": "maid", "status": "active" }
```

10) PATCH /users/:id
Request (partial update): { "name": "New Name", "language": "am" }
Response: updated user object

11) PATCH /users/update-me
Headers: Authorization
Request: { "name": "Updated" }
Response: updated user

12) PATCH /users/update-my-password
Request:

```json
{ "currentPassword": "old", "newPassword": "new", "passwordConfirm": "new" }
```

Response: { "changed": true }

13) POST /users/bulk-import
Request: multipart CSV/JSON file (server responds with job id)
Response: { "jobId": "job-123" }

14) GET /users/export
Response: CSV file stream (200)

15) GET /users/me
Headers: Authorization
Response: user object (public fields)

16) POST /users/:id/disable
Response: { "disabled": true }

17) POST /users/:id/enable
Response: { "enabled": true }

18) POST /users/:id/impersonate
Admin action — returns token for impersonation
Response: { "accessToken": "..." }

19) GET /users/:id/activity
Response: { "actions": [ { "action": "login", "at": "..." } ] }

20) DELETE /users/:id
Response: 204 No Content

21) POST /users/:id/reset-2fa
Response: { "reset": true }

22) POST /users/:id/roles
Request: { "roles": ["admin"] }
Response: { "roles": ["admin"] }

23) GET /roles
Response: [ { "role": "admin", "permissions": ["users:read"] } ]

24) POST /roles
Create custom role
Request: { "role": "manager", "permissions": ["jobs:manage"] }
Response: 201

25) GET /users/search?q=...
Search users with query and filters, returns paginated results.

26) POST /users/:id/phone/verify
Request: { "code": "1234" }
Response: { "verified": true }

27) POST /users/:id/email/verify
Request: { "code": "abcd" }
Response: { "verified": true }

28) POST /users/:id/push-token
Request: { "deviceId": "dev-1", "token": "push-token", "platform": "android" }
Response: { "registered": true }

29) DELETE /users/:id/push-token/:tokenId
Response: 204

30) POST /gdpr/data-export/:userId
Response: { "jobId": "export-123" }

---

SECTION C — WORKER PROFILE FLOW (7 steps + CRUD)

Step 1 — Basic info
31) POST /workers/steps/1
Request example (10 fields):

```json
{
  "name":"Aisha",
  "phone":"+2519xxxx",
  "dob":"1995-05-10",
  "gender":"female",
  "city":"Addis Ababa",
  "region":"Bole",
  "primaryLanguage":"am",
  "secondaryLanguages":["en"],
  "phoneVerified": true,
  "email": "aisha@example.com"
}
```

Response: { "step": 1, "saved": true }

32) GET /workers/:userId/steps/1 — returns saved step1 data

33) POST /workers/steps/1/validate — returns { valid: true }

Step 2 — Background details
34) POST /workers/steps/2
Request example:

```json
{ "location": {"city":"Addis"}, "languages":["am","en"], "experienceYears":4, "specialties":["childcare"], "availability":"available", "expectedSalary": {"min":4000,"max":6000,"currency":"ETB"} }
```

35) GET /workers/:userId/steps/2
36) POST /workers/steps/2/validate

Step 3 — Education & experience
37) POST /workers/steps/3
Request:

```json
{ "education": [{"degree":"HS","institution":"School","year":2010}], "experience": [{"employerName":"Household1","role":"helper","startDate":"2018-01-01","endDate":"2020-01-01","notes":"good"}] }
```

38) GET /workers/:userId/steps/3
39) POST /workers/experience/:userId — Add experience
Request: { "employerName":"X","role":"helper","startDate":"...","endDate":"...","notes":"..." }
Response: 201 { "expId": "..." }

40) DELETE /workers/experience/:userId/:expId — 204
41) PATCH /workers/experience/:userId/:expId — 200 updated

Step 4 — Skills & services
42) POST /workers/steps/4
Request: { "skills": ["cleaning","cooking"], "services": ["childcare"], "certifications": ["first-aid"] }
Response: 200

43) GET /workers/:userId/steps/4
44) POST /workers/skils/tags (admin) — 201
45) GET /skills — 200 ["cleaning","cooking"]

Step 5 — ID verification
46) POST /workers/steps/5
Request: { "idType":"national","idNumber":"AA123","idCountry":"ET","idExpiry":"2030-01-01","idImageUrl":"https://..." }
Response: 200

47) GET /workers/:userId/steps/5
48) POST /workers/:userId/verification/submit — 202 { "verificationId": "ver-1" }
49) GET /workers/verification/:verificationId — { "status":"pending" }

Step 6 — Documents uploads
50) POST /workers/:userId/documents
Request: multipart file fields (idCard, cert1)
Response (201): { "docId": "d-1", "url": "https://..." }

51) GET /workers/:userId/documents — returns list of docs
52) DELETE /workers/:userId/documents/:docId — 204
53) POST /uploads/signed-url
Request: { "filename":"id.jpg","contentType":"image/jpeg" }
Response: { "url":"https://s3...","fields":{} }

Step 7 — Final review & submit
54) POST /workers/:userId/submit-for-approval
Response: { "submitted": true }

55) GET /workers/:userId/status
Response: { "completionPercent": 95, "approvalStatus": "pending" }

Worker CRUD & search
56) GET /workers?city=&skills=&page=&perPage= — list workers (paginated)
Example response: { "meta":{}, "data":[ { "id":"...","name":"A" } ] }

57) GET /workers/:id — full public profile
Response example (200):

```json
{
  "id":"6892d8...",
  "userId":"64f3b2...",
  "name":"Aisha",
  "bio":"...",
  "location":{"city":"Addis Ababa"},
  "skills":["cooking","cleaning"],
  "experienceYears":3,
  "ratingAvg":4.5
}
```

58) PATCH /workers/:id — update partial profile
59) DELETE /workers/:id — admin delete (204)

Bulk/admin
60) POST /workers/bulk-approve — Request body: { ids: ["..." ] } — Response: { accepted: n }
61) POST /workers/bulk-reject — { ids: [...], reason: "..." }
62) GET /admin/workers/pending — list pending approvals

---

SECTION D — GUARANTEES

63) POST /workers/:userId/guarantees
Request:

```json
{ "guarantorName":"Wolde","relation":"neighbor","phone":"+2519..","idType":"national","idNumber":"G123","idDocumentUrl":"https://..." }
```

Response (201): { "guaranteeId": "g-1" }

64) GET /workers/:userId/guarantees — list guarantees
65) GET /workers/guarantees/:guaranteeId — get guarantee
66) PATCH /workers/guarantees/:guaranteeId — update
67) DELETE /workers/guarantees/:guaranteeId — 204

68) POST /guarantees/verify/:guaranteeId — admin verify — 200
69) GET /guarantees/search?q=... — returns results

---

SECTION E — EMPLOYERS & SEARCH / HIRE

70) POST /employers
Request:

```json
{ "name":"Selam","phone":"+2519...","email":"selam@example.com","location":{"city":"Bole"} }
```

Response: 201 { "id":"emp-1" }

71) GET /employers/:id — employer profile
72) PATCH /employers/:id — update
73) DELETE /employers/:id — 204

Search & hire
74) POST /search/workers
Request (advanced filters):

```json
{ "city":"Addis Ababa","skills":["cleaning"],"lat":9.0,"lng":39.0,"radius":5000,"minRating":4.0,"workType":"live_in","page":1,"perPage":20 }
```

Response: paginated results with scores

Jobs
75) POST /jobs
Request example:

```json
{
  "title":"Live-in helper",
  "description":"...",
  "location":{"city":"Addis Ababa","coords":[39.0,9.0]},
  "requiredSkills":["cleaning","cooking"],
  "workType":"live_in",
  "salary":{"amount":3500,"currency":"ETB"}
}
```

Response (201): created job object

76) GET /jobs/:id
77) PATCH /jobs/:id
78) DELETE /jobs/:id
79) GET /jobs — list/search jobs

80) POST /jobs/:id/apply
Headers: Authorization (maid)
Request: { "coverMessage":"I am available","attachments":[] }
Response (201): { "applicationId":"app-1" }

---

SECTION F — JOB REQUESTS

81) GET /job-requests — list
82) POST /job-requests
Request example:

```json
{ "title":"Full-time Nanny","description":"..","minSalary":5000,"maxSalary":7000,"location":"Bole","workType":"live_in","duration":"permanent" }
```

Response (201): { "id": "jr-1" }

83) GET /job-requests/:id
84) POST /job-requests/close/:id — close
85) PATCH /job-requests/:id — update

---

SECTION G — APPLICATIONS

86) GET /jobs/:jobId/applications — employer views applications
Response: paginated application objects

87) GET /applications/:id
Response example:

```json
{ "id":"app-1","jobId":"job-1","maidId":"m-1","status":"applied","coverMessage":"...","appliedAt":"..." }
```

88) PATCH /applications/:id
Request: { "status":"shortlisted" }
Response: updated application

89) POST /applications/:id/message
Request: { "text":"Please attend interview" }
Response: 201 message

90) POST /applications/:id/withdraw — maid withdraws
91) POST /applications/:id/accept — employer accepts (moves to hiring)

---

SECTION H — MATCHES

92) GET /jobs/:jobId/matches
Response: [ { "maidId":"m-1","score":87,"reason":"skills match" } ]

93) POST /jobs/:jobId/matches/:maidId/shortlist — 200
94) POST /jobs/:jobId/matches/:maidId/reject — 200
95) PATCH /matches/:id — update match status

---

SECTION I — MESSAGING & CONVERSATIONS

96) POST /conversations
Request: { "participants": ["userA","userB"], "jobId": "job-1" }
Response: { "conversationId":"c-1" }

97) GET /conversations — list
98) GET /conversations/:id
99) POST /conversations/:id/messages
Request: { "text":"Hello","attachments":[] }
Response: { "messageId":"m-1" }

100) GET /conversations/:id/messages?page=1&perPage=50
Response: paginated messages

101) POST /messages — send direct
Request: { "recipient":"userId","text":"Hi" }
Response: { "messageId":"m-2" }

102) GET /messages/chat-with/:userId — chat history

---

SECTION J — NOTIFICATIONS

103) GET /notifications
Response: [ { "id":"n-1","type":"match","read":false,"data":{...} } ]

104) POST /notifications/mark-as-read/:id — returns { "marked": true }
105) POST /notifications/mark-all-read — { "markedAll": true }
106) POST /notifications/settings
Request: { "email": false, "push": true }
Response: saved settings

---

SECTION K — ADMIN & PLATFORM

107) GET /admin/verifications — list pending verifications
108) POST /admin/verifications/approve/:id — approve
109) POST /admin/verifications/reject/:id — reject (body: { reason })

110) GET /admin/audit/logs?start=&end=&userId= — returns audit entries

111) GET /admin/reports/usage?from=&to= — platform usage summary
112) GET /admin/reports/worker-performance?from=&to= — analytics
113) GET /admin/reports/hire-stats?from=&to= — stats

114) POST /admin/settings — update platform settings
115) GET /admin/settings — get current

116) GET /admin/users/activity/:userId — get activity trail

117) POST /admin/bulk/email — Request: { "templateId": "t-1", "userIds": ["u1","u2"] }

118) POST /webhooks — register webhook
Request: { "url":"https://hooks.example.com/maidconnect","events":["application.created"] }
Response: { "webhookId":"w-1" }

119) GET /webhooks — list webhooks
120) POST /webhooks/:id/test — test delivery

---

ADDITIONAL SUPPORTING ENDPOINT PATTERNS (payments, content, translations, tickets, uploads)

- Payments: `/payments/checkout`, `/payments/webhook`, `/invoices/:id`, `/payments/refund/:id`.
- Content pages: `/content/pages`, `/content/pages/:slug`.
- Support tickets: `/tickets`, `/tickets/:id`, `/tickets/:id/messages`.
- Feature flags: `/features`, `/features/:key`.
- Background jobs: `/jobs/:jobId/status`.

---

How to use this file
1. Pick the area(s) you want to implement first (e.g., auth + workers + jobs). Copy relevant endpoints into per-area docs (e.g., `api-docs/workers.md`) and add full JSON Schemas.
2. I can convert this into OpenAPI 3.0 (YAML) and produce a Postman collection and TypeScript client.
3. When you approve, I'll generate the OpenAPI spec and an Express route-stub template for the first 20 endpoints.

---

Changelog
- 2025-11-01: Consolidated endpoints and added request/response examples derived from expanded scaffold and collection.
