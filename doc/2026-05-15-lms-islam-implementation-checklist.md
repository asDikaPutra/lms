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
- [ ] Install Laravel 13 project.
- [ ] Install Inertia Laravel adapter.
- [ ] Install React, React DOM, Inertia React.
- [ ] Configure Vite React.
- [ ] Configure root Blade template for Inertia.
- [ ] Install Tailwind CSS.
- [ ] Install Shadcn/UI.
- [ ] Configure path aliases for React components.
- [ ] Run local dev server successfully.
- [ ] Confirm first Inertia page renders.

### 2. Base App Structure
- [ ] Create controller folders: `Admin`, `Instructor`, `Student`, `Auth`.
- [ ] Create React page folders: `Admin`, `Instructor`, `Student`, `Auth`.
- [ ] Create shared layout/components folders.
- [ ] Create base flash message handling.
- [ ] Create shared Inertia auth props.

**Quality Gate**
- [ ] `npm run build` works.
- [ ] Laravel app boots without error.
- [ ] Tailwind version detected and setup matches version.
- [ ] No landing page as primary authenticated experience.

---

## Phase 2 — Database, Models, and Domain Foundation

### 1. Users & Auth Fields
- [ ] Update users migration: role, nim, nidn, avatar, is_active.
- [ ] Update User model fillable/casts/helpers.
- [ ] Add user factory states: admin, instructor, student.
- [ ] Add initial admin seeder.

### 2. Courses & Enrollments
- [ ] Create courses migration.
- [ ] Include `leaderboard_enabled`.
- [ ] Include `certificate_criteria`.
- [ ] Create enrollments migration.
- [ ] Add unique constraint `user_id + course_id`.
- [ ] Add indexes for active/pending enrollment queries.
- [ ] Create Course and Enrollment models.
- [ ] Add relationships and query scopes.

### 3. Learning Content
- [ ] Create modules migration.
- [ ] Create materials migration.
- [ ] Create contents migration.
- [ ] Add order indexes per parent.
- [ ] Create Module, Material, Content models.
- [ ] Add published scopes.

### 4. Activities
- [ ] Create quizzes migration with morph fields.
- [ ] Create quiz_questions migration.
- [ ] Create quiz_attempts migration with `status`.
- [ ] Create assignments migration with morph fields.
- [ ] Create submissions migration with `status`.
- [ ] Create discussions migration with `parent_id`.
- [ ] Create certificates migration.
- [ ] Create content_progress migration.
- [ ] Create all related models and relationships.
- [ ] Register morph map for `module` and `material`.

**Quality Gate**
- [ ] `php artisan migrate:fresh --seed` works.
- [ ] Foreign keys and cascade behavior verified.
- [ ] Composite indexes exist for frequent queries.
- [ ] Models use explicit `$fillable` and `$casts`.
- [ ] Development prevents lazy loading where appropriate.

---

## Phase 3 — Authentication, Authorization, and Security Base

### 1. Auth
- [ ] Login page.
- [ ] Logout action.
- [ ] Session regeneration after login.
- [ ] Inactive user blocked.
- [ ] Redirect by role.
- [ ] Login throttling/rate limiting.

### 2. Middleware & Policies
- [ ] Role middleware.
- [ ] CoursePolicy.
- [ ] ModulePolicy.
- [ ] MaterialPolicy.
- [ ] QuizPolicy.
- [ ] AssignmentPolicy.
- [ ] DiscussionPolicy.
- [ ] CertificatePolicy if needed.

### 3. Security Baseline
- [ ] `.env` excluded from source control.
- [ ] File upload validation rules defined.
- [ ] Inertia shared props reviewed for sensitive data.
- [ ] No route relies on frontend-only role checks.
- [ ] Security headers strategy documented.

**Quality Gate**
- [ ] Admin cannot access instructor/student-only mutation incorrectly.
- [ ] Instructor cannot edit another instructor's course.
- [ ] Student cannot access non-enrolled course content.
- [ ] Guest cannot access dashboards.

---

## Phase 4 — Admin Panel

### 1. Admin Layout & Dashboard
- [ ] Admin layout with sidebar navigation.
- [ ] Dashboard stats: total users, instructors, students, courses, active enrollments, pending enrollments.
- [ ] Admin route group.
- [ ] Responsive dashboard UI.

### 2. User Management
- [ ] User index with search/filter by role/status.
- [ ] Create user.
- [ ] Edit user.
- [ ] Activate/deactivate user.
- [ ] Import students via CSV.
- [ ] Validation and import error reporting.

### 3. Course Administration
- [ ] List all courses.
- [ ] Assign instructor to course.
- [ ] Archive/deactivate course.
- [ ] Export global report.

**Quality Gate**
- [ ] Admin actions are policy/middleware protected.
- [ ] Import handles invalid rows gracefully.
- [ ] Listing uses pagination.

---

## Phase 5 — Instructor Panel

### 1. Instructor Dashboard
- [ ] Course cards for owned courses.
- [ ] Pending enrollment count.
- [ ] Submissions/quiz attempts needing grading.
- [ ] Student progress highlights.

### 2. Course Management
- [ ] Create course.
- [ ] Edit course.
- [ ] Generate enroll code.
- [ ] Toggle enrollment mode: auto/manual.
- [ ] Toggle leaderboard.
- [ ] Set certificate criteria.

### 3. Enrollment Approval
- [ ] Pending enrollment list.
- [ ] Approve enrollment.
- [ ] Reject enrollment.
- [ ] Notify student.
- [ ] Allow rejected student to request again.

### 4. Module, Material, Content Builder
- [ ] Create/edit/delete module.
- [ ] Publish/unpublish module.
- [ ] Create/edit/delete material.
- [ ] Publish/unpublish material.
- [ ] Create article content.
- [ ] Add YouTube video content.
- [ ] Upload audio/pdf/file content.
- [ ] Reorder modules/materials/contents.
- [ ] Preview learning sequence as student.

**Quality Gate**
- [ ] Instructor can only manage owned courses.
- [ ] Published student view only shows published modules/materials/content.
- [ ] Content builder preserves required sequence: contents, quiz, assignment, discussion.
- [ ] File upload limit and MIME checks enforced.

---

## Phase 6 — Student Panel

### 1. Student Dashboard
- [ ] Dashboard follows mockup direction.
- [ ] Greeting and profile summary.
- [ ] Search courses/materials.
- [ ] Stats: courses, progress, assignments due, certificates.
- [ ] Course cards with progress.
- [ ] Upcoming assignments.
- [ ] Mobile responsive layout.

### 2. Enrollment
- [ ] Join course by enroll code.
- [ ] Auto enrollment activates immediately.
- [ ] Manual enrollment becomes pending.
- [ ] Rejected enrollment can be resubmitted.
- [ ] Student sees pending/rejected state clearly.

### 3. Learning Experience
- [ ] Course detail page.
- [ ] Module/material navigation.
- [ ] Render article/video/audio/pdf/file content.
- [ ] Mark content complete.
- [ ] Track `content_progress`.
- [ ] Show material discussion.
- [ ] Show module/material quiz and assignment in correct order.

**Quality Gate**
- [ ] Student cannot access inactive or non-enrolled courses.
- [ ] Progress calculation matches `completed_contents / total_published_contents`.
- [ ] UI remains usable on mobile.

---

## Phase 7 — Quiz System

### 1. Instructor Quiz Builder
- [ ] Create quiz for module.
- [ ] Create quiz for material.
- [ ] Add multiple choice question.
- [ ] Add true/false question.
- [ ] Add essay question.
- [ ] Configure duration, passing score, result mode.
- [ ] Publish/unpublish quiz.

### 2. Student Quiz Attempt
- [ ] Show quiz instructions.
- [ ] Submit answers.
- [ ] Auto-grade objective questions.
- [ ] Essay attempts become `submitted`.
- [ ] Objective-only attempts become `graded`.
- [ ] Result display respects `result_mode`.

### 3. Grading
- [ ] Instructor sees attempts needing grading.
- [ ] Instructor grades essay answers.
- [ ] Final score recalculated.
- [ ] Student notified when result released.

**Quality Gate**
- [ ] Attempt access limited to enrolled students.
- [ ] Instructor cannot grade attempts outside owned courses.
- [ ] Test covers auto scoring and essay pending flow.

---

## Phase 8 — Assignment System

### 1. Instructor Assignment
- [ ] Create assignment for module.
- [ ] Create assignment for material.
- [ ] Configure deadline.
- [ ] Configure allow file/link.
- [ ] Publish/unpublish assignment.

### 2. Student Submission
- [ ] Submit file.
- [ ] Submit link.
- [ ] Submit file and link if both allowed.
- [ ] Late submission marked `late`.
- [ ] Student can update submission if MVP allows.

### 3. Grading
- [ ] Instructor views submissions.
- [ ] Instructor adds grade and feedback.
- [ ] Submission status becomes `graded`.
- [ ] Student gets notification.

**Quality Gate**
- [ ] Upload validation enforced.
- [ ] Submission unique per student per assignment.
- [ ] Deadline behavior documented and tested.

---

## Phase 9 — Discussion Forum

- [ ] Discussion post per material.
- [ ] One-level reply using `parent_id`.
- [ ] Delete own post.
- [ ] Instructor/admin can moderate if policy allows.
- [ ] Notify previous posters except current author.
- [ ] Discussion UI has accessible form labels and states.

**Quality Gate**
- [ ] Only enrolled students/dosen pemilik/admin can participate.
- [ ] Reply belongs to the same material as parent.
- [ ] No unescaped rich HTML from user posts.

---

## Phase 10 — Notifications, Queue, and Scheduler

- [ ] Configure database queue.
- [ ] Create queue tables.
- [ ] Enrollment requested notification.
- [ ] Enrollment approved notification.
- [ ] Enrollment rejected notification.
- [ ] Course/module/quiz/assignment published notifications as scoped MVP allows.
- [ ] Assignment graded notification.
- [ ] Deadline H-1 reminder command.
- [ ] Scheduler registered.
- [ ] Hostinger cron notes added.
- [ ] Queue worker/cron fallback documented.

**Quality Gate**
- [ ] Notifications use queue.
- [ ] No duplicate notification spam for repeated actions.
- [ ] Deadline reminders skip submitted/graded submissions.

---

## Phase 11 — Certificates and Leaderboard

### 1. Certificate
- [ ] Store course certificate criteria.
- [ ] Evaluate student eligibility.
- [ ] Issue certificate.
- [ ] Snapshot criteria into certificate row.
- [ ] Generate verify code.
- [ ] Public verification route.
- [ ] Student download page.

### 2. Leaderboard
- [ ] Toggle leaderboard per course.
- [ ] Hide leaderboard when disabled.
- [ ] Calculate score from graded quiz and assignment.
- [ ] Include module-level and material-level activities.
- [ ] Handle courses with only quiz or only assignment.

**Quality Gate**
- [ ] Certificate criteria stable after issuance.
- [ ] Leaderboard excludes ungraded attempts/submissions.
- [ ] Student can only see leaderboard for enrolled course.

---

## Phase 12 — Video Manager

- [ ] YouTube URL validation.
- [ ] Extract video ID.
- [ ] Generate embed URL.
- [ ] Generate thumbnail URL.
- [ ] Preview component.
- [ ] Use selected video in content builder.
- [ ] Block non-YouTube/internal/private URL abuse.

**Quality Gate**
- [ ] URL parser handles `youtube.com/watch?v=` and `youtu.be/`.
- [ ] SSRF risk avoided by not fetching arbitrary user URLs.
- [ ] Video render works on student content page.

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
| Phase 1 — Setup | `[ ]` | |
| Phase 2 — Database | `[ ]` | |
| Phase 3 — Auth/Security | `[ ]` | |
| Phase 4 — Admin | `[ ]` | |
| Phase 5 — Instructor | `[ ]` | |
| Phase 6 — Student | `[ ]` | |
| Phase 7 — Quiz | `[ ]` | |
| Phase 8 — Assignment | `[ ]` | |
| Phase 9 — Discussion | `[ ]` | |
| Phase 10 — Notifications | `[ ]` | |
| Phase 11 — Certificate/Leaderboard | `[ ]` | |
| Phase 12 — Video Manager | `[ ]` | |
| Phase 13 — UI/A11y | `[ ]` | |
| Phase 14 — Testing/QA | `[ ]` | |
| Phase 15 — Deployment | `[ ]` | |

---

## Next Immediate Actions

1. Install Inertia React and configure Inertia middleware.
2. Confirm Tailwind v4 setup and install Shadcn/UI.
3. Create baseline dashboard route to verify stack.
4. Update this checklist after each completed task.
