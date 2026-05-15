# LMS Islam Fakultas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun platform LMS berbasis web untuk kebutuhan internal fakultas dengan mata kuliah Islam, menggunakan Laravel 13 + Inertia.js + React.

**Architecture:** Monolith modular — Laravel 13 sebagai backend + routing, Inertia.js sebagai jembatan ke React frontend, semua dalam satu codebase dan satu deployment di shared hosting Hostinger.

**Tech Stack:** Laravel 13, Inertia.js, React, Tailwind CSS, Shadcn/UI, MySQL, Laravel Mail + Queue (database driver), YouTube embed

---

## Phase 0: Pre-Implementation Refinement

> **Required before Task 1:** baca `2026-05-15-lms-islam-refinement.md` dan jadikan sebagai baseline final untuk keputusan yang belum terkunci di plan awal.

- [ ] **Step 1: Kunci scope MVP**

Pastikan implementasi awal hanya mencakup LMS internal fakultas: admin, dosen, mahasiswa, kursus, modul, materi, konten, quiz, tugas, diskusi, progress, leaderboard, sertifikat, email queue, dan deployment Hostinger.

Tunda marketplace, payment, multi-fakultas, subscription, dan mobile app native.

- [ ] **Step 2: Terapkan koreksi schema sebelum migration**

Tambahkan sejak awal:
- `courses.leaderboard_enabled`
- `courses.certificate_criteria`
- `discussions.parent_id`
- tabel `content_progress`
- `quiz_attempts.status`
- `submissions.status`
- Laravel morph map untuk alias `module` dan `material`

- [ ] **Step 3: Terapkan authorization guardrails**

Sebelum controller mutasi data selesai, buat policy minimal untuk `Course`, `Module`, `Material`, `Quiz`, `Assignment`, dan `Discussion`.

- [ ] **Step 4: Terapkan UI baseline dari mockup**

Dashboard harus mengikuti arah visual `example-mockup.png`: sidebar icon-only gelap, area konten terang, kartu statistik, course cards dengan progress, upcoming assignments, dan layout responsif.

---

## Phase 1: Project Setup & Foundation

---

### Task 1: Install Laravel 13 + Inertia.js + React

**Files:**
- Create: `composer.json` (via Laravel installer)
- Create: `package.json`
- Create: `vite.config.js`
- Create: `resources/js/app.jsx`
- Create: `resources/js/Pages/` (direktori)

- [ ] **Step 1: Buat project Laravel 13 baru**

```bash
composer create-project laravel/laravel lms-islam
cd lms-islam
```

- [ ] **Step 2: Install Inertia.js server-side adapter**

```bash
composer require inertiajs/inertia-laravel
```

- [ ] **Step 3: Buat Inertia middleware**

```bash
php artisan inertia:middleware
```

Tambahkan ke `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
    ]);
})
```

- [ ] **Step 4: Install Inertia.js client-side + React**

```bash
npm install @inertiajs/react react react-dom
npm install --save-dev @vitejs/plugin-react
```

- [ ] **Step 5: Update vite.config.js**

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});
```

- [ ] **Step 6: Update resources/js/app.jsx**

```jsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    resolve: name => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

- [ ] **Step 7: Update root blade template**

Buat `resources/views/app.blade.php`:
```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title inertia>{{ config('app.name') }}</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

- [ ] **Step 8: Install Tailwind CSS**

```bash
npm install tailwindcss @tailwindcss/vite
```

Update `vite.config.js` tambahkan tailwindcss plugin:
```js
import tailwindcss from '@tailwindcss/vite';
// tambahkan tailwindcss() ke plugins array
```

Buat `resources/css/app.css`:
```css
@import "tailwindcss";
```

Update `app.jsx` tambahkan import css:
```js
import '../css/app.css';
```

- [ ] **Step 9: Install Shadcn/UI**

```bash
npx shadcn@latest init
```

Pilih: React, Tailwind, default style.

- [ ] **Step 10: Test setup berjalan**

```bash
npm run dev
php artisan serve
```

Buka `http://localhost:8000` — harus tampil halaman Laravel default.

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: setup Laravel 13 + Inertia.js + React + Tailwind + Shadcn"
```

---

### Task 2: Database Migration — Users & Auth

**Files:**
- Modify: `database/migrations/xxxx_create_users_table.php`
- Create: `app/Models/User.php`

- [ ] **Step 1: Update users migration**

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->enum('role', ['admin', 'instructor', 'student'])->default('student');
    $table->string('nim')->nullable();
    $table->string('nidn')->nullable();
    $table->string('avatar')->nullable();
    $table->boolean('is_active')->default(true);
    $table->rememberToken();
    $table->timestamps();
});
```

- [ ] **Step 2: Update User model**

```php
<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'nim', 'nidn', 'avatar', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isInstructor(): bool { return $this->role === 'instructor'; }
    public function isStudent(): bool { return $this->role === 'student'; }
}
```

- [ ] **Step 3: Jalankan migration**

```bash
php artisan migrate
```

Expected: `users` table berhasil dibuat.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: users table migration dengan role, nim, nidn, avatar"
```

---

### Task 3: Database Migration — Courses & Enrollments

**Files:**
- Create: `database/migrations/xxxx_create_courses_table.php`
- Create: `database/migrations/xxxx_create_enrollments_table.php`
- Create: `app/Models/Course.php`
- Create: `app/Models/Enrollment.php`

- [ ] **Step 1: Buat migration courses**

```bash
php artisan make:migration create_courses_table
```

```php
Schema::create('courses', function (Blueprint $table) {
    $table->id();
    $table->string('code')->unique();
    $table->string('name');
    $table->text('description')->nullable();
    $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
    $table->string('enroll_code')->unique();
    $table->enum('enrollment_type', ['auto', 'manual'])->default('auto');
    $table->string('semester')->nullable();
    $table->boolean('is_active')->default(true);
    $table->boolean('leaderboard_enabled')->default(false);
    $table->json('certificate_criteria')->nullable();
    $table->timestamps();
});
```

- [ ] **Step 2: Buat migration enrollments**

```bash
php artisan make:migration create_enrollments_table
```

```php
Schema::create('enrollments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('course_id')->constrained()->onDelete('cascade');
    $table->enum('status', ['pending', 'active', 'rejected'])->default('pending');
    $table->timestamp('enrolled_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
    $table->unique(['user_id', 'course_id']);
});
```

- [ ] **Step 3: Buat Course model**

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Course extends Model
{
    protected $fillable = [
        'code', 'name', 'description', 'instructor_id',
        'enroll_code', 'enrollment_type', 'semester', 'is_active',
        'leaderboard_enabled', 'certificate_criteria',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'leaderboard_enabled' => 'boolean',
        'certificate_criteria' => 'array',
    ];

    public function instructor() { return $this->belongsTo(User::class, 'instructor_id'); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function students() { return $this->belongsToMany(User::class, 'enrollments')->wherePivot('status', 'active'); }
    public function modules() { return $this->hasMany(Module::class)->orderBy('order'); }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($course) {
            if (empty($course->enroll_code)) {
                $course->enroll_code = strtoupper(Str::random(8));
            }
        });
    }
}
```

- [ ] **Step 4: Buat Enrollment model**

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $fillable = ['user_id', 'course_id', 'status', 'enrolled_at', 'completed_at'];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
```

- [ ] **Step 5: Jalankan migration**

```bash
php artisan migrate
```

Expected: `courses` dan `enrollments` table berhasil dibuat.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: courses dan enrollments migration + models"
```

---

### Task 4: Database Migration — Modules, Materials, Contents

**Files:**
- Create: `database/migrations/xxxx_create_modules_table.php`
- Create: `database/migrations/xxxx_create_materials_table.php`
- Create: `database/migrations/xxxx_create_contents_table.php`
- Create: `app/Models/Module.php`
- Create: `app/Models/Material.php`
- Create: `app/Models/Content.php`

- [ ] **Step 1: Buat migration modules**

```bash
php artisan make:migration create_modules_table
```

```php
Schema::create('modules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('course_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('description')->nullable();
    $table->unsignedInteger('order')->default(0);
    $table->boolean('is_published')->default(false);
    $table->timestamps();
});
```

- [ ] **Step 2: Buat migration materials**

```bash
php artisan make:migration create_materials_table
```

```php
Schema::create('materials', function (Blueprint $table) {
    $table->id();
    $table->foreignId('module_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->unsignedInteger('order')->default(0);
    $table->boolean('is_published')->default(false);
    $table->timestamps();
});
```

- [ ] **Step 3: Buat migration contents**

```bash
php artisan make:migration create_contents_table
```

```php
Schema::create('contents', function (Blueprint $table) {
    $table->id();
    $table->foreignId('material_id')->constrained()->onDelete('cascade');
    $table->enum('type', ['artikel', 'video', 'audio', 'pdf', 'file']);
    $table->string('title');
    $table->longText('body')->nullable();
    $table->string('url')->nullable();
    $table->string('file_path')->nullable();
    $table->unsignedInteger('order')->default(0);
    $table->timestamps();
});
```

- [ ] **Step 4: Buat Module model**

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'order', 'is_published'];
    protected $casts = ['is_published' => 'boolean'];

    public function course() { return $this->belongsTo(Course::class); }
    public function materials() { return $this->hasMany(Material::class)->orderBy('order'); }
    public function quizzes() { return $this->morphMany(Quiz::class, 'quizzable'); }
    public function assignments() { return $this->morphMany(Assignment::class, 'assignable'); }
}
```

- [ ] **Step 5: Buat Material model**

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = ['module_id', 'title', 'order', 'is_published'];
    protected $casts = ['is_published' => 'boolean'];

    public function module() { return $this->belongsTo(Module::class); }
    public function contents() { return $this->hasMany(Content::class)->orderBy('order'); }
    public function quizzes() { return $this->morphMany(Quiz::class, 'quizzable'); }
    public function assignments() { return $this->morphMany(Assignment::class, 'assignable'); }
    public function discussions() { return $this->hasMany(Discussion::class); }
}
```

- [ ] **Step 6: Buat Content model**

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $fillable = ['material_id', 'type', 'title', 'body', 'url', 'file_path', 'order'];

    public function material() { return $this->belongsTo(Material::class); }
}
```

- [ ] **Step 7: Jalankan migration**

```bash
php artisan migrate
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: modules, materials, contents migration + models"
```

---

### Task 5: Database Migration — Quizzes, Assignments, Discussions

**Files:**
- Create: `database/migrations/xxxx_create_quizzes_table.php`
- Create: `database/migrations/xxxx_create_quiz_questions_table.php`
- Create: `database/migrations/xxxx_create_quiz_attempts_table.php`
- Create: `database/migrations/xxxx_create_assignments_table.php`
- Create: `database/migrations/xxxx_create_submissions_table.php`
- Create: `database/migrations/xxxx_create_discussions_table.php`
- Create: `database/migrations/xxxx_create_certificates_table.php`
- Create: `database/migrations/xxxx_create_content_progress_table.php`
- Create: `app/Models/Quiz.php`
- Create: `app/Models/QuizQuestion.php`
- Create: `app/Models/QuizAttempt.php`
- Create: `app/Models/Assignment.php`
- Create: `app/Models/Submission.php`
- Create: `app/Models/Discussion.php`
- Create: `app/Models/Certificate.php`
- Create: `app/Models/ContentProgress.php`

- [ ] **Step 1: Buat migration quizzes**

```bash
php artisan make:migration create_quizzes_table
```

```php
Schema::create('quizzes', function (Blueprint $table) {
    $table->id();
    $table->morphs('quizzable'); // quizzable_type + quizzable_id
    $table->string('title');
    $table->unsignedInteger('duration')->nullable();
    $table->enum('result_mode', ['immediate', 'delayed', 'custom'])->default('immediate');
    $table->unsignedInteger('passing_score')->default(0);
    $table->boolean('is_published')->default(false);
    $table->timestamps();
});
```

- [ ] **Step 2: Buat migration quiz_questions**

```bash
php artisan make:migration create_quiz_questions_table
```

```php
Schema::create('quiz_questions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
    $table->text('question');
    $table->enum('type', ['multiple_choice', 'true_false', 'essay']);
    $table->json('options')->nullable();
    $table->text('correct_answer')->nullable();
    $table->unsignedInteger('points')->default(1);
    $table->unsignedInteger('order')->default(0);
    $table->timestamps();
});
```

- [ ] **Step 3: Buat migration quiz_attempts**

```bash
php artisan make:migration create_quiz_attempts_table
```

```php
Schema::create('quiz_attempts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->json('answers')->nullable();
    $table->decimal('score', 5, 2)->default(0);
    $table->enum('status', ['in_progress', 'submitted', 'graded'])->default('in_progress');
    $table->timestamp('started_at')->nullable();
    $table->timestamp('finished_at')->nullable();
    $table->timestamps();
});
```

- [ ] **Step 4: Buat migration assignments**

```bash
php artisan make:migration create_assignments_table
```

```php
Schema::create('assignments', function (Blueprint $table) {
    $table->id();
    $table->morphs('assignable'); // assignable_type + assignable_id
    $table->string('title');
    $table->text('description');
    $table->dateTime('deadline');
    $table->boolean('allow_file')->default(true);
    $table->boolean('allow_link')->default(false);
    $table->boolean('is_published')->default(false);
    $table->timestamps();
});
```

- [ ] **Step 5: Buat migration submissions**

```bash
php artisan make:migration create_submissions_table
```

```php
Schema::create('submissions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('assignment_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('file_path')->nullable();
    $table->string('link_url')->nullable();
    $table->decimal('grade', 5, 2)->nullable();
    $table->text('feedback')->nullable();
    $table->enum('status', ['submitted', 'graded', 'late'])->default('submitted');
    $table->timestamp('submitted_at')->nullable();
    $table->timestamps();
    $table->unique(['assignment_id', 'user_id']);
});
```

- [ ] **Step 6: Buat migration discussions**

```bash
php artisan make:migration create_discussions_table
```

```php
Schema::create('discussions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('material_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('parent_id')->nullable()->constrained('discussions')->nullOnDelete();
    $table->text('body');
    $table->timestamps();
});
```

- [ ] **Step 7: Buat migration content_progress**

```bash
php artisan make:migration create_content_progress_table
```

```php
Schema::create('content_progress', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('content_id')->constrained('contents')->onDelete('cascade');
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
    $table->unique(['user_id', 'content_id']);
});
```

- [ ] **Step 8: Buat migration certificates**

```bash
php artisan make:migration create_certificates_table
```

```php
Schema::create('certificates', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('course_id')->constrained()->onDelete('cascade');
    $table->json('criteria')->nullable();
    $table->string('verify_code')->unique();
    $table->timestamp('issued_at')->nullable();
    $table->timestamps();
    $table->unique(['user_id', 'course_id']);
});
```

- [ ] **Step 9: Buat semua Models**

`app/Models/Quiz.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['title', 'duration', 'result_mode', 'passing_score', 'is_published'];
    protected $casts = ['is_published' => 'boolean'];

    public function quizzable() { return $this->morphTo(); }
    public function questions() { return $this->hasMany(QuizQuestion::class)->orderBy('order'); }
    public function attempts() { return $this->hasMany(QuizAttempt::class); }
}
```

`app/Models/QuizQuestion.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable = ['quiz_id', 'question', 'type', 'options', 'correct_answer', 'points', 'order'];
    protected $casts = ['options' => 'array'];

    public function quiz() { return $this->belongsTo(Quiz::class); }
}
```

`app/Models/QuizAttempt.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    protected $fillable = ['quiz_id', 'user_id', 'answers', 'score', 'status', 'started_at', 'finished_at'];
    protected $casts = ['answers' => 'array', 'started_at' => 'datetime', 'finished_at' => 'datetime'];

    public function quiz() { return $this->belongsTo(Quiz::class); }
    public function user() { return $this->belongsTo(User::class); }
}
```

`app/Models/Assignment.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = ['title', 'description', 'deadline', 'allow_file', 'allow_link', 'is_published'];
    protected $casts = ['deadline' => 'datetime', 'allow_file' => 'boolean', 'allow_link' => 'boolean', 'is_published' => 'boolean'];

    public function assignable() { return $this->morphTo(); }
    public function submissions() { return $this->hasMany(Submission::class); }
}
```

`app/Models/Submission.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = ['assignment_id', 'user_id', 'file_path', 'link_url', 'grade', 'feedback', 'status', 'submitted_at'];
    protected $casts = ['submitted_at' => 'datetime'];

    public function assignment() { return $this->belongsTo(Assignment::class); }
    public function user() { return $this->belongsTo(User::class); }
}
```

`app/Models/Discussion.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    protected $fillable = ['material_id', 'user_id', 'parent_id', 'body'];

    public function material() { return $this->belongsTo(Material::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function parent() { return $this->belongsTo(Discussion::class, 'parent_id'); }
    public function replies() { return $this->hasMany(Discussion::class, 'parent_id'); }
}
```

`app/Models/ContentProgress.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ContentProgress extends Model
{
    protected $table = 'content_progress';
    protected $fillable = ['user_id', 'content_id', 'completed_at'];
    protected $casts = ['completed_at' => 'datetime'];

    public function user() { return $this->belongsTo(User::class); }
    public function content() { return $this->belongsTo(Content::class); }
}
```

`app/Models/Certificate.php`:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Certificate extends Model
{
    protected $fillable = ['user_id', 'course_id', 'criteria', 'verify_code', 'issued_at'];
    protected $casts = ['criteria' => 'array', 'issued_at' => 'datetime'];

    public function user() { return $this->belongsTo(User::class); }
    public function course() { return $this->belongsTo(Course::class); }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($cert) {
            if (empty($cert->verify_code)) {
                $cert->verify_code = strtoupper(Str::random(16));
            }
        });
    }
}
```

- [ ] **Step 10: Jalankan semua migration**

```bash
php artisan migrate
```

Expected: Semua tabel berhasil dibuat tanpa error.

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: quizzes, assignments, discussions, certificates migration + models"
```

---

## Phase 2: Authentication

---

### Task 6: Setup Auth (Login, Register, Logout)

**Files:**
- Create: `app/Http/Controllers/Auth/AuthController.php`
- Create: `resources/js/Pages/Auth/Login.jsx`
- Create: `resources/js/Pages/Auth/Register.jsx`
- Modify: `routes/web.php`

- [ ] **Step 1: Buat AuthController**

```php
<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Email atau password salah.']);
        }

        if (!Auth::user()->is_active) {
            Auth::logout();
            return back()->withErrors(['email' => 'Akun Anda tidak aktif.']);
        }

        $request->session()->regenerate();

        return redirect()->intended(match(Auth::user()->role) {
            'admin' => '/admin/dashboard',
            'instructor' => '/instructor/dashboard',
            default => '/student/dashboard',
        });
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
```

- [ ] **Step 2: Buat Login page (React)**

`resources/js/Pages/Auth/Login.jsx`:
```jsx
import { useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Masuk ke LMS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
```

- [ ] **Step 3: Setup routes auth**

`routes/web.php`:
```php
<?php
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Redirect root ke login
Route::get('/', fn() => redirect('/login'));
```

- [ ] **Step 4: Buat middleware role**

```bash
php artisan make:middleware EnsureRole
```

`app/Http/Middleware/EnsureRole.php`:
```php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        if (!in_array($request->user()?->role, $roles)) {
            abort(403, 'Unauthorized');
        }
        return $next($request);
    }
}
```

Register di `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\EnsureRole::class,
    ]);
})
```

- [ ] **Step 5: Daftarkan morph map**

Tambahkan di `app/Providers/AppServiceProvider.php` agar polymorphic type konsisten memakai alias pendek:

```php
use Illuminate\Database\Eloquent\Relations\Relation;

public function boot(): void
{
    Relation::enforceMorphMap([
        'module' => \App\Models\Module::class,
        'material' => \App\Models\Material::class,
    ]);
}
```

- [ ] **Step 6: Test login**

```bash
php artisan tinker
User::create(['name'=>'Admin','email'=>'admin@test.com','password'=>bcrypt('password'),'role'=>'admin','is_active'=>true]);
```

Buka `http://localhost:8000/login`, login dengan kredensial di atas.
Expected: redirect ke `/admin/dashboard` (akan 404 dulu — normal, belum dibuat).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: auth login/logout + role middleware"
```

---

## Phase 3: Admin Panel

---

### Task 7: Admin — Dashboard & Layout

**Files:**
- Create: `app/Http/Controllers/Admin/DashboardController.php`
- Create: `resources/js/Layouts/AdminLayout.jsx`
- Create: `resources/js/Pages/Admin/Dashboard.jsx`
- Modify: `routes/web.php`

- [ ] **Step 1: Buat AdminLayout**

`resources/js/Layouts/AdminLayout.jsx`:
```jsx
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-4 text-xl font-bold border-b border-gray-700">LMS Admin</div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</Link>
                    <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-700">Pengguna</Link>
                    <Link href="/admin/courses" className="block px-3 py-2 rounded hover:bg-gray-700">Mata Kuliah</Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">{auth.user.name}</p>
                    <Link href="/logout" method="post" as="button" className="text-sm text-red-400 hover:text-red-300">
                        Keluar
                    </Link>
                </div>
            </aside>
            {/* Main content */}
            <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
    );
}
```

- [ ] **Step 2: Buat DashboardController**

```php
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_students' => User::where('role', 'student')->count(),
                'total_instructors' => User::where('role', 'instructor')->count(),
                'total_courses' => Course::count(),
                'active_courses' => Course::where('is_active', true)->count(),
                'total_enrollments' => Enrollment::where('status', 'active')->count(),
            ],
        ]);
    }
}
```

- [ ] **Step 3: Buat Dashboard page**

`resources/js/Pages/Admin/Dashboard.jsx`:
```jsx
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard({ stats }) {
    const statCards = [
        { title: 'Total Mahasiswa', value: stats.total_students },
        { title: 'Total Dosen', value: stats.total_instructors },
        { title: 'Total Mata Kuliah', value: stats.total_courses },
        { title: 'Kursus Aktif', value: stats.active_courses },
        { title: 'Total Enrollment', value: stats.total_enrollments },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader><CardTitle className="text-sm text-gray-500">{card.title}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{card.value}</p></CardContent>
                    </Card>
                ))}
            </div>
        </AdminLayout>
    );
}
```

- [ ] **Step 4: Tambahkan routes admin**

Tambahkan ke `routes/web.php`:
```php
use App\Http\Controllers\Admin\DashboardController;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
```

- [ ] **Step 5: Update HandleInertiaRequests untuk share auth user**

`app/Http/Middleware/HandleInertiaRequests.php`:
```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],
    ];
}
```

- [ ] **Step 6: Test dashboard admin**

Login sebagai admin → harus redirect ke `/admin/dashboard` dan tampil stats.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: admin dashboard dengan stats dan layout sidebar"
```

---

### Task 8: Admin — Manajemen User

**Files:**
- Create: `app/Http/Controllers/Admin/UserController.php`
- Create: `resources/js/Pages/Admin/Users/Index.jsx`
- Create: `resources/js/Pages/Admin/Users/Create.jsx`

- [ ] **Step 1: Buat UserController**

```php
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::orderBy('name')->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|in:admin,instructor,student',
            'nim' => 'nullable|string',
            'nidn' => 'nullable|string',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        User::create($validated);

        return redirect('/admin/users')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function toggleActive(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return back()->with('success', 'Status pengguna diperbarui.');
    }
}
```

- [ ] **Step 2: Buat Users/Index page**

`resources/js/Pages/Admin/Users/Index.jsx`:
```jsx
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Index({ users }) {
    const toggleActive = (userId) => {
        router.patch(`/admin/users/${userId}/toggle-active`);
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pengguna</h1>
                <Link href="/admin/users/create">
                    <Button>+ Tambah Pengguna</Button>
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Nama</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">NIM/NIDN</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map(user => (
                            <tr key={user.id} className="border-t">
                                <td className="px-4 py-3">{user.name}</td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">
                                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'instructor' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">{user.nim || user.nidn || '-'}</td>
                                <td className="px-4 py-3">
                                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <Button size="sm" variant="outline" onClick={() => toggleActive(user.id)}>
                                        {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
```

- [ ] **Step 3: Tambahkan routes users**

```php
use App\Http\Controllers\Admin\UserController;

// Di dalam group admin:
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
```

- [ ] **Step 4: Test halaman users**

Buka `/admin/users` — harus tampil tabel user.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: admin manajemen user (list, tambah, toggle aktif)"
```

---

## Phase 4: Instructor Panel

---

### Task 9: Instructor — Dashboard & Course Management

**Files:**
- Create: `app/Http/Controllers/Instructor/DashboardController.php`
- Create: `app/Http/Controllers/Instructor/CourseController.php`
- Create: `resources/js/Layouts/InstructorLayout.jsx`
- Create: `resources/js/Pages/Instructor/Dashboard.jsx`
- Create: `resources/js/Pages/Instructor/Courses/Index.jsx`
- Create: `resources/js/Pages/Instructor/Courses/Create.jsx`

- [ ] **Step 1: Buat InstructorLayout**

`resources/js/Layouts/InstructorLayout.jsx`:
```jsx
import { Link, usePage } from '@inertiajs/react';

export default function InstructorLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-indigo-900 text-white flex flex-col">
                <div className="p-4 text-xl font-bold border-b border-indigo-700">LMS Dosen</div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/instructor/dashboard" className="block px-3 py-2 rounded hover:bg-indigo-700">Dashboard</Link>
                    <Link href="/instructor/courses" className="block px-3 py-2 rounded hover:bg-indigo-700">Mata Kuliah</Link>
                </nav>
                <div className="p-4 border-t border-indigo-700">
                    <p className="text-sm text-indigo-300">{auth.user.name}</p>
                    <Link href="/logout" method="post" as="button" className="text-sm text-red-400 hover:text-red-300">Keluar</Link>
                </div>
            </aside>
            <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
    );
}
```

- [ ] **Step 2: Buat CourseController instructor**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        return Inertia::render('Instructor/Courses/Index', [
            'courses' => Course::where('instructor_id', Auth::id())
                ->withCount(['enrollments' => fn($q) => $q->where('status', 'active')])
                ->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Instructor/Courses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:courses',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'semester' => 'nullable|string',
            'enrollment_type' => 'required|in:auto,manual',
        ]);

        $validated['instructor_id'] = Auth::id();
        Course::create($validated);

        return redirect('/instructor/courses')->with('success', 'Mata kuliah berhasil dibuat.');
    }

    public function show(Course $course)
    {
        $this->authorize('view', $course);

        return Inertia::render('Instructor/Courses/Show', [
            'course' => $course->load(['modules.materials', 'enrollments.user']),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'semester' => 'nullable|string',
            'enrollment_type' => 'required|in:auto,manual',
            'is_active' => 'boolean',
        ]);

        $course->update($validated);
        return back()->with('success', 'Mata kuliah diperbarui.');
    }
}
```

- [ ] **Step 3: Buat Course Policy**

```bash
php artisan make:policy CoursePolicy --model=Course
```

`app/Policies/CoursePolicy.php`:
```php
<?php
namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    public function view(User $user, Course $course): bool
    {
        return $user->isAdmin() || $course->instructor_id === $user->id;
    }

    public function update(User $user, Course $course): bool
    {
        return $user->isAdmin() || $course->instructor_id === $user->id;
    }
}
```

- [ ] **Step 4: Tambahkan routes instructor**

```php
use App\Http\Controllers\Instructor\CourseController;
use App\Http\Controllers\Instructor\DashboardController as InstructorDashboard;

Route::middleware(['auth', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [InstructorDashboard::class, 'index'])->name('dashboard');
    Route::resource('/courses', CourseController::class);
});
```

- [ ] **Step 5: Test instructor courses**

Login sebagai instructor → buka `/instructor/courses` → buat mata kuliah baru.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: instructor dashboard + course management CRUD"
```

---

### Task 10: Instructor — Module & Material Builder

**Files:**
- Create: `app/Http/Controllers/Instructor/ModuleController.php`
- Create: `app/Http/Controllers/Instructor/MaterialController.php`
- Create: `app/Http/Controllers/Instructor/ContentController.php`
- Create: `resources/js/Pages/Instructor/Courses/Show.jsx`

- [ ] **Step 1: Buat ModuleController**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $order = $course->modules()->max('order') + 1;
        $course->modules()->create([...$validated, 'order' => $order]);

        return back()->with('success', 'Modul berhasil ditambahkan.');
    }

    public function update(Request $request, Module $module)
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $module->update($validated);
        return back()->with('success', 'Modul diperbarui.');
    }

    public function destroy(Module $module)
    {
        $this->authorize('update', $module->course);
        $module->delete();
        return back()->with('success', 'Modul dihapus.');
    }
}
```

- [ ] **Step 2: Buat MaterialController**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Module;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function store(Request $request, Module $module)
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate(['title' => 'required|string|max:255']);
        $order = $module->materials()->max('order') + 1;
        $module->materials()->create([...$validated, 'order' => $order]);

        return back()->with('success', 'Materi berhasil ditambahkan.');
    }

    public function update(Request $request, Material $material)
    {
        $this->authorize('update', $material->module->course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'is_published' => 'boolean',
        ]);

        $material->update($validated);
        return back()->with('success', 'Materi diperbarui.');
    }

    public function destroy(Material $material)
    {
        $this->authorize('update', $material->module->course);
        $material->delete();
        return back()->with('success', 'Materi dihapus.');
    }
}
```

- [ ] **Step 3: Buat ContentController**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Material;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function store(Request $request, Material $material)
    {
        $this->authorize('update', $material->module->course);

        $validated = $request->validate([
            'type' => 'required|in:artikel,video,audio,pdf,file',
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
            'url' => 'nullable|url',
            'file' => 'nullable|file|max:51200', // 50MB
        ]);

        $order = $material->contents()->max('order') + 1;
        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('contents', 'public');
        }

        $material->contents()->create([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'body' => $validated['body'] ?? null,
            'url' => $validated['url'] ?? null,
            'file_path' => $filePath,
            'order' => $order,
        ]);

        return back()->with('success', 'Konten berhasil ditambahkan.');
    }

    public function destroy(Content $content)
    {
        $this->authorize('update', $content->material->module->course);
        $content->delete();
        return back()->with('success', 'Konten dihapus.');
    }
}
```

- [ ] **Step 4: Tambahkan routes module & material**

```php
use App\Http\Controllers\Instructor\ModuleController;
use App\Http\Controllers\Instructor\MaterialController;
use App\Http\Controllers\Instructor\ContentController;

// Di dalam group instructor:
Route::post('/courses/{course}/modules', [ModuleController::class, 'store']);
Route::put('/modules/{module}', [ModuleController::class, 'update']);
Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);

Route::post('/modules/{module}/materials', [MaterialController::class, 'store']);
Route::put('/materials/{material}', [MaterialController::class, 'update']);
Route::delete('/materials/{material}', [MaterialController::class, 'destroy']);

Route::post('/materials/{material}/contents', [ContentController::class, 'store']);
Route::delete('/contents/{content}', [ContentController::class, 'destroy']);
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: instructor module, material, content builder"
```

---

## Phase 5: Student Panel

---

### Task 11: Student — Dashboard & Enrollment

**Files:**
- Create: `app/Http/Controllers/Student/DashboardController.php`
- Create: `app/Http/Controllers/Student/EnrollmentController.php`
- Create: `app/Http/Controllers/Student/ContentProgressController.php`
- Create: `resources/js/Layouts/StudentLayout.jsx`
- Create: `resources/js/Pages/Student/Dashboard.jsx`

- [ ] **Step 1: Buat EnrollmentController**

```php
<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Notifications\EnrollmentRequested;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    public function join(Request $request)
    {
        $request->validate(['enroll_code' => 'required|string']);

        $course = Course::where('enroll_code', $request->enroll_code)
            ->where('is_active', true)
            ->firstOrFail();

        $existing = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)->first();

        if ($existing && $existing->status !== 'rejected') {
            return back()->withErrors(['enroll_code' => 'Kamu sudah terdaftar di kursus ini.']);
        }

        $status = $course->enrollment_type === 'auto' ? 'active' : 'pending';

        Enrollment::updateOrCreate(
            ['user_id' => Auth::id(), 'course_id' => $course->id],
            [
                'status' => $status,
                'enrolled_at' => $status === 'active' ? now() : null,
            ]
        );

        if ($status === 'pending') {
            $course->instructor->notify(new EnrollmentRequested(Auth::user(), $course));
        }

        $message = $status === 'active'
            ? 'Berhasil bergabung ke kursus!'
            : 'Pengajuan terkirim, menunggu persetujuan dosen.';

        return back()->with('success', $message);
    }
}
```

- [ ] **Step 2: Buat DashboardController student**

```php
<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::where('user_id', Auth::id())
            ->where('status', 'active')
            ->with('course.instructor')
            ->get();

        return Inertia::render('Student/Dashboard', [
            'enrollments' => $enrollments,
        ]);
    }
}
```

- [ ] **Step 3: Buat ContentProgressController**

```php
<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\ContentProgress;
use Illuminate\Support\Facades\Auth;

class ContentProgressController extends Controller
{
    public function complete(Content $content)
    {
        ContentProgress::updateOrCreate(
            ['user_id' => Auth::id(), 'content_id' => $content->id],
            ['completed_at' => now()]
        );

        return back()->with('success', 'Progress tersimpan.');
    }
}
```

- [ ] **Step 4: Buat routes student**

```php
use App\Http\Controllers\Student\DashboardController as StudentDashboard;
use App\Http\Controllers\Student\EnrollmentController;
use App\Http\Controllers\Student\ContentProgressController;

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentDashboard::class, 'index'])->name('dashboard');
    Route::post('/enroll', [EnrollmentController::class, 'join'])->name('enroll');
    Route::post('/contents/{content}/complete', [ContentProgressController::class, 'complete'])->name('contents.complete');
});
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: student dashboard + enrollment (auto/manual)"
```

---

## Phase 6: Quiz & Assignment System

---

### Task 12: Quiz Builder & Attempt

**Files:**
- Create: `app/Http/Controllers/Instructor/QuizController.php`
- Create: `app/Http/Controllers/Student/QuizController.php`

- [ ] **Step 1: Buat QuizController instructor**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quizzable_type' => 'required|in:module,material',
            'quizzable_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'duration' => 'nullable|integer|min:1',
            'result_mode' => 'required|in:immediate,delayed,custom',
            'passing_score' => 'required|integer|min:0|max:100',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.type' => 'required|in:multiple_choice,true_false,essay',
            'questions.*.options' => 'nullable|array',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.points' => 'required|integer|min:1',
        ]);

        $quizzable = $validated['quizzable_type'] === 'module'
            ? Module::findOrFail($validated['quizzable_id'])
            : Material::findOrFail($validated['quizzable_id']);

        $quiz = $quizzable->quizzes()->create([
            'title' => $validated['title'],
            'duration' => $validated['duration'],
            'result_mode' => $validated['result_mode'],
            'passing_score' => $validated['passing_score'],
        ]);

        foreach ($validated['questions'] as $index => $q) {
            $quiz->questions()->create([...$q, 'order' => $index + 1]);
        }

        return back()->with('success', 'Quiz berhasil dibuat.');
    }
}
```

- [ ] **Step 2: Buat QuizController student (attempt)**

```php
<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function show(Quiz $quiz)
    {
        return Inertia::render('Student/Quiz/Show', [
            'quiz' => $quiz->load('questions'),
            'attempt' => QuizAttempt::where('quiz_id', $quiz->id)
                ->where('user_id', Auth::id())->latest()->first(),
        ]);
    }

    public function submit(Request $request, Quiz $quiz)
    {
        $validated = $request->validate(['answers' => 'required|array']);

        $score = 0;
        $totalPoints = 0;

        foreach ($quiz->questions as $question) {
            $totalPoints += $question->points;
            $answer = $validated['answers'][$question->id] ?? null;

            if ($question->type !== 'essay' && $answer === $question->correct_answer) {
                $score += $question->points;
            }
        }

        $hasEssay = $quiz->questions->contains('type', 'essay');
        $finalScore = $totalPoints > 0 ? round(($score / $totalPoints) * 100, 2) : 0;

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => Auth::id(),
            'answers' => $validated['answers'],
            'score' => $finalScore,
            'status' => $hasEssay ? 'submitted' : 'graded',
            'started_at' => now(),
            'finished_at' => now(),
        ]);

        return back()->with('success', $hasEssay
            ? 'Quiz berhasil dikumpulkan dan menunggu penilaian dosen.'
            : "Quiz selesai! Skor kamu: {$finalScore}");
    }
}
```

- [ ] **Step 3: Tambahkan routes quiz**

```php
// Instructor
Route::post('/quizzes', [App\Http\Controllers\Instructor\QuizController::class, 'store']);

// Student
Route::get('/quizzes/{quiz}', [App\Http\Controllers\Student\QuizController::class, 'show']);
Route::post('/quizzes/{quiz}/submit', [App\Http\Controllers\Student\QuizController::class, 'submit']);
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: quiz builder + attempt system dengan auto scoring"
```

---

### Task 13: Assignment Submission & Grading

**Files:**
- Create: `app/Http/Controllers/Instructor/AssignmentController.php`
- Create: `app/Http/Controllers/Student/AssignmentController.php`

- [ ] **Step 1: Buat AssignmentController instructor**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use App\Notifications\AssignmentGraded;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'assignable_type' => 'required|in:module,material',
            'assignable_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'deadline' => 'required|date|after:now',
            'allow_file' => 'boolean',
            'allow_link' => 'boolean',
        ]);

        $assignable = $validated['assignable_type'] === 'module'
            ? \App\Models\Module::findOrFail($validated['assignable_id'])
            : \App\Models\Material::findOrFail($validated['assignable_id']);

        $assignable->assignments()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'deadline' => $validated['deadline'],
            'allow_file' => $validated['allow_file'] ?? true,
            'allow_link' => $validated['allow_link'] ?? false,
        ]);

        return back()->with('success', 'Tugas berhasil dibuat.');
    }

    public function grade(Request $request, Submission $submission)
    {
        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([...$validated, 'status' => 'graded']);
        $submission->user->notify(new AssignmentGraded($submission));

        return back()->with('success', 'Nilai berhasil disimpan.');
    }
}
```

- [ ] **Step 2: Buat AssignmentController student**

```php
<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    public function submit(Request $request, Assignment $assignment)
    {
        $request->validate([
            'file' => 'nullable|file|max:51200',
            'link_url' => 'nullable|url',
        ]);

        $filePath = null;
        if ($request->hasFile('file') && $assignment->allow_file) {
            $filePath = $request->file('file')->store('submissions', 'public');
        }

        Submission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'user_id' => Auth::id()],
            [
                'file_path' => $filePath,
                'link_url' => $request->link_url,
                'status' => now()->greaterThan($assignment->deadline) ? 'late' : 'submitted',
                'submitted_at' => now(),
            ]
        );

        return back()->with('success', 'Tugas berhasil dikumpulkan.');
    }
}
```

- [ ] **Step 3: Tambahkan routes assignment**

```php
// Instructor
Route::post('/assignments', [App\Http\Controllers\Instructor\AssignmentController::class, 'store']);
Route::patch('/submissions/{submission}/grade', [App\Http\Controllers\Instructor\AssignmentController::class, 'grade']);

// Student
Route::post('/assignments/{assignment}/submit', [App\Http\Controllers\Student\AssignmentController::class, 'submit']);
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: assignment submission + instructor grading"
```

---

## Phase 7: Email Notifications

---

### Task 14: Setup Queue + Email Notifications

**Files:**
- Create: `app/Notifications/EnrollmentRequested.php`
- Create: `app/Notifications/EnrollmentApproved.php`
- Create: `app/Notifications/EnrollmentRejected.php`
- Create: `app/Notifications/AssignmentGraded.php`
- Create: `app/Notifications/DeadlineReminder.php`
- Create: `app/Console/Commands/SendDeadlineReminders.php`

- [ ] **Step 1: Setup queue driver ke database**

`.env`:
```
QUEUE_CONNECTION=database
```

```bash
php artisan queue:table
php artisan migrate
```

- [ ] **Step 2: Buat notifikasi EnrollmentRequested**

```bash
php artisan make:notification EnrollmentRequested
```

`app/Notifications/EnrollmentRequested.php`:
```php
<?php
namespace App\Notifications;

use App\Models\Course;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EnrollmentRequested extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public User $student, public Course $course) {}

    public function via($notifiable): array { return ['mail']; }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Pengajuan Masuk Kursus: {$this->course->name}")
            ->line("{$this->student->name} mengajukan masuk ke kursus {$this->course->name}.")
            ->action('Lihat Pengajuan', url("/instructor/courses/{$this->course->id}/enrollments"))
            ->line('Silakan approve atau tolak pengajuan tersebut.');
    }
}
```

- [ ] **Step 3: Buat notifikasi AssignmentGraded**

```bash
php artisan make:notification AssignmentGraded
```

`app/Notifications/AssignmentGraded.php`:
```php
<?php
namespace App\Notifications;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssignmentGraded extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Submission $submission) {}

    public function via($notifiable): array { return ['mail']; }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Tugas Kamu Sudah Dinilai: {$this->submission->assignment->title}")
            ->line("Nilai kamu: {$this->submission->grade}/100")
            ->line("Feedback: {$this->submission->feedback}")
            ->action('Lihat Detail', url('/student/dashboard'));
    }
}
```

- [ ] **Step 4: Buat command deadline reminder**

```bash
php artisan make:command SendDeadlineReminders
```

`app/Console/Commands/SendDeadlineReminders.php`:
```php
<?php
namespace App\Console\Commands;

use App\Models\Assignment;
use App\Notifications\DeadlineReminder;
use Illuminate\Console\Command;

class SendDeadlineReminders extends Command
{
    protected $signature = 'reminders:deadline';
    protected $description = 'Kirim reminder tugas H-1 deadline';

    public function handle(): void
    {
        $tomorrow = now()->addDay();

        Assignment::where('is_published', true)
            ->whereDate('deadline', $tomorrow->toDateString())
            ->with(['assignable.module.course.enrollments' => fn($q) => $q->where('status', 'active')->with('user')])
            ->each(function ($assignment) {
                $course = $assignment->assignable instanceof \App\Models\Module
                    ? $assignment->assignable->course
                    : $assignment->assignable->module->course;

                foreach ($course->students as $student) {
                    $hasSubmitted = $assignment->submissions()
                        ->where('user_id', $student->id)->exists();

                    if (!$hasSubmitted) {
                        $student->notify(new DeadlineReminder($assignment));
                    }
                }
            });

        $this->info('Deadline reminders sent!');
    }
}
```

- [ ] **Step 5: Setup scheduler**

`routes/console.php`:
```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('reminders:deadline')->dailyAt('08:00');
```

- [ ] **Step 6: Setup cron di cPanel Hostinger**

Tambahkan cron job di cPanel:
```
* * * * * php /home/username/public_html/artisan schedule:run >> /dev/null 2>&1
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: email notifications + queue + deadline reminder scheduler"
```

---

## Phase 8: Forum Diskusi

---

### Task 15: Forum Diskusi per Materi

**Files:**
- Create: `app/Http/Controllers/Student/DiscussionController.php`
- Create: `app/Notifications/NewDiscussionPost.php`

- [ ] **Step 1: Buat DiscussionController**

```php
<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Material;
use App\Notifications\NewDiscussionPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiscussionController extends Controller
{
    public function store(Request $request, Material $material)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:discussions,id',
        ]);

        $post = Discussion::create([
            'material_id' => $material->id,
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'body' => $validated['body'],
        ]);

        // Notify semua yang sudah pernah posting di thread ini (kecuali poster baru)
        $previousPosters = Discussion::where('material_id', $material->id)
            ->where('user_id', '!=', Auth::id())
            ->with('user')
            ->get()
            ->pluck('user')
            ->unique('id');

        foreach ($previousPosters as $user) {
            $user->notify(new NewDiscussionPost($post, $material));
        }

        return back()->with('success', 'Diskusi berhasil diposting.');
    }

    public function destroy(Discussion $discussion)
    {
        if ($discussion->user_id !== Auth::id()) {
            abort(403);
        }
        $discussion->delete();
        return back()->with('success', 'Posting dihapus.');
    }
}
```

- [ ] **Step 2: Tambahkan routes diskusi**

```php
// Di student group:
Route::post('/materials/{material}/discussions', [App\Http\Controllers\Student\DiscussionController::class, 'store']);
Route::delete('/discussions/{discussion}', [App\Http\Controllers\Student\DiscussionController::class, 'destroy']);
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: forum diskusi per materi dengan notifikasi email"
```

---

## Phase 9: Sertifikat & Leaderboard

---

### Task 16: Sertifikat & Leaderboard

**Files:**
- Create: `app/Http/Controllers/Instructor/CertificateController.php`
- Create: `app/Http/Controllers/Student/CertificateController.php`
- Create: `app/Http/Controllers/Student/LeaderboardController.php`

- [ ] **Step 1: Buat CertificateController instructor (set kriteria)**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function setCriteria(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'criteria' => 'required|array',
            'criteria.min_progress' => 'nullable|integer|min:0|max:100',
            'criteria.min_score' => 'nullable|numeric|min:0|max:100',
        ]);

        // Simpan template kriteria ke course; certificates.criteria menjadi snapshot saat diterbitkan.
        $course->update(['certificate_criteria' => $validated['criteria']]);

        return back()->with('success', 'Kriteria sertifikat disimpan.');
    }
}
```

Catatan: kolom `certificate_criteria` sudah dibuat sejak migration `courses` pada Task 3. Jangan buat migration duplikat jika implementasi dimulai dari awal.

- [ ] **Step 2: Buat LeaderboardController student**

```php
<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\QuizAttempt;
use App\Models\Submission;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function show(Course $course)
    {
        abort_unless($course->leaderboard_enabled, 404);

        // Hitung rata-rata nilai per mahasiswa
        $students = $course->students()->get()->map(function ($student) use ($course) {
            $quizAvg = QuizAttempt::whereHas('quiz', fn($q) => $q->where('quizzable_type', 'module')
                ->whereHas('quizzable', fn($q2) => $q2->where('course_id', $course->id)))
                ->where('user_id', $student->id)->avg('score') ?? 0;

            $assignAvg = Submission::whereHas('assignment', fn($q) => $q->where('assignable_type', 'module')
                ->whereHas('assignable', fn($q2) => $q2->where('course_id', $course->id)))
                ->where('user_id', $student->id)->avg('grade') ?? 0;

            return [
                'id' => $student->id,
                'name' => $student->name,
                'average_score' => round(($quizAvg + $assignAvg) / 2, 1),
            ];
        })->sortByDesc('average_score')->values();

        return Inertia::render('Student/Leaderboard', [
            'course' => $course,
            'leaderboard' => $students,
        ]);
    }
}
```

Catatan implementasi leaderboard:
- Query final harus menghitung quiz/tugas dari module-level dan material-level.
- Hanya attempt/submission dengan status `graded` yang masuk perhitungan.
- Jika kursus hanya punya quiz atau hanya tugas, gunakan komponen nilai yang tersedia.

- [ ] **Step 3: Tambahkan routes**

```php
// Instructor
Route::post('/courses/{course}/certificate-criteria', [App\Http\Controllers\Instructor\CertificateController::class, 'setCriteria']);

// Student
Route::get('/courses/{course}/leaderboard', [App\Http\Controllers\Student\LeaderboardController::class, 'show']);
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: sertifikat kriteria + leaderboard per kursus"
```

---

## Phase 10: Video Manager

---

### Task 17: Video Manager (YouTube Auto Preview)

**Files:**
- Create: `app/Http/Controllers/Instructor/VideoManagerController.php`
- Create: `resources/js/Components/VideoManager.jsx`

- [ ] **Step 1: Buat VideoManagerController**

```php
<?php
namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VideoManagerController extends Controller
{
    public function preview(Request $request)
    {
        $request->validate(['url' => 'required|url']);
        $url = $request->url;

        // Extract YouTube video ID
        preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $url, $matches);

        if (empty($matches[1])) {
            return response()->json(['error' => 'URL YouTube tidak valid.'], 422);
        }

        $videoId = $matches[1];

        return response()->json([
            'video_id' => $videoId,
            'thumbnail' => "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg",
            'embed_url' => "https://www.youtube.com/embed/{$videoId}",
        ]);
    }
}
```

- [ ] **Step 2: Buat VideoManager React component**

`resources/js/Components/VideoManager.jsx`:
```jsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function VideoManager({ onSelect }) {
    const [url, setUrl] = useState('');
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePreview = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/instructor/video-preview', { url });
            setPreview(res.data);
        } catch (e) {
            setError('URL YouTube tidak valid. Pastikan formatnya benar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                />
                <Button onClick={handlePreview} disabled={loading}>
                    {loading ? 'Memuat...' : 'Preview'}
                </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {preview && (
                <div className="border rounded-lg p-3 bg-gray-50 flex gap-3 items-center">
                    <img src={preview.thumbnail} alt="thumbnail" className="w-32 h-20 object-cover rounded" />
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 break-all">{url}</p>
                        <Button size="sm" className="mt-2" onClick={() => onSelect(url)}>
                            Gunakan Video Ini
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
```

- [ ] **Step 3: Tambahkan route video preview**

```php
// Di instructor group:
Route::post('/video-preview', [App\Http\Controllers\Instructor\VideoManagerController::class, 'preview']);
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: video manager dengan YouTube auto preview thumbnail"
```

---

## Phase 11: Finalisasi & Deploy

---

### Task 18: Seeder & Deploy ke Hostinger

**Files:**
- Create: `database/seeders/AdminSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`

- [ ] **Step 1: Buat AdminSeeder**

```php
<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@lms.ac.id',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }
}
```

- [ ] **Step 2: Jalankan seeder**

```bash
php artisan db:seed --class=AdminSeeder
```

- [ ] **Step 3: Persiapkan untuk deployment Hostinger**

Update `.env.example`:
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password

QUEUE_CONNECTION=database
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=ssl
```

- [ ] **Step 4: Build assets untuk production**

```bash
npm run build
```

- [ ] **Step 5: Upload ke Hostinger**

1. Upload semua file ke `public_html/` via File Manager atau FTP
2. Pastikan folder `public/` di-point ke `public_html/`
3. Import database via phpMyAdmin
4. Set `.env` di server
5. Jalankan:
```bash
php artisan migrate --force
php artisan db:seed --class=AdminSeeder
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

- [ ] **Step 6: Setup cron job di cPanel**

Tambahkan di cPanel → Cron Jobs:
```
* * * * * /usr/local/bin/php /home/username/public_html/artisan schedule:run >> /dev/null 2>&1
```

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "feat: seeder admin + deployment config"
git tag v1.0.0
```

---

## Summary

| Phase | Tasks | Fitur |
|-------|-------|-------|
| 1 | 1-5 | Setup + semua migrations + models |
| 2 | 6 | Auth + role middleware |
| 3 | 7-8 | Admin panel (dashboard, user management) |
| 4 | 9-10 | Instructor panel (course, module, material, content builder) |
| 5 | 11 | Student panel (dashboard, enrollment) |
| 6 | 12-13 | Quiz builder + assignment + grading |
| 7 | 14 | Email notifications + queue + scheduler |
| 8 | 15 | Forum diskusi per materi |
| 9 | 16 | Sertifikat + leaderboard |
| 10 | 17 | Video Manager YouTube |
| 11 | 18 | Seeder + deploy Hostinger |
