<?php

use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
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
    Route::get('/dashboard', fn () => Inertia::render('Instructor/Dashboard'))->name('dashboard');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function (): void {
    Route::get('/dashboard', fn () => Inertia::render('Student/Dashboard'))->name('dashboard');
});
