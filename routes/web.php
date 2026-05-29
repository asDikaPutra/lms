<?php

use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CertificateVerificationController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\Instructor\AssignmentController as InstructorAssignmentController;
use App\Http\Controllers\Instructor\ContentController as InstructorContentController;
use App\Http\Controllers\Instructor\CourseController as InstructorCourseController;
use App\Http\Controllers\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Instructor\EnrollmentController as InstructorEnrollmentController;
use App\Http\Controllers\Instructor\MaterialController as InstructorMaterialController;
use App\Http\Controllers\Instructor\ModuleController as InstructorModuleController;
use App\Http\Controllers\Instructor\QuizAttemptController as InstructorQuizAttemptController;
use App\Http\Controllers\Instructor\QuizController as InstructorQuizController;
use App\Http\Controllers\Instructor\QuizQuestionController as InstructorQuizQuestionController;
use App\Http\Controllers\Instructor\SubmissionController as InstructorSubmissionController;
use App\Http\Controllers\Student\AssignmentController as StudentAssignmentController;
use App\Http\Controllers\Student\CertificateController;
use App\Http\Controllers\Student\ContentProgressController as StudentContentProgressController;
use App\Http\Controllers\Student\CourseController as StudentCourseController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\EnrollmentController as StudentEnrollmentController;
use App\Http\Controllers\Student\LeaderboardController as StudentLeaderboardController;
use App\Http\Controllers\Student\QuizAttemptController as StudentQuizAttemptController;
use App\Http\Controllers\Student\QuizController as StudentQuizController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route(auth()->user()->role.'.dashboard');
    }

    return redirect()->route('login');
});

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:10,1')->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::post('/materials/{material}/discussions', [DiscussionController::class, 'store'])->name('discussions.store');
    Route::delete('/discussions/{discussion}', [DiscussionController::class, 'destroy'])->name('discussions.destroy');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::post('/users/import-students', [AdminUserController::class, 'importStudents'])->name('users.import-students');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/toggle', [AdminUserController::class, 'toggle'])->name('users.toggle');

    Route::get('/courses', [AdminCourseController::class, 'index'])->name('courses.index');
    Route::put('/courses/{course}', [AdminCourseController::class, 'update'])->name('courses.update');
    Route::patch('/courses/{course}/toggle', [AdminCourseController::class, 'toggle'])->name('courses.toggle');
    Route::delete('/courses/{course}', [AdminCourseController::class, 'destroy'])->name('courses.destroy');
    Route::get('/reports/courses.csv', [AdminCourseController::class, 'export'])->name('reports.courses');
});

Route::middleware(['auth', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function (): void {
    Route::get('/dashboard', InstructorDashboardController::class)->name('dashboard');

    // Course management
    Route::get('/courses', [InstructorCourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [InstructorCourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [InstructorCourseController::class, 'show'])->name('courses.show');
    Route::put('/courses/{course}', [InstructorCourseController::class, 'update'])->name('courses.update');
    Route::patch('/courses/{course}/regenerate-code', [InstructorCourseController::class, 'regenerateCode'])->name('courses.regenerate-code');
    Route::patch('/courses/{course}/toggle', [InstructorCourseController::class, 'toggle'])->name('courses.toggle');
    Route::delete('/courses/{course}', [InstructorCourseController::class, 'destroy'])->name('courses.destroy');

    // Course workspace pages
    Route::get('/courses/{course}/curriculum', [InstructorCourseController::class, 'curriculum'])->name('courses.curriculum');
    Route::get('/courses/{course}/assignments', [InstructorCourseController::class, 'assignments'])->name('courses.assignments');
    Route::get('/courses/{course}/quizzes', [InstructorCourseController::class, 'quizzes'])->name('courses.quizzes');
    Route::get('/courses/{course}/discussions', [InstructorCourseController::class, 'discussions'])->name('courses.discussions');
    Route::get('/courses/{course}/students', [InstructorCourseController::class, 'students'])->name('courses.students');
    Route::get('/courses/{course}/grades', [InstructorCourseController::class, 'grades'])->name('courses.grades');
    Route::get('/courses/{course}/progress', [InstructorCourseController::class, 'progress'])->name('courses.progress');
    Route::get('/courses/{course}/settings', [InstructorCourseController::class, 'settings'])->name('courses.settings');
    Route::patch('/courses/{course}/settings', [InstructorCourseController::class, 'updateSettings'])->name('courses.settings.update');
    Route::patch('/courses/{course}/archive', [InstructorCourseController::class, 'archive'])->name('courses.archive');

    Route::patch('/courses/{course}/enrollments/{enrollment}/approve', [InstructorEnrollmentController::class, 'approve'])->name('enrollments.approve');
    Route::patch('/courses/{course}/enrollments/{enrollment}/reject', [InstructorEnrollmentController::class, 'reject'])->name('enrollments.reject');

    Route::post('/courses/{course}/modules', [InstructorModuleController::class, 'store'])->name('modules.store');
    Route::patch('/courses/{course}/modules/reorder', [InstructorModuleController::class, 'reorder'])->name('modules.reorder');
    Route::put('/modules/{module}', [InstructorModuleController::class, 'update'])->name('modules.update');
    Route::patch('/modules/{module}/toggle', [InstructorModuleController::class, 'toggle'])->name('modules.toggle');
    Route::delete('/modules/{module}', [InstructorModuleController::class, 'destroy'])->name('modules.destroy');

    Route::post('/modules/{module}/materials', [InstructorMaterialController::class, 'store'])->name('materials.store');
    Route::patch('/modules/{module}/materials/reorder', [InstructorMaterialController::class, 'reorder'])->name('materials.reorder');
    Route::put('/materials/{material}', [InstructorMaterialController::class, 'update'])->name('materials.update');
    Route::patch('/materials/{material}/toggle', [InstructorMaterialController::class, 'toggle'])->name('materials.toggle');
    Route::delete('/materials/{material}', [InstructorMaterialController::class, 'destroy'])->name('materials.destroy');

    Route::post('/materials/{material}/contents', [InstructorContentController::class, 'store'])->name('contents.store');
    Route::patch('/materials/{material}/contents/reorder', [InstructorContentController::class, 'reorder'])->name('contents.reorder');
    Route::put('/contents/{content}', [InstructorContentController::class, 'update'])->name('contents.update');
    Route::delete('/contents/{content}', [InstructorContentController::class, 'destroy'])->name('contents.destroy');

    Route::post('/quizzes', [InstructorQuizController::class, 'store'])->name('quizzes.store');
    Route::get('/quizzes/{quiz}/edit', [InstructorQuizController::class, 'edit'])->name('quizzes.edit');
    Route::put('/quizzes/{quiz}', [InstructorQuizController::class, 'update'])->name('quizzes.update');
    Route::patch('/quizzes/{quiz}/toggle', [InstructorQuizController::class, 'toggle'])->name('quizzes.toggle');
    Route::delete('/quizzes/{quiz}', [InstructorQuizController::class, 'destroy'])->name('quizzes.destroy');
    Route::post('/quizzes/{quiz}/questions', [InstructorQuizQuestionController::class, 'store'])->name('quiz-questions.store');
    Route::put('/quiz-questions/{question}', [InstructorQuizQuestionController::class, 'update'])->name('quiz-questions.update');
    Route::delete('/quiz-questions/{question}', [InstructorQuizQuestionController::class, 'destroy'])->name('quiz-questions.destroy');
    Route::put('/quiz-attempts/{attempt}/grade', [InstructorQuizAttemptController::class, 'grade'])->name('quiz-attempts.grade');

    Route::post('/assignments', [InstructorAssignmentController::class, 'store'])->name('assignments.store');
    Route::put('/assignments/{assignment}', [InstructorAssignmentController::class, 'update'])->name('assignments.update');
    Route::patch('/assignments/{assignment}/toggle', [InstructorAssignmentController::class, 'toggle'])->name('assignments.toggle');
    Route::delete('/assignments/{assignment}', [InstructorAssignmentController::class, 'destroy'])->name('assignments.destroy');

    Route::get('/submissions/assignment/{assignment}', [InstructorSubmissionController::class, 'show'])->name('submissions.show');
    Route::put('/submissions/{submission}/grade', [InstructorSubmissionController::class, 'grade'])->name('submissions.grade');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function (): void {
    Route::get('/dashboard', StudentDashboardController::class)->name('dashboard');
    Route::get('/assignments', [StudentAssignmentController::class, 'index'])->name('assignments.index');
    Route::post('/enrollments', [StudentEnrollmentController::class, 'store'])->name('enrollments.store');
    Route::get('/courses', [StudentCourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{course}', [StudentCourseController::class, 'show'])->name('courses.show');
    Route::patch('/contents/{content}/complete', [StudentContentProgressController::class, 'complete'])->name('contents.complete');

    // Quiz play flow (Quizizz-style)
    Route::get('/quizzes/{quiz}', [StudentQuizController::class, 'show'])->name('quizzes.show');
    Route::post('/quizzes/{quiz}/start', [StudentQuizController::class, 'start'])->name('quizzes.start');
    Route::get('/quiz-attempts/{attempt}/questions/{questionNumber}', [StudentQuizController::class, 'getQuestion'])->name('quizzes.get-question');
    Route::post('/quiz-attempts/{attempt}/questions/{questionNumber}/submit', [StudentQuizController::class, 'submitAnswer'])->name('quizzes.submit-answer');
    Route::post('/quiz-attempts/{attempt}/finish', [StudentQuizController::class, 'finish'])->name('quizzes.finish');
    Route::get('/quiz-attempts/{attempt}/result', [StudentQuizController::class, 'result'])->name('quizzes.result');

    Route::post('/quizzes/{quiz}/attempts', [StudentQuizAttemptController::class, 'store'])->name('quiz-attempts.store');
    Route::post('/assignments/{assignment}/submit', [StudentAssignmentController::class, 'store'])->name('assignments.submit');

    // Certificates
    Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');
    Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');
    Route::post('/courses/{course}/certificates/request', [CertificateController::class, 'request'])->name('certificates.request');

    // Leaderboard
    Route::get('/leaderboard', [StudentLeaderboardController::class, 'index'])->name('leaderboard');
});

// Public certificate verification
Route::get('/verify-certificate', [CertificateVerificationController::class, 'index'])->name('certificate.verify');
Route::post('/verify-certificate', [CertificateVerificationController::class, 'verify'])->name('certificate.verify.check');
