# Domain Notes (Legacy → Django)
This repository is being reset into a **Django monolith + Django Templates**.
The previous implementation used **Next.js + Prisma + NextAuth/Auth.js + Postgres**.

This document captures the domain behavior that must be preserved while deleting the legacy stack.

## Identity & Roles (RBAC)

Legacy concepts:
- Roles were explicit DB entities (`Role`, `UserRole`) with a `RoleKey` enum.
- Core role keys observed in code: `ADMIN`, `MENTOR`, `STUDENT`.
- New users were automatically assigned a default role (typically `STUDENT`).

Django mapping (baseline direction):
- Use Django auth `Group` for coarse roles (Admin/Instructor(or Mentor)/Student/Support).
- Use Django permissions (model permissions + custom permissions) for fine-grained access.
- Keep `academy_rbac.Role`/`academy_rbac.UserRole` only if you need dynamic role definitions.

Recommended mapping:
- `ADMIN` → Django `is_staff` + `is_superuser` (or `Group: Admin`)
- `MENTOR` → `Group: Instructor` (or `Group: Mentor`) with content review permissions
- `STUDENT` → default authenticated user group

## Courses, Enrollment, Progress, Certificates

Legacy behavior (from `lib/course-tracking.ts` and API routes):
- Enrollment is created once per `(user, course)`.
- On enrollment, course progress is initialized with `total_lessons` and 0%.
- Lesson completion is upserted per `(user, lesson)`.
- Course progress is recomputed from completed lessons.
- When progress reaches **100%**, enrollment is marked completed and a certificate is issued.

Django mapping (baseline direction):
- Models:
  - `Enrollment` (unique per user+course)
  - `LessonProgress` (unique per user+lesson)
  - `CourseProgress` (unique per user+course)
  - `Certificate`
- Services:
  - `enroll_user_in_course(user, course)`
  - `mark_lesson_completed(user, lesson)`
  - `update_course_progress(user, course)`

## Unlocks, Payment Proofs, Admin Approvals

Legacy behavior:
- Manual payment proofs were stored in `SavedItem.metadata` keyed by `(userId, itemType, itemId)`.
- The metadata included:
  - `status`: `pending|approved|rejected|free`
  - `proofUrl`
  - `notes`
  - `submittedAt`
  - `verifiedAt`
  - `verifierId`
  - `source`: `manual|free`
- Admin review flow:
  - Admin lists requests from `SavedItem` rows that contain proof metadata.
  - On approve: create enrollment + progress; write audit log.

Django mapping (implemented baseline direction):
- Replace `SavedItem.metadata` with first-class models:
  - `PaymentProofSubmission` (status + proof file/url + notes + reviewed_by/at)
  - `Entitlement` (represents access grant to a course/project)
- Admin approves/rejects via `ModelAdmin` actions (bulk capable).
- Approval service should be transactional and should:
  - create entitlement
  - ensure enrollment exists
  - ensure progress exists
  - write audit log

## CMS Concepts

Legacy concepts:
- CMS pages had a `CmsPage` plus version table (`CmsPageVersion`) and activities.
- A unique slug was generated from title, with suffixing if needed.
- Latest version content was used as page content; summaries were derived from HTML.

Django mapping (baseline direction):
- If you need versioning, implement a `Page` + `PageRevision` model.
- If you want simpler baseline, start with a single `Page` model and add versioning later.

## Uploads / Media

Legacy concepts:
- UploadThing was used with two auth modes:
  - admin-only uploads (thumbnails, lesson media, CMS media)
  - authenticated uploads (payment proof)

Django mapping (baseline direction):
- Use `FileField` + storage backend.
