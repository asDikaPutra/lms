<?php

use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Instructor\ContentController as InstructorContentController;
use App\Http\Controllers\Instructor\CourseController as InstructorCourseController;
use App\Http\Controllers\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Instructor\EnrollmentController as InstructorEnrollmentController;
use App\Http\Controllers\Instructor\MaterialController as InstructorMaterialController;
use App\Http\Controllers\Instructor\ModuleController as InstructorModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route(auth()->user()->role.'.dashboard');
    }

    return redirect()->route('login');
});

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
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
    Route::get('/reports/courses.csv', [AdminCourseController::class, 'export'])->name('reports.courses');
});

Route::middleware(['auth', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function (): void {
    Route::get('/dashboard', InstructorDashboardController::class)->name('dashboard');
    Route::get('/courses', [InstructorCourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [InstructorCourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [InstructorCourseController::class, 'show'])->name('courses.show');
    Route::put('/courses/{course}', [InstructorCourseController::class, 'update'])->name('courses.update');
    Route::patch('/courses/{course}/regenerate-code', [InstructorCourseController::class, 'regenerateCode'])->name('courses.regenerate-code');
    Route::patch('/courses/{course}/toggle', [InstructorCourseController::class, 'toggle'])->name('courses.toggle');

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
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function (): void {
    Route::get('/dashboard', fn () => Inertia::render('Student/Dashboard'))->name('dashboard');
});
