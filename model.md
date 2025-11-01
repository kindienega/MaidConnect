1. User Model (users)

Purpose: central authentication and user lifecycle record for every account (employers, maids, admins).

Example Mongoose schema (JS/TS style):

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ['maid', 'employer', 'admin'], required: true }, // required
  name: { type: String, required: true }, // display name
  phone: { type: String, required: true, unique: true }, // unique identifier, required
  email: { type: String, required: false, unique: true, sparse: true }, // optional
  passwordHash: { type: String, required: true }, // hashed password
  status: { type: String, enum: ['pending', 'active', 'suspended', 'deleted'], default: 'pending' },
  lastLoginAt: { type: Date }, // optional
  language: { type: String, default: 'en' },
  metadata: { type: Object }, // free-form metadata for additional flags
}, { timestamps: true });


// Indexes
UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });

Business notes: store minimal personal info here. Sensitive documents and extended profile data sit in profile collections to avoid bloating the authentication collection.

2. Maid Profile Model (maid_profiles)

Purpose: hold the maid-specific information and preferences that are used by the matching engine. This is a separate collection and references the users collection by userId.

Example Mongoose schema:

const MaidProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // FK
  bio: { type: String, required: false }, // optional short intro
  dob: { type: Date, required: false }, // optional
  gender: { type: String, enum: ['female','male','other'], required: false },
  location: {
    city: { type: String, required: true }, // required
    region: { type: String }, // optional
    coords: { // optional: geo point for near queries
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: undefined } // [lng, lat]
    }
  },
  skills: { type: [String], default: [] }, // required array can be empty but recommended to have values
  experienceYears: { type: Number, default: 0 },
  previousEmployers: { type: [ {
    employerName: String,
    role: String,
    startDate: Date,
    endDate: Date,
    notes: String
  } ], default: [] },
  preferredWorkType: { type: String, enum: ['live_in','live_out','both'], default: 'both' },
  availability: { type: String, enum: ['available','on_job','not_available'], default: 'available' },
  expectedSalary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'ETB' }
  },
  verified: { type: Boolean, default: false },
  documents: { // references or URLs to ID docs and certificates
    idCardUrl: { type: String },
    certificateUrls: [String],
    referenceUrls: [String]
  },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  flags: { type: [String], default: [] }, // admin flags or warnings
}, { timestamps: true });


// Indexes
MaidProfileSchema.index({ userId: 1 });
MaidProfileSchema.index({ 'location.city': 1 });
MaidProfileSchema.index({ skills: 1 });
MaidProfileSchema.index({ 'location.coords': '2dsphere' });

Business notes: keep this collection flexible to add new skill tags or training certificates later.

3. Employer Profile Model (employer_profiles)

Purpose: store employer-specific information like household context and default preferences. This is separate from users and references it.

Example Mongoose schema:

const EmployerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  householdSize: { type: Number },
  location: {
    city: { type: String, required: true },
    region: { type: String }
  },
  preferredWorkType: { type: String, enum: ['live_in','live_out','both'], default: 'both' },
  verified: { type: Boolean, default: false },
  notes: { type: String },
}, { timestamps: true });


// Indexes
EmployerProfileSchema.index({ userId: 1 });
EmployerProfileSchema.index({ 'location.city': 1 });

Business notes: employer verification is recommended but can be phased into MVP as optional with later enforced verification for payment features.

4. Job Model (jobs)

Purpose: job postings created by employers. These documents power matches, searches, and application flows.

Example Mongoose schema:

const JobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  location: {
    city: { type: String, required: true },
    region: { type: String },
    coords: {
      <!--
        model.md
        API and data model documentation for the MaidConnect platform
        This file describes the core data models and the HTTP API surface (v1).
      -->

      # MaidConnect — API & Data Models (v1)

      Version: v1

      Last updated: 2025-11-01

      Purpose
      - Provide a concise reference for backend engineers and integrators describing the core data models and the REST API used to manage users, profiles, jobs, applications, matches, and messaging.

      Base URL (example)
      - Production: https://api.maidconnect.example.com/v1
      - Local: http://localhost:3000/v1

      Authentication
      - Primary: JSON Web Token (Bearer). Use the `Authorization: Bearer <token>` header for protected endpoints.
      - Refresh tokens are supported via `/auth/refresh` (see Auth endpoints).

      Common headers
      - Content-Type: application/json
      - Accept: application/json

      Error format
      - All errors return a JSON body with the following shape and appropriate HTTP status code.

      ```json
      {
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Human readable error message",
          "details": { "field": "reason" }
        }
      }
      ```

      Common patterns
      - Pagination: endpoints returning lists use `page` (1-based) and `perPage` query params. Responses include `meta` with `total`, `page`, and `perPage`.
      - Dates: ISO 8601 strings.
      - IDs: MongoDB ObjectId string.
      - Geo queries: use `lat`, `lng`, `radius` (meters) or a `near` filter where applicable.

      HTTP status codes (conventions)
      - 200 OK — successful GET/PUT/PATCH
      - 201 Created — successful resource creation
      - 204 No Content — successful deletion
      - 400 Bad Request — validation or malformed request
      - 401 Unauthorized — missing/invalid token
      - 403 Forbidden — access denied
      - 404 Not Found — resource missing
      - 409 Conflict — e.g., duplicate phone/email
      - 422 Unprocessable Entity — domain validation
      - 500 Server Error

      ---

      ## Data Models (summary)

      Below are the primary collections and minimal JSON schemas for reference. These map closely to the Mongoose schemas stored in the codebase.

      ### User
      - Collection: `users`
      - Purpose: central authentication record for all accounts (maid, employer, admin).

      Example (read) response:

      ```json
      {
        "_id": "64f3b2...",
        "role": "maid",
        "name": "Aisha Tesfaye",
        "phone": "+2519xxxxxxx",
        "email": "aisha@example.com",
        "status": "active",
        "language": "en",
        "lastLoginAt": "2025-10-25T12:34:56.789Z",
        "createdAt": "2025-06-12T08:00:00.000Z"
      }
      ```

      Fields of note
      - role: `maid | employer | admin`
      - phone: unique identifier used for signin/verification
      - passwordHash: stored server-side (never return in API responses)

      ### MaidProfile
      - Collection: `maid_profiles`
      - Purpose: maid-specific profile used for matching and search.

      Example snippet:

      ```json
      {
        "_id": "64f4c8...",
        "userId": "64f3b2...",
        "bio": "Experienced house helper...",
        "location": { "city": "Addis Ababa", "region": "Yeka", "coords": { "type": "Point", "coordinates": [39.0, 9.0] } },
        "skills": ["cooking","childcare"],
        "experienceYears": 3,
        "preferredWorkType": "live_in",
        "verified": true,
        "ratingAvg": 4.8
      }
      ```

      ### EmployerProfile
      - Collection: `employer_profiles`
      - Purpose: employer preferences and household data.

      ### Job
      - Collection: `jobs`
      - Purpose: job postings created by employers. Supports geo-location and skill filters.

      Example:

      ```json
      {
        "_id": "6512ab...",
        "employerId": "64f6d0...",
        "title": "Live-in house helper",
        "location": { "city": "Addis Ababa", "coords": { "type": "Point", "coordinates": [39.0, 9.0] } },
        "requiredSkills": ["cleaning","cooking"],
        "workType": "live_in",
        "salary": { "amount": 3500, "currency": "ETB" },
        "status": "open",
        "createdAt": "2025-10-01T10:00:00.000Z"
      }
      ```

      ### Application
      - Collection: `applications`
      - Purpose: track maid applications and lifecycle (applied, shortlisted, hired, rejected).

      ### Match
      - Collection: `matches`
      - Purpose: persisted system match suggestions and employer shortlists. Includes score and reason for ranking.

      ### Conversation / Message
      - Collections: `conversations`, `messages`
      - Purpose: messaging between users; `conversations` holds participants and lastMessage; `messages` holds individual messages.

      ---

      ## API Endpoints (selected)

      Notes: each endpoint path is prefixed with `/v1`. Use Authorization header for protected endpoints.

      ### Auth

      - POST /v1/auth/register
        - Create a new user (role selected).
        - Body (example):

      ```json
      {
        "role": "maid",
        "name": "Aisha",
        "phone": "+2519xxxxxxx",
        "password": "plaintext-password"
      }
      ```

        - Response: 201 Created

      - POST /v1/auth/login
        - Body: { phone, password }
        - Response: { accessToken, refreshToken, expiresIn }

      - POST /v1/auth/refresh
        - Body: { refreshToken }
        - Response: { accessToken }

      - GET /v1/auth/me
        - Protected. Returns current user's public profile.

      ### Users

      - GET /v1/users/:id
        - Returns user record (public fields only).

      - PATCH /v1/users/:id
        - Update user fields (name, language, status for admins). Validate phone/email uniqueness.

      ### Maid profiles

      - POST /v1/maids
        - Create or initialize maid profile. Protected (maid role).

      - GET /v1/maids/:id
        - Returns maid profile with aggregated rating and verification flags.

      - PATCH /v1/maids/:id
        - Update profile fields (bio, skills, availability, documents URLs).

      ### Employer profiles

      - POST /v1/employers
      - GET /v1/employers/:id
      - PATCH /v1/employers/:id

      ### Jobs

      - POST /v1/jobs
        - Create a job posting (protected: employer role).
        - Body highlights: title, description, location (city + coords optional), requiredSkills, workType, salary.

      - GET /v1/jobs/:id

      - PATCH /v1/jobs/:id

      - DELETE /v1/jobs/:id

      - GET /v1/jobs
        - List and search jobs.
        - Query params: `city`, `skills` (comma-separated), `workType`, `lat`, `lng`, `radius` (meters), `page`, `perPage`, `sort`.

      Example search request

      GET /v1/jobs?city=Addis%20Ababa&skills=cooking,childcare&lat=9.0&lng=39.0&radius=5000

      Example search response (excerpt):

      ```json
      {
        "meta": { "total": 120, "page": 1, "perPage": 20 },
        "data": [ { "_id": "...", "title": "...", "score": 87 } ]
      }
      ```

      ### Applications

      - POST /v1/jobs/:jobId/apply
        - Protected (maid). Body may include `coverMessage` and `attachments`.
        - Response: 201 Created with application id.

      - GET /v1/jobs/:jobId/applications
        - Protected (employer). Returns list with pagination.

      ### Matches

      - GET /v1/jobs/:jobId/matches
        - Protected (employer). Returns list of system-suggested maid matches with `score` and `reason`.

      - POST /v1/jobs/:jobId/matches/:maidId/shortlist
        - Mark a match as shortlisted by employer. Triggers notification.

      ### Conversations & Messages

      - POST /v1/conversations
        - Create or return existing conversation between participants. Body: `{ participants: [userId, userId], jobId? }`.

      - POST /v1/conversations/:id/messages
        - Add message to conversation. Body: `{ text, attachments? }`.

      - GET /v1/conversations
        - Returns conversations for current user with lastMessage summary.

      ---

      ## Request/Response Examples

      Register (curl):

      ```bash
      curl -X POST https://api.maidconnect.example.com/v1/auth/register \
        -H "Content-Type: application/json" \
        -d '{ "role":"maid", "name":"Aisha", "phone":"+2519xxxxxxx", "password":"secret" }'
      ```

      Login response (example):

      ```json
      {
        "accessToken": "eyJhbGci...",
        "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4=",
        "expiresIn": 3600
      }
      ```

      Create job (employer):

      ```json
      POST /v1/jobs
      Authorization: Bearer <token>
      {
        "title": "Live-in house helper",
        "location": { "city": "Addis Ababa", "coords": { "type": "Point", "coordinates": [39.0, 9.0] } },
        "requiredSkills": ["cooking","cleaning"],
        "workType": "live_in",
        "salary": { "amount": 3500, "currency": "ETB" }
      }
      ```

      Response: 201 with created job object.

      ---

      ## Validation rules & edge cases
      - Phone uniqueness: phone must be unique across users. Updates must be validated and conflicts return 409.
      - Email: optional; sparse unique index is recommended.
      - Profiles: user creation may not create profile immediately — call `POST /v1/maids` or `POST /v1/employers` as next step.
      - Geo/coords: when using `coords`, use [lng, lat] order.
      - Large lists: enforce `perPage` maximum (e.g., 100) to avoid heavy queries.

      ## Notifications & Webhooks
      - Internal notifications for application events, matches, shortlist, messages. Provide webhook endpoints for partner integrations if needed.

      ## Versioning & Compatibility
      - All endpoints are versioned under `/v1`. When changing resource shapes, release `/v2` and maintain backward compatibility for one release cycle.

      ## Security & Privacy notes
      - Never return `passwordHash` or other sensitive artifacts in API responses.
      - Store PII minimally in `users` and keep documents (IDs, certificates) in a separate, access-controlled storage bucket. Provide signed URLs for access where needed.

      ## Suggested next steps (developer)
      1. Add an OpenAPI/Swagger spec generated from these endpoints.
      2. Add example Postman collection for common flows (register, login, create job, apply, message).
      3. Add contract tests for auth and jobs endpoints (happy path + common errors).

      ## Contact
      - For questions about the API design or model changes, contact backend team: backend@maidconnect.example.com

      ---

      Changelog
      - 2025-11-01: Converted model notes into structured API & model documentation (v1).

