AI Interview Platform Backend API Progress Assessment
Project: AI-Powered Hybrid Career Platform and Interview Simulator Document Type: Backend API Progress and Remaining-Scope Report Assessment Date: 21 July 2026 Prepared For: Academic Project Evaluation


1. Executive Summary
The backend API currently implements most of the platform's primary recruitment workflow. The implemented system supports recruiter onboarding, company verification, job publication, public job discovery, job-seeker profile management, resume record management, portfolio management, job applications, AI interviews, moderator review, human interviews, explicit candidate forwarding, and recruiter access to forwarded applications.
The latest OpenAPI specification contains:
Metric
Current Value
API paths
62
HTTP operations
73
Controller groups
16
Request/response schemas
107
GET operations
29
POST operations
28
PATCH operations
9
PUT operations
3
DELETE operations
4


Based on functional coverage rather than endpoint count alone, the current backend is estimated to be:
Approximately 69–70% complete against the currently agreed backend scope.
The primary recruitment workflow is substantially more complete than the full platform:
Assessment Area
Estimated Completion
Core recruitment workflow
90–92%
OpenAPI endpoint coverage
73–75%
Full agreed backend scope
69–70%
Production readiness
58–62%


The difference between endpoint coverage and production readiness exists because several endpoints currently store file URLs instead of managing binary files through the planned MinIO object-storage infrastructure. The resume feature also manages resume records but does not yet provide a complete resume-builder workflow.


2. Assessment Scope and Method
This assessment compares the latest generated OpenAPI specification against the project specification, entity relationship design, and confirmed business workflows.
The assessment considers five factors:
API presence Whether the required endpoint exists.
Business workflow coverage Whether the complete process can be executed from beginning to end.
Authorization and ownership requirements Whether the operation is designed for the correct role and resource owner.
Infrastructure completeness Whether required systems such as object storage are integrated rather than represented only by URL fields.
Production readiness Whether the feature includes validation, security, persistence, state transitions, error handling, and testability.
Endpoint count is not treated as a direct measurement of completion. A file-document endpoint that only accepts a URL string is not considered equivalent to a complete upload, storage, authorization, and download workflow.


3. Weighted Completion Calculation
The following weighted model represents the current agreed backend scope.
Backend Area
Weight
Estimated Completion
Weighted Result
Foundation, authentication, JWT, RBAC and current-user resolution
12%
90%
10.80%
Recruiter profile, company onboarding and company verification
12%
95%
11.40%
Recruiter job management and public job discovery
14%
95%
13.30%
Job-seeker profile, resume records, portfolios and publication
12%
92%
11.04%
Applications, AI interviews, moderator review, human interviews and forwarding
22%
90%
19.80%
Resume builder and template system
8%
15%
1.20%
MinIO object storage and secure file delivery
8%
15%
1.20%
Optional project assessment workflow
6%
5%
0.30%
Supporting modules: admin, favorites, messaging, notifications and related features
6%
10%
0.60%
Total
100%


69.64%


The calculated result is rounded to an overall completion estimate of approximately 69–70%.


4. Current API Implementation Summary
4.1 Authentication and Identity
The current API provides:
User registration
JWT-based authentication integration
Current authenticated user retrieval
Role-oriented controller separation
Recruiter profile update
Job-seeker profile retrieval and update
Relevant operations include:
POST  /api/v1/auth/register
GET   /api/v1/me
PATCH /api/v1/recruiter/profile
GET   /api/v1/job-seeker/profile
PATCH /api/v1/job-seeker/profile
Assessment
The authentication foundation is mostly complete. Remaining work is primarily related to administrative user management, account suspension, role provisioning, and broader audit support.


4.2 Company Onboarding and Verification
The current API supports the company onboarding lifecycle:
Recruiter creates company
→ Recruiter adds company-document metadata
→ Recruiter submits company for verification
→ Moderator reviews company
→ Moderator approves, rejects, or requests revision
Implemented operations include:
POST   /api/v1/recruiter/companies
PUT    /api/v1/recruiter/companies/{id}
GET    /api/v1/recruiter/companies/me

POST   /api/v1/recruiter/companies/{companyId}/documents
GET    /api/v1/recruiter/companies/{companyId}/documents
DELETE /api/v1/recruiter/companies/{companyId}/documents/{documentId}

POST   /api/v1/recruiter/companies/{companyId}/submit-verification

GET  /api/v1/moderator/companies
GET  /api/v1/moderator/companies/{companyId}
POST /api/v1/moderator/companies/{companyId}/approve
POST /api/v1/moderator/companies/{companyId}/reject
POST /api/v1/moderator/companies/{companyId}/request-revision
Assessment
The business workflow is nearly complete. However, company documents are currently represented through a documentUrl field. The API does not yet demonstrate direct multipart upload, MinIO storage, object metadata, private download authorization, or secure deletion. Therefore, the company-verification business logic is complete, but the document-storage subsystem is incomplete.


4.3 Recruiter Job Management
The recruiter job lifecycle is strongly implemented.
Create draft
→ Update job
→ Publish
→ Pause
→ Resume
→ Close
Implemented operations include:
POST /api/v1/recruiter/jobs
GET  /api/v1/recruiter/jobs
GET  /api/v1/recruiter/jobs/{id}
PUT  /api/v1/recruiter/jobs/{id}

POST /api/v1/recruiter/jobs/{id}/publish
POST /api/v1/recruiter/jobs/{id}/pause
POST /api/v1/recruiter/jobs/{id}/resume
POST /api/v1/recruiter/jobs/{id}/close
The job model supports:
Company ownership
Recruiter ownership
Category selection
Structured job sections
Skill requirements
Salary range
Location
Job type
Work mode
Experience level
Publication and expiration states
Assessment
This module is approximately 95% complete for the confirmed business rule that an approved company may directly manage and publish its jobs without requiring individual moderator approval for every job post.


4.4 Public Job Discovery
The API supports unauthenticated job discovery and public reference data.
GET /api/v1/public/jobs
GET /api/v1/public/jobs/{jobId}
GET /api/v1/public/job-categories
GET /api/v1/public/skills
GET /api/v1/public/industries
The public job search supports filters for:
Keyword
Location
Category
Skills
Work mode
Job type
Pagination and sorting
Assessment
The public job-discovery API is approximately 95% complete. Remaining work is mainly non-functional, including performance testing, search-index optimization, caching, and final frontend integration.


5. Job-Seeker Profile and Portfolio Coverage
5.1 Profile Management
Implemented operations:
GET   /api/v1/job-seeker/profile
PATCH /api/v1/job-seeker/profile
PATCH /api/v1/job-seeker/profile/publication
The publication endpoint keeps public talent discovery separate from private job applications.


5.2 Resume Record Management
Implemented operations:
POST   /api/v1/job-seeker/resumes
GET    /api/v1/job-seeker/resumes
GET    /api/v1/job-seeker/resumes/{resumeId}
PATCH  /api/v1/job-seeker/resumes/{resumeId}
DELETE /api/v1/job-seeker/resumes/{resumeId}

POST  /api/v1/job-seeker/resumes/{resumeId}/default
PATCH /api/v1/job-seeker/resumes/{resumeId}/publication
The current resume model supports:
Resume title
Resume file URL
Structured resumeData
Default-resume selection
Visibility
Publication timestamp
Assessment
Resume record management is mostly complete, but it is not yet a complete resume builder. The current request accepts resumeFileUrl and resumeData; it does not implement template selection, file upload, PDF generation, preview rendering, or MinIO storage.


5.3 Portfolio Management
Implemented operations include:
POST   /api/v1/job-seeker/portfolios
GET    /api/v1/job-seeker/portfolios
GET    /api/v1/job-seeker/portfolios/{portfolioId}
PATCH  /api/v1/job-seeker/portfolios/{portfolioId}
DELETE /api/v1/job-seeker/portfolios/{portfolioId}

PATCH /api/v1/job-seeker/portfolios/{portfolioId}/publication

POST   /api/v1/job-seeker/portfolios/{portfolioId}/projects
PATCH  /api/v1/job-seeker/portfolios/{portfolioId}/projects/{projectId}
DELETE /api/v1/job-seeker/portfolios/{portfolioId}/projects/{projectId}
Assessment
Portfolio management is approximately 95% complete for metadata and ownership operations. Portfolio-image file storage remains dependent on the missing MinIO integration.


6. Public Talent Discovery
Recruiters can search and inspect job seekers who explicitly publish their information.
GET /api/v1/recruiter/talent
GET /api/v1/recruiter/talent/{publicProfileSlug}
GET /api/v1/recruiter/talent/{publicProfileSlug}/resumes/{resumeId}/download
This workflow is intentionally separated from private job applications.
Public profile, portfolio, or resume
→ visible only when explicitly published

Private application, cover letter, AI answers, AI score, and moderator review
→ hidden until moderator forwarding
Assessment
The access model is correct. The main unresolved issue is the download mechanism. Returning a permanent file URL may allow access outside the application authorization boundary. The final implementation should use either:
Short-lived MinIO presigned URLs; or
Backend-authorized file streaming.


7. Job Application and Interview Workflow
The API now supports the primary candidate recruitment workflow.
7.1 Job Applications
POST /api/v1/job-seeker/jobs/{jobId}/applications
GET  /api/v1/job-seeker/applications
GET  /api/v1/job-seeker/applications/{applicationId}
POST /api/v1/job-seeker/applications/{applicationId}/withdraw
Expected rules include:
Application belongs to the authenticated job seeker
Duplicate applications are prevented
The selected resume belongs to the applicant
Only eligible jobs accept applications
Recruiters cannot directly access unforwarded applications


7.2 AI Interviews
POST /api/v1/job-seeker/jobs/{jobId}/ai-interviews
POST /api/v1/job-seeker/applications/{applicationId}/ai-interviews

GET  /api/v1/job-seeker/ai-interviews
GET  /api/v1/job-seeker/ai-interviews/{sessionId}

POST /api/v1/job-seeker/ai-interviews/{sessionId}/start
PUT  /api/v1/job-seeker/ai-interviews/{sessionId}/questions/{questionId}/answer
POST /api/v1/job-seeker/ai-interviews/{sessionId}/complete

GET /api/v1/job-seeker/ai-interviews/{sessionId}/result
The API supports:
Job-specific practice interviews
Application-linked interviews
Interview sessions
Questions
Answers
Per-answer scoring and feedback
Overall interview feedback
Completion results
Scope Limitation
AI resume parsing is not part of the agreed resume-builder scope. The platform may generate or render resumes from structured user data, but it will not attempt to parse a user-uploaded PDF or DOCX into profile fields during the current implementation phase.


7.3 Moderator Candidate Review
GET  /api/v1/moderator/candidate-applications
GET  /api/v1/moderator/candidate-applications/{applicationId}

POST /api/v1/moderator/candidate-applications/{applicationId}/approve
POST /api/v1/moderator/candidate-applications/{applicationId}/reject
POST /api/v1/moderator/candidate-applications/{applicationId}/forward


7.4 Human Interviews
POST  /api/v1/moderator/candidate-applications/{applicationId}/human-interviews
PATCH /api/v1/moderator/human-interviews/{interviewId}/reschedule
POST  /api/v1/moderator/human-interviews/{interviewId}/complete
POST  /api/v1/moderator/human-interviews/{interviewId}/cancel


7.5 Recruiter Forwarded Applications
GET /api/v1/recruiter/forwarded-applications
GET /api/v1/recruiter/forwarded-applications/{applicationId}
The authorization boundary is:
Moderator approval
≠ recruiter visibility

Moderator forwarding
= recruiter visibility
Assessment
The primary application-to-forwarding workflow is approximately 90–92% complete. Remaining work is integration testing, stricter state-transition validation, storage security, and optional project assessment.


8. Missing Resume Builder Feature
8.1 Objective
The resume builder will allow a job seeker to create and manage a resume in either of two ways:
Option A: Platform Template
Select a static platform template
→ Enter structured resume information
→ Save resume data
→ Preview the rendered resume
→ Generate a PDF
→ Store the generated PDF in MinIO
→ Set as default or publish
Option B: User-Owned Resume
Upload an existing PDF or DOCX
→ Validate the file
→ Store the original file in MinIO
→ Create a resume record
→ Set as default or publish
The system will not perform AI resume parsing in the current scope.


8.2 Existing Database Support
The ERD already contains the necessary foundation:
resume_templates
Field
Purpose
id
Template identifier
name
Template name
preview_image_url
Preview image
template_schema
Layout and styling configuration
status
Template availability


resumes
Field
Purpose
job_seeker_profile_id
Resume owner
template_id
Selected platform template
title
Resume name
resume_file_url
Generated or uploaded file reference
resume_data
Structured editable resume data
is_default
Default resume selection


The final implementation should replace or supplement permanent file URLs with MinIO object references.


8.3 Planned Resume Source Model
A resume should clearly identify how it was created.
public enum ResumeSourceType {
    PLATFORM_TEMPLATE,
    USER_UPLOAD
}
planned additional fields:
Field
Type
Purpose
source_type
enum
Distinguishes template-built and uploaded resumes
template_id
bigint, nullable
Selected template
resume_data
jsonb, nullable
Editable structured data
storage_object_id
bigint, nullable
Reference to stored file metadata
generated_at
timestamp, nullable
PDF generation time
file_version
integer
Supports regenerated versions
status
enum
DRAFT, GENERATED, ACTIVE, ARCHIVED


Validation rule:
PLATFORM_TEMPLATE
→ template_id and resume_data are required

USER_UPLOAD
→ stored file reference is required


8.4 Planned Resume Data Structure
{
  "personalInformation": {
    "fullName": "Example User",
    "email": "user@example.com",
    "phone": "+855...",
    "location": "Phnom Penh, Cambodia",
    "headline": "Backend Developer",
    "summary": "Professional summary"
  },
  "skills": [
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "Docker"
  ],
  "workExperience": [
    {
      "company": "Example Company",
      "position": "Backend Developer",
      "startDate": "2025-01",
      "endDate": null,
      "current": true,
      "responsibilities": [
        "Developed REST APIs",
        "Implemented authentication"
      ]
    }
  ],
  "education": [
    {
      "institution": "Institute of Science and Technology Advanced Development",
      "degree": "Bachelor",
      "fieldOfStudy": "Computer Science",
      "graduationYear": 2028
    }
  ],
  "projects": [
    {
      "title": "AI Interview Platform",
      "description": "Career and interview platform",
      "url": "https://example.com"
    }
  ],
  "languages": [
    {
      "name": "Khmer",
      "level": "Native"
    },
    {
      "name": "English",
      "level": "Intermediate"
    }
  ]
}


8.5 Planned Resume-Builder Endpoints
Public Template Catalog
GET /api/v1/public/resume-templates
GET /api/v1/public/resume-templates/{templateId}
Template-Based Resume
POST  /api/v1/job-seeker/resumes/from-template
PATCH /api/v1/job-seeker/resumes/{resumeId}/content
PATCH /api/v1/job-seeker/resumes/{resumeId}/template
GET   /api/v1/job-seeker/resumes/{resumeId}/preview
POST  /api/v1/job-seeker/resumes/{resumeId}/generate
GET   /api/v1/job-seeker/resumes/{resumeId}/download
User Upload
POST /api/v1/job-seeker/resumes/upload
GET  /api/v1/job-seeker/resumes/{resumeId}/download
The upload endpoint should use multipart/form-data.
Example:
POST /api/v1/job-seeker/resumes/upload
Content-Type: multipart/form-data
Form fields:
file: resume.pdf
title: Backend Developer Resume


8.6 Resume Builder Business Rules
A user can only read, edit, generate, publish, or delete their own resume.
A platform template must be active before it can be selected.
Uploaded resumes are stored without AI parsing.
Template-built resumes remain editable through structured JSON data.
PDF generation must be deterministic and reproducible.
Only one resume can be marked as default.
A resume referenced by an active application must not be physically deleted.
Published resume access must still pass visibility and authorization checks.
Generated PDFs and uploaded files must be stored in private MinIO buckets.
Download URLs must be short-lived or the backend must stream the file.


8.7 Resume Builder Completion Criteria
The resume-builder feature is complete only when all of the following are implemented:
Template list
Template detail and preview
Create from template
Structured resume editing
PDF preview
PDF generation
MinIO upload
Secure download
User-owned PDF/DOCX upload
Default resume selection
Publication controls
Ownership validation
File-type and size validation
Integration tests


9. Missing MinIO Object-Storage Integration
9.1 Current Limitation
The OpenAPI currently accepts external URL values such as:
{
  "documentType": "BUSINESS_REGISTRATION",
  "documentUrl": "https://example.com/document.pdf"
}
and:
{
  "title": "My Resume",
  "resumeFileUrl": "https://example.com/resume.pdf"
}
This represents file metadata, not a complete file-storage implementation.
A complete storage workflow must manage:
Binary upload
→ validation
→ MinIO object creation
→ database metadata
→ authorization
→ secure download
→ replacement or deletion


9.2 Storage Scope
MinIO should store:
Company registration documents
Company verification documents
Uploaded resumes
Generated resume PDFs
Resume-template preview images
Company logos
Portfolio project images
Optional project-assessment attachments
Other future private documents


9.3 Planned Bucket Design
Private Buckets
company-documents
resumes
project-submissions
Public or Controlled Asset Bucket
public-assets
public-assets may contain company logos and template previews. Portfolio images may be public only when the portfolio is published.
Private buckets must not allow anonymous access.


9.4 Planned Object-Key Structure
company-documents/
  companies/{companyId}/documents/{documentId}/{uuid}-{sanitizedFilename}

resumes/
  job-seekers/{jobSeekerProfileId}/resumes/{resumeId}/original/{uuid}.pdf

resumes/
  job-seekers/{jobSeekerProfileId}/resumes/{resumeId}/generated/v{version}.pdf

public-assets/
  companies/{companyId}/logos/{uuid}.webp

public-assets/
  resume-templates/{templateId}/preview.webp

public-assets/
  portfolios/{portfolioId}/projects/{projectId}/{uuid}.webp

project-submissions/
  assignments/{assignmentId}/submissions/{submissionId}/{uuid}-{filename}
Object keys must be generated by the backend. Client-provided object paths must not be accepted.


9.5 Planned File Metadata Table
A shared stored_files table reduces duplication.
stored_files
------------
id
bucket_name
object_key
original_filename
stored_filename
content_type
size_bytes
checksum_sha256
storage_provider
visibility
uploaded_by_user_account_id
created_at
updated_at
deleted_at
planned enum values:
public enum StorageProvider {
    MINIO
}

public enum FileVisibility {
    PRIVATE,
    AUTHORIZED,
    PUBLIC
}
Domain tables should reference stored_files.id instead of storing permanent external URLs.
Examples:
company_documents.stored_file_id
resumes.stored_file_id
portfolio_projects.image_file_id
project_submissions.attachment_file_id
companies.logo_file_id


9.6 Planned MinIO Service Boundary
public interface ObjectStorageService {

    StoredObject upload(
        String bucket,
        String objectKey,
        InputStream inputStream,
        long size,
        String contentType
    );

    InputStream download(String bucket, String objectKey);

    String createPresignedDownloadUrl(
        String bucket,
        String objectKey,
        Duration expiry
    );

    void delete(String bucket, String objectKey);

    boolean exists(String bucket, String objectKey);
}
The rest of the application should depend on ObjectStorageService, not directly on the MinIO SDK. This allows later replacement with Amazon S3, Google Cloud Storage, or another S3-compatible provider.


9.7 Planned Upload Endpoints
Company Documents
POST /api/v1/recruiter/companies/{companyId}/documents
Content-Type: multipart/form-data
Form fields:
file
documentType
Resume Upload
POST /api/v1/job-seeker/resumes/upload
Content-Type: multipart/form-data
Company Logo
POST /api/v1/recruiter/companies/{companyId}/logo
Content-Type: multipart/form-data
Portfolio Image
POST /api/v1/job-seeker/portfolios/{portfolioId}/projects/{projectId}/image
Content-Type: multipart/form-data


9.8 Secure Download Strategies
Strategy A: Backend Streaming
Client requests file
→ backend validates role and ownership
→ backend reads object from MinIO
→ backend streams response
Advantages:
Strong authorization control
No MinIO endpoint exposed
Easy audit logging
Disadvantages:
Backend consumes bandwidth
Strategy B: Short-Lived Presigned URL
Client requests file
→ backend validates role and ownership
→ backend creates 1–5 minute MinIO presigned URL
→ client downloads directly from MinIO
Advantages:
Better scalability
Backend does not proxy file bytes
Disadvantages:
URL remains usable until expiration
planned policy:
File Type
Download Method
Company verification documents
Backend stream or very short presigned URL
Private resumes
Short presigned URL after authorization
Public template previews
Public or cached URL
Public company logos
Public or CDN URL
Private project submissions
Backend stream or short presigned URL


Permanent public links should not be used for sensitive files.


9.9 File Validation Requirements
Each upload must validate:
Maximum file size
Allowed MIME type
File extension
Filename sanitization
Empty file rejection
Checksum generation
Ownership
Domain status
Malware scanning when available
Suggested limits:
File Category
Allowed Types
Suggested Limit
Company document
PDF, PNG, JPEG
10 MB
Resume
PDF, DOCX
10 MB
Company logo
PNG, JPEG, WEBP
5 MB
Portfolio image
PNG, JPEG, WEBP
5 MB
Project attachment
ZIP, PDF or approved types
25 MB


The final limits should be configurable through application properties.


9.10 MinIO Security Requirements
Private buckets must deny anonymous access.
MinIO credentials must be stored in environment variables or secrets.
The application must not return access keys or object-storage credentials.
Object keys must be generated by the backend.
The original filename must not be used directly as the object key.
Presigned links must expire.
Download authorization must be checked before generating a link.
Deleted database records must not leave orphaned files.
Failed database transactions must clean up newly uploaded objects.
Audit logs should record sensitive file downloads.


9.11 Transaction and Cleanup Strategy
File upload and database persistence are separate systems and cannot share a normal database transaction.
planned sequence:
1. Validate request and authorization
2. Generate object key
3. Upload object to MinIO
4. Insert file metadata and domain record
5. Return response
Failure handling:
MinIO upload succeeds
but database insert fails
→ delete uploaded MinIO object

Database record exists
but object is missing
→ mark record invalid and report storage inconsistency
A scheduled orphan-cleanup process may be added later.


10. Missing Optional Project Assessment Workflow
The database design includes:
project_assignments
project_submissions
project_reviews
However, the latest OpenAPI does not expose a complete project-assessment API.
10.1 Planned Workflow
Moderator reviews candidate
→ Moderator optionally assigns project
→ Job seeker views assignment
→ Job seeker submits project
→ Moderator reviews and scores submission
→ Project receives PASSED or FAILED
→ Candidate approval continues
Business rule:
No project assigned
→ Existing approval requirements remain unchanged

Project assigned
→ Candidate approval requires a PASSED project review


10.2 Planned Endpoints
Moderator Assignment
POST  /api/v1/moderator/candidate-applications/{applicationId}/projects
GET   /api/v1/moderator/candidate-applications/{applicationId}/projects
GET   /api/v1/moderator/projects/{projectId}
PATCH /api/v1/moderator/projects/{projectId}
POST  /api/v1/moderator/projects/{projectId}/cancel
Job-Seeker Submission
GET   /api/v1/job-seeker/project-assignments
GET   /api/v1/job-seeker/project-assignments/{projectId}
POST  /api/v1/job-seeker/project-assignments/{projectId}/submit
PATCH /api/v1/job-seeker/project-assignments/{projectId}/submission
Moderator Review
GET  /api/v1/moderator/projects
GET  /api/v1/moderator/projects/{projectId}/submission
POST /api/v1/moderator/projects/{projectId}/review


11. Remaining Supporting Modules
The following modules are not represented as complete workflows in the latest OpenAPI:
Admin user and role management
Account suspension and reactivation
Favorite jobs
Job-post ratings
Messaging
Notifications
Hiring records
Commission calculation
Invoices and payments
Finance operations
Full audit-log APIs
Vapi voice-call integration
Background file cleanup
Scheduled job expiration
Operational dashboards
These features should be prioritized according to the final academic scope and deadline.


12. Revised Implementation Roadmap
Phase 1: MinIO Storage Foundation
Deliverables
MinIO Docker configuration
Application configuration
Bucket initializer
ObjectStorageService
File metadata model
Upload validation
Private download strategy
Integration tests
Completion Effect
Estimated full backend completion:
Current: 69–70%
After storage foundation: approximately 74–76%


Phase 2: Migrate Company Documents and Resume Files
Deliverables
Multipart company-document upload
Secure company-document download
Resume upload
Secure resume download
Company logo upload
Portfolio image upload
Cleanup on delete
Replace client-provided permanent URLs
Completion Effect
After file-domain migration: approximately 77–79%


Phase 3: Resume Builder
Deliverables
Static template catalog
Template preview
Structured resume-data schema
Create resume from template
Edit content
Change template
Preview
Generate PDF
Store generated PDF in MinIO
Set default
Publish
Upload own PDF/DOCX
No AI parsing
Completion Effect
After resume builder: approximately 82–84%


Phase 4: Optional Project Assessment
Deliverables
Moderator assignment
Job-seeker submission
Moderator review and scoring
Approval guard
Recruiter visibility after forwarding
Optional MinIO project attachments
Completion Effect
After project assessment: approximately 87–89%


Phase 5: Supporting Platform Modules
Suggested Order
Favorite jobs
Admin user management
Notifications
Messaging
Hiring and finance
Vapi voice integration
Reporting and analytics
Completion Effect
After agreed supporting modules: above 90%


13. Testing Requirements
13.1 Storage Tests
Unauthorized user cannot download a private file
Recruiter cannot access another company's documents
Job seeker cannot access another user's resume
Invalid MIME type is rejected
Oversized files are rejected
Failed database insert deletes uploaded object
Deleting metadata deletes or archives the object
Presigned URL expires
Object key cannot be controlled by the client


13.2 Resume Builder Tests
Inactive template cannot be selected
Template-created resume requires structured data
Uploaded resume requires a file
User cannot update another user's resume
Only one resume is default
Referenced application resume cannot be physically deleted
Generated PDF is stored in MinIO
Generated file can be securely downloaded
Uploaded file is not parsed by AI
Publication respects visibility rules


13.3 Project Assessment Tests
Non-moderator cannot assign a project
Candidate cannot access another candidate's assignment
Candidate cannot submit after cancellation
Candidate cannot create duplicate submissions
Moderator cannot review an unsubmitted project
Score must be between 0 and 100
Failed or incomplete project blocks approval
Passed project allows approval
Recruiter cannot see the project before forwarding


13.4 End-to-End Recruitment Test
1. Recruiter registers
2. Recruiter creates company
3. Recruiter uploads company documents to MinIO
4. Recruiter submits company verification
5. Moderator approves company
6. Recruiter publishes job
7. Job seeker creates profile
8. Job seeker builds or uploads resume
9. Job seeker applies
10. Job seeker completes AI interview
11. Moderator reviews candidate
12. Moderator conducts human interview
13. Moderator optionally assigns project
14. Job seeker submits project
15. Moderator approves candidate
16. Moderator forwards candidate
17. Recruiter retrieves forwarded application
18. Authorized resume download succeeds
19. Unauthorized download is rejected


14. Risks and Technical Considerations
14.1 URL-Only File Records
Current URL-based request models can allow untrusted external links and bypass storage governance. File upload must move under backend control.
14.2 Permanent Public Links
Permanent URLs for company documents or private resumes may expose sensitive data. Private files require authorization on every access.
14.3 Resume JSON Flexibility
Using unrestricted Map<String, Object> resume data is flexible but weakly validated. A documented schema or typed DTO is planned.
14.4 Storage and Database Consistency
MinIO and PostgreSQL do not share a transaction. Compensating cleanup is required when one operation succeeds and the other fails.
14.5 PDF Generation Complexity
Template rendering must support predictable pagination, fonts, long content, and multiple page sizes. Template schemas should be versioned.
14.6 Scope Control
AI resume parsing should remain excluded unless additional time is available. The feature adds PDF/DOCX extraction, document-quality issues, AI cost, data privacy concerns, and mapping uncertainty.


15. Final Assessment
The backend has achieved strong progress in the most important business workflow. It already supports the majority of the recruitment lifecycle from company verification to recruiter access to a moderator-forwarded candidate.
The current implementation should be described as:
A substantially complete core recruitment API with incomplete document infrastructure and incomplete advanced candidate-support features.
Final status:
Area
Result
Core recruitment workflow
90–92%
Full agreed backend scope
69–70%
Production readiness
58–62%
Most important next dependency
MinIO object storage
Major functional feature after storage
Resume builder
Major workflow after resume builder
Optional project assessment


The correct implementation order is:
MinIO storage foundation
→ Company-document and resume-file migration
→ Static-template resume builder
→ Generated resume PDF storage
→ Optional project assessment
→ Supporting platform modules
This order prevents duplicate work because the resume builder, company verification documents, portfolio images, and project submissions all depend on a secure object-storage layer.



