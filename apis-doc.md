<!--
  apis-doc.md
  Human-readable API documentation generated from MaidConnect Postman collection
  Source: MaidConnect_API_Collection.json
-->

# MaidConnect API — Reference (derived from Postman collection)

Base URL
- Use the Postman environment variable `{{base_url}}`, e.g. `https://api.maidconnect.com/api/v1`.

Auth
- Protected endpoints require an `Authorization: Bearer {{token}}` header.
- Content-Type for JSON requests: `application/json`.

How this document is organised
- Grouped by collection folders from the Postman export: Auth, Users, Workers, Job Requests, Messages, Notifications, Admin.
- For each endpoint: HTTP method, path (with `{{base_url}}`), required headers, example request body (when present), and a short description.

---

## 1) Auth

### Signup
- Method: POST
- Path: `{{base_url}}/auth/signup`
- Headers: `Content-Type: application/json`
- Description: Create a new user account (maid or employer).
- Example body:

```json
{
  "name": "Meskerem",
  "email": "meskerem@example.com",
  "phone": "+251912345678",
  "password": "StrongPass123!",
  "role": "maid"
}
```

### Login
- Method: POST
- Path: `{{base_url}}/auth/login`
- Headers: `Content-Type: application/json`
- Description: Authenticate and retrieve JWT access (and possibly refresh) tokens.
- Example body:

```json
{
  "email": "meskerem@example.com",
  "password": "StrongPass123!"
}
```

### Check Auth
- Method: GET
- Path: `{{base_url}}/auth/check-auth`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Verify that the provided JWT is valid and the session is active.

---

## 2) Users

### Get All Users (Admin)
- Method: GET
- Path: `{{base_url}}/users`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Admin endpoint to list all users.

### Update My Profile
- Method: PATCH
- Path: `{{base_url}}/users/update-me`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Update current user's profile fields.
- Example body:

```json
{ "name": "Updated Name" }
```

### Update Password
- Method: PATCH
- Path: `{{base_url}}/users/update-my-password`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Change the logged-in user's password (requires current password).
- Example body:

```json
{
  "currentPassword": "StrongPass123!",
  "newPassword": "NewStrongPass123!",
  "passwordConfirm": "NewStrongPass123!"
}
```

---

## 3) Workers (maids)

### List Workers
- Method: GET
- Path: `{{base_url}}/workers`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Public listing of available maids. Supports query params in implementation (e.g., `city`, `skills`, pagination).

### Get Worker
- Method: GET
- Path: `{{base_url}}/workers/:id` (example uses `6892d8fdad802c5d964357b4`)
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Retrieve detailed maid profile.

### Create Worker Profile
- Method: POST
- Path: `{{base_url}}/workers`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Create a worker profile (should be performed by users with `maid` role).
- Example body:

```json
{
  "name": "Meskerem",
  "bio": "4 years of cleaning and childcare experience",
  "location": { "city": "Addis Ababa" },
  "skills": ["cleaning","cooking"],
  "experienceYears": 4,
  "preferredWorkType": "live_in",
  "expectedSalary": { "min": 4000, "max": 6000, "currency": "ETB" }
}
```

### Update Worker Profile
- Method: PATCH
- Path: `{{base_url}}/workers/:id`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Update a maid's profile fields.
- Example body: `{ "bio": "Updated bio text" }`

### Approve Worker (Admin)
- Method: POST
- Path: `{{base_url}}/workers/approve/:id`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Admin action to mark a worker as verified/approved.

---

## 4) Job Requests

### List Job Requests
- Method: GET
- Path: `{{base_url}}/job-requests`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Public/admin listing of job requests.

### Create Job Request
- Method: POST
- Path: `{{base_url}}/job-requests`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Employer posts a new job request.
- Example body:

```json
{
  "title": "Full-time Nanny",
  "description": "Looking for experienced nanny to live in",
  "minSalary": 5000,
  "maxSalary": 7000,
  "location": "Bole, Addis Ababa",
  "workType": "live_in",
  "duration": "permanent"
}
```

### Get Job Request
- Method: GET
- Path: `{{base_url}}/job-requests/:id`
- Description: View a single job request.

### Close Job Request
- Method: POST
- Path: `{{base_url}}/job-requests/close/:id`
- Description: Employer closes a job request (mark as filled/closed).

---

## 5) Messages

### List Conversations
- Method: GET
- Path: `{{base_url}}/messages/my-conversations`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: List active user conversations with last-message summaries.

### Send Message
- Method: POST
- Path: `{{base_url}}/messages`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Send a chat message to another user.
- Example body:

```json
{
  "recipient": "6892d8fdad802c5d964357b4",
  "text": "Hello, are you available next month?"
}
```

### Get Chat With User
- Method: GET
- Path: `{{base_url}}/messages/chat-with/:userId`
- Description: Retrieve chat messages exchanged with a specific user.

---

## 6) Notifications

### List Notifications
- Method: GET
- Path: `{{base_url}}/notifications`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Get notifications for the current user.

### Mark Notification Read
- Method: POST
- Path: `{{base_url}}/notifications/mark-as-read/:id`
- Description: Mark a given notification as read.

---

## 7) Admin

### List Pending Verifications
- Method: GET
- Path: `{{base_url}}/admin/verifications`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
- Description: Admin: list all pending identity/document verifications.

### Approve Verification
- Method: POST
- Path: `{{base_url}}/admin/verifications/approve/:id`
- Description: Admin action to approve a verification entry.

### Reject Verification
- Method: POST
- Path: `{{base_url}}/admin/verifications/reject/:id`
- Description: Admin action to reject a verification entry.
- Example body:

```json
{ "reason": "Invalid ID photo" }
```

---

## Notes, assumptions & recommended next steps
- The Postman collection uses `{{base_url}}` and `{{token}}` variables — set these in your Postman environment before running requests.
- Response shapes are not present in the collection; this doc focuses on request shapes and endpoints. If you want, I can add sample success/error responses derived from the server implementation or add an OpenAPI spec.
- Recommended next steps:
  1. Generate an OpenAPI (Swagger) spec from the endpoints and add response schemas.
  2. Create a Postman environment file with `base_url` and `token` placeholders.
  3. Add example responses and common error cases to each endpoint in this doc.

---

If you want, I can now:
- produce a tidy OpenAPI YAML from this collection,
- create a Postman environment JSON with `{{base_url}}` and sample `{{token}}`, or
- augment this file with sample responses and HTTP status codes.

