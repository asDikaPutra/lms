# LMS Islam Fakultas — Implementation Checklist
**Date:** 2026-05-15  
**Status:** Active Implementation Tracker  
**Workspace:** `D:\Dika\lms`

Dokumen ini dipakai untuk memantau progres implementasi LMS Islam Fakultas. Checklist ini mengikuti:
- `2026-05-15-lms-islam-design.md`
- `2026-05-15-lms-islam-refinement.md`
- `2026-05-15-lms-islam-plan.md`

Skill yang dipakai sebagai guardrail implementasi:
- `laravel-best-practices`
- `laravel-inertia-react`
- `laravel-database-optimization`
- `laravel-owasp-security`
- `laravel-testing`
- `php-best-practices`
- `react-vite-best-practices`
- `tailwind-best-practices`
- `web-design-guidelines`
- `e2e-playwright-testing`

---

## Status Legend

| Status | Arti |
|--------|------|
| `[ ]` | Belum dimulai |
| `[~]` | Sedang dikerjakan |
| `[x]` | Selesai |
| `[!]` | Perlu revisi / blocked |

---

## Global Definition of Done

- [ ] Semua route mutasi data dilindungi `auth`, role middleware, dan policy/ownership check.
- [ ] Semua input penting memakai validation/Form Request.
- [ ] Semua query dashboard/listing menghindari N+1 dengan eager loading atau aggregate query.
- [ ] Semua file upload membatasi ukuran, MIME type, dan lokasi storage.
- [ ] Semua Inertia props hanya mengirim data yang perlu dilihat browser.
- [ ] UI responsif untuk desktop dan mobile.
- [ ] Form memiliki label, error state, loading state, dan feedback sukses/gagal.
- [ ] Test minimal tersedia untuk auth, enrollment, course builder, quiz, assignment, progress, certificate, dan authorization.
- [ ] `composer test` atau test command project berjalan hijau.
- [ ] `npm run build` berhasil.
- [ ] Deployment notes Hostinger siap: `.env`, queue database, scheduler cron, storage link.

---

## Phase 0 — Pre-Implementation Baseline

- [x] Design document dibaca.
- [x] Implementation plan dibaca.
- [x] Refinement document dibuat.
- [x] Skill implementasi terkait terpasang dan siap dipakai.
- [x] Scope MVP dikunci: LMS internal, bukan marketplace/payment.
- [x] Schema refinement dikunci: progress, certificate criteria, leaderboard toggle, discussion reply, status attempts/submissions.
- [x] Repository/project Laravel dibuat.
- [x] Git repository diinisialisasi.
- [x] Baseline commit dibuat.

**Quality Gate**
- [x] Dokumen `design`, `refinement`, `plan`, dan `checklist` konsisten.
- [x] Tidak ada fitur non-MVP masuk ke backlog implementasi awal.

---

## Phase 1 — Project Setup & Foundation

### 1. Laravel + Inertia + React Setup
- [x] Install Laravel 13 project.
- [x] Install Inertia Laravel adapter.
- [x] Install React, React DOM, Inertia React.
- [x] Configure Vite React.
- [x] Configure root Blade template for Inertia.
- [x] Install Tailwind CSS.
- [x] Install Shadcn/UI.
- [x] Configure path aliases for React components.
- [x] Run local dev server successfully.
- [x] Confirm first Inertia page renders.

### 2. Base App Structure
- [x] Create controller folders: `Admin`, `Instructor`, `Student`, `Auth`.
- [x] Create React page folders: `Admin`, `Instructor`, `Student`, `Auth`.
- [x] Create shared layout/components folders.
- [x] Create base flash message handling.
- [x] Create shared Inertia auth props.

**Quality Gate**
- [x] `npm run build` works.
- [x] Laravel app boots without error.
- [x] Tailwind version detected and setup matches version.
- [x] No landing page as primary authenticated experience.

---

## Phase 2 — Database, Models, and Domain Foundation

### 1. Users & Auth Fields
- [x] Update users migration: role, nim, nidn, avatar, is_active.
- [x] Update User model fillable/casts/helpers.
- [x] Add user factory states: admin, instructor, student.
- [x] Add initial admin seeder.

### 2. Courses & Enrollments
- [x] Create courses migration.
- [x] Include `leaderboard_enabled`.
- [x] Include `certificate_criteria`.
- [x] Create enrollments migration.
- [x] Add unique constraint `user_id + course_id`.
- [x] Add indexes for active/pending enrollment queries.
- [x] Create Course and Enrollment models.
- [x] Add relationships and query scopes.

### 3. Learning Content
- [x] Create modules migration.
- [x] Create materials migration.
- [x] Create contents migration.
- [x] Add order indexes per parent.
- [x] Create Module, Material, Content models.
- [x] Add published scopes.

### 4. Activities
- [x] Create quizzes migration with morph fields.
- [x] Create quiz_questions migration.
- [x] Create quiz_attempts migration with `status`.
- [x] Create assignments migration with morph fields.
- [x] Create submissions migration with `status`.
- [x] Create discussions migration with `parent_id`.
- [x] Create certificates migration.
- [x] Create content_progress migration.
- [x] Create all related models and relationships.
- [x] Register morph map for `module` and `material`.

**Quality Gate**
- [x] `php artisan migrate:fresh --seed` works.
- [x] Foreign keys and cascade behavior verified.
- [x] Composite indexes exist for frequent queries.
- [x] Models use explicit `$fillable` and `$casts`.
- [x] Development prevents lazy loading where appropriate.

---

## Phase 3 — Authentication, Authorization, and Security Base

### 1. Auth
- [x] Login page.
- [x] Logout action.
- [x] Session regeneration after login.
- [x] Inactive user blocked.
- [x] Redirect by role.
- [x] Login throttling/rate limiting.

### 2. Middleware & Policies
- [x] Role middleware.
- [x] CoursePolicy.
- [x] ModulePolicy.
- [x] MaterialPolicy.
- [x] QuizPolicy.
- [x] AssignmentPolicy.
- [x] DiscussionPolicy.
- [x] CertificatePolicy not required yet; certificate routes will authorize through course ownership when implemented.

### 3. Security Baseline
- [x] `.env` excluded from source control.
- [x] File upload validation rules defined.
- [x] Inertia shared props reviewed for sensitive data.
- [x] No route relies on frontend-only role checks.
- [x] Security headers strategy documented.

**Quality Gate**
- [x] Admin cannot access instructor/student-only mutation incorrectly.
- [x] Instructor cannot edit another instructor's course.
- [x] Student cannot access non-enrolled course content.
- [x] Guest cannot access dashboards.

---

## Phase 4 — Admin Panel

### 1. Admin Layout & Dashboard
- [x] Admin layout with sidebar navigation.
- [x] Dashboard stats: total users, instructors, students, courses, active enrollments, pending enrollments.
- [x] Admin route group.
- [x] Responsive dashboard UI.

### 2. User Management
- [x] User index with search/filter by role/status.
- [x] Create user.
- [x] Edit user.
- [x] Activate/deactivate user.
- [x] Import students via CSV.
- [x] Validation and import error reporting.

### 3. Course Administration
- [x] List all courses.
- [x] Assign instructor to course.
- [x] Archive/deactivate course.
- [x] Export global report.

**Quality Gate**
- [x] Admin actions are policy/middleware protected.
- [x] Import handles invalid rows gracefully.
- [x] Listing uses pagination.

---

## Phase 5 — Instructor Panel

### 1. Instructor Dashboard
- [x] Course cards for owned courses.
- [x] Pending enrollment count.
- [x] Submissions/quiz attempts needing grading.
- [ ] Student progress highlights.

### 2. Course Management
- [x] Create course.
- [x] Edit course.
- [x] Generate enroll code.
- [x] Toggle enrollment mode: auto/manual.
- [x] Toggle leaderboard.
- [x] Set certificate criteria.

### 3. Enrollment Approval
- [x] Pending enrollment list.
- [x] Approve enrollment.
- [x] Reject enrollment.
- [ ] Notify student.
- [ ] Allow rejected student to request again.

### 4. Module, Material, Content Builder
- [~] Create/edit/delete module.
- [x] Publish/unpublish module.
- [~] Create/edit/delete material.
- [x] Publish/unpublish material.
- [x] Create article content.
- [x] Add YouTube video content.
- [x] Upload audio/pdf/file content.
- [~] Reorder modules/materials/contents.
- [ ] Preview learning sequence as student.

**Quality Gate**
- [x] Instructor can only manage owned courses.
- [ ] Published student view only shows published modules/materials/content.
- [ ] Content builder preserves required sequence: contents, quiz, assignment, discussion.
- [x] File upload limit and MIME checks enforced.

---

## Phase 6 — Student Panel

### 1. Student Dashboard
- [x] Dashboard follows mockup direction.
- [x] Greeting and profile summary.
- [x] Search courses/materials.
- [x] Stats: courses, progress, assignments due, certificates.
- [x] Course cards with progress.
- [x] Upcoming assignments.
- [x] Mobile responsive layout.

### 2. Enrollment
- [x] Join course by enroll code.
- [x] Auto enrollment activates immediately.
- [x] Manual enrollment becomes pending.
- [x] Rejected enrollment can be resubmitted.
- [x] Student sees pending/rejected state clearly.

### 3. Learning Experience
- [x] Course detail page.
- [x] Module/material navigation.
- [x] Render article/video/audio/pdf/file content.
- [x] Mark content complete.
- [x] Track `content_progress`.
- [ ] Show material discussion.
- [ ] Show module/material quiz and assignment in correct order.

**Quality Gate**
- [x] Student cannot access inactive or non-enrolled courses.
- [x] Progress calculation matches `completed_contents / total_published_contents`.
- [x] UI remains usable on mobile.

---

## Phase 7 — Quiz System

### 1. Instructor Quiz Builder
- [x] Create quiz for module.
- [x] Create quiz for material.
- [x] Add multiple choice question.
- [x] Add true/false question.
- [x] Add essay question.
- [x] Configure duration, passing score, result mode.
- [x] Publish/unpublish quiz.

### 2. Student Quiz Attempt
- [x] Show quiz instructions.
- [x] Submit answers.
- [x] Auto-grade objective questions.
- [x] Essay attempts become `submitted`.
- [x] Objective-only attempts become `graded`.
- [x] Result display respects `result_mode`.

### 3. Grading
- [x] Instructor sees attempts needing grading.
- [x] Instructor grades essay answers.
- [x] Final score recalculated.
- [ ] Student notified when result released.

**Quality Gate**
- [x] Attempt access limited to enrolled students.
- [x] Instructor cannot grade attempts outside owned courses.
- [x] Test covers auto scoring and essay pending flow.

---

## Phase 8 — Assignment System

### 1. Instructor Assignment
- [x] Create assignment for module.
- [x] Create assignment for material.
- [x] Configure deadline.
- [x] Configure allow file/link.
- [x] Publish/unpublish assignment.

### 2. Student Submission
- [x] Submit file.
- [x] Submit link.
- [x] Submit file and link if both allowed.
- [x] Late submission marked `late`.
- [x] Student can update submission if MVP allows.

### 3. Grading
- [x] Instructor views submissions.
- [x] Instructor adds grade and feedback.
- [x] Submission status becomes `graded`.
- [ ] Student gets notification.

**Quality Gate**
- [x] Upload validation enforced.
- [x] Submission unique per student per assignment.
- [x] Deadline behavior documented and tested.

---

## Phase 9 — Discussion Forum

- [x] Discussion post per material.
- [x] One-level reply using `parent_id`.
- [x] Delete own post.
- [x] Instructor/admin can moderate if policy allows.
- [ ] Notify previous posters except current author (deferred to Phase 10).
- [x] Discussion UI has accessible form labels and states.
- [x] Discussion displayed as activity item (like Quiz/Assignment).
- [x] Student view: collapsible discussion block with expand/collapse.
- [x] Instructor view: clickable discussion item opens modal.
- [x] Discussion counter shows total number of posts.

**Quality Gate**
- [x] Only enrolled students/dosen pemilik/admin can participate.
- [x] Reply belongs to the same material as parent.
- [x] No unescaped rich HTML from user posts.
- [x] Discussion follows activity item pattern (not embedded in expanded material).
- [x] UI is intuitive and easy to find.

---

## Phase 10 — Notifications, Queue, and Scheduler

- [x] Configure database queue.
- [x] Create queue tables.
- [x] Enrollment requested notification.
- [x] Enrollment approved notification.
- [x] Enrollment rejected notification.
- [x] Assignment graded notification.
- [x] Quiz graded notification (essay).
- [x] Discussion reply notification.
- [x] Assignment deadline H-1 reminder command.
- [x] Scheduler registered.
- [x] Hostinger cron notes added.
- [x] Queue worker/cron fallback documented.

**Quality Gate**
- [x] Notifications use queue.
- [x] No duplicate notification spam for repeated actions.
- [x] Deadline reminders skip submitted/graded submissions.

---

## Phase 11 — Certificates and Leaderboard

### 1. Certificate
- [x] Store course certificate criteria.
- [x] Evaluate student eligibility.
- [x] Issue certificate.
- [x] Snapshot criteria into certificate row.
- [x] Generate verify code.
- [x] Public verification route.
- [x] Student download page.

### 2. Leaderboard
- [x] Toggle leaderboard per course.
- [x] Hide leaderboard when disabled.
- [x] Calculate score from graded quiz and assignment.
- [x] Include module-level and material-level activities.
- [x] Handle courses with only quiz or only assignment.

**Quality Gate**
- [x] Certificate criteria stable after issuance.
- [x] Leaderboard excludes ungraded attempts/submissions.
- [x] Student can only see leaderboard for enrolled course.

---

## Phase 12 — Video Manager

- [x] YouTube URL validation.
- [x] Extract video ID.
- [x] Generate embed URL.
- [x] Generate thumbnail URL.
- [x] Preview component.
- [x] Use selected video in content builder.
- [x] Block non-YouTube/internal/private URL abuse.

**Quality Gate**
- [x] URL parser handles `youtube.com/watch?v=` and `youtu.be/`.
- [x] SSRF risk avoided by not fetching arbitrary user URLs.
- [x] Video render works on student content page.

---

## Phase 13 — UI Polish and Accessibility

- [ ] Shared layouts for Admin, Instructor, Student.
- [ ] Icon-only sidebar with labels/tooltips.
- [ ] Responsive mobile navigation.
- [ ] Form components consistent.
- [ ] Empty states.
- [ ] Loading states.
- [ ] Error states.
- [ ] Accessible labels and `aria-describedby` for errors.
- [ ] Keyboard navigation tested for core flows.
- [ ] Color contrast checked.
- [ ] Reduced motion respected for animations.

**Quality Gate**
- [ ] UI aligns with mockup mood without blocking workflow.
- [ ] No overlapping text/components across desktop/mobile.
- [ ] No button text overflow.

---

## Phase 14 — Testing and QA

### Backend Feature Tests
- [ ] Auth login/logout.
- [ ] Role middleware.
- [ ] Admin user management.
- [ ] Course CRUD ownership.
- [ ] Enrollment auto/manual/rejected-resubmit.
- [ ] Content builder authorization.
- [ ] Content progress.
- [ ] Quiz auto grading.
- [ ] Assignment submission/grading.
- [ ] Discussion post/reply authorization.
- [ ] Certificate eligibility.
- [ ] Leaderboard visibility and scoring.

### Frontend/E2E Smoke Tests
- [ ] Login as admin.
- [ ] Login as instructor.
- [ ] Login as student.
- [ ] Instructor creates course/module/material/content.
- [ ] Student joins course and completes content.
- [ ] Student submits quiz/tugas.
- [ ] Instructor grades submission.
- [ ] Student sees result/progress.

### Security QA
- [ ] `composer audit`.
- [ ] `npm audit`.
- [ ] OWASP access control spot check.
- [ ] Inertia props data exposure check.
- [ ] File upload security check.

**Quality Gate**
- [ ] Test suite green.
- [ ] Production build green.
- [ ] Manual smoke test passed in browser.

---

## Phase 15 — Deployment Preparation

- [ ] `.env.example` production values documented.
- [ ] Hostinger MySQL config documented.
- [ ] Mail SMTP config documented.
- [ ] Queue database config documented.
- [ ] Scheduler cron command documented.
- [ ] Queue cron fallback documented.
- [ ] `storage:link` documented.
- [ ] `config:cache`, `route:cache`, `view:cache` documented.
- [ ] Production asset build verified.
- [ ] Admin seed credential changed from default before production.

**Quality Gate**
- [ ] Deployment checklist can be followed without guessing.
- [ ] No secrets committed.
- [ ] App can run from shared hosting constraints.

---

## Progress Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 — Baseline | `[x]` | Laravel 13 project created and baseline verified |
| Phase 1 — Setup | `[x]` | Inertia React, Tailwind v4, and Shadcn baseline ready |
| Phase 2 — Database | `[x]` | Core LMS schema, models, factories, seeders, and domain test ready |
| Phase 3 — Auth/Security | `[x]` | Login/logout, role middleware, policies, security headers, and access tests ready |
| Phase 4 — Admin | `[x]` | Admin dashboard, user management, CSV import, course administration, and course CSV export ready |
| Phase 5 — Instructor | `[~]` | Instructor dashboard, course management, enrollment approval, and content-builder foundation ready; notification/student-resubmit/full learning preview deferred to linked phases |
| Phase 6 — Student | `[~]` | Student dashboard, enrollment, published course view, content rendering, and progress tracking ready; discussion and activity sequence continue in Phase 7-9 |
| Phase 7 — Quiz | `[~]` | Quiz builder, published student attempt flow, objective auto-grading, essay grading, final-score recalculation, and result-mode score hiding ready; student result notification deferred to Phase 10 |
| Phase 8 — Assignment | `[x]` | Instructor CRUD, student submission, grading ready; notification deferred to Phase 10 |
| Phase 9 — Discussion | `[x]` | Discussion post/reply/delete, activity item UI pattern (student collapsible, instructor modal), discussion counter ready; notification deferred to Phase 10 |
| Phase 10 — Notifications | `[x]` | Enrollment, grading, discussion reply notifications; deadline reminder command; scheduler configured; deployment guide ready |
| Phase 11 — Certificate/Leaderboard | `[x]` | Certificate eligibility evaluation, issuance with verify code, public verification; leaderboard scoring with toggle, best attempt logic ready |
| Phase 12 — Video Manager | `[x]` | YouTube URL validation, video ID extraction, embed/thumbnail generation, live preview in content builder, VideoPlayer component for students |
| Phase 13 — UI/A11y | `[ ]` | |
| Phase 14 — Testing/QA | `[ ]` | |
| Phase 15 — Deployment | `[ ]` | |

---

## Next Immediate Actions

1. Start Phase 13 — UI Polish and Accessibility.
2. Implement shared layouts, empty states, loading states, and error states.
3. Run accessibility audit on core flows.
