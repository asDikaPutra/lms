<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\ContentProgress;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoLmsSeeder extends Seeder
{
    public function run(): void
    {
        $instructor = User::factory()->instructor()->create([
            'name' => 'Prof. Dr. Ahmad Zainuddin',
            'email' => 'dosen@lms.ac.id',
        ]);

        $student = User::factory()->student()->create([
            'name' => 'Ahmad Mujtaba',
            'email' => 'mahasiswa@lms.ac.id',
        ]);

        $course = Course::query()->create([
            'code' => 'FAI301',
            'name' => 'Tafsir Al-Quran',
            'description' => 'Kajian pengantar tafsir tematik untuk pembelajaran internal fakultas.',
            'instructor_id' => $instructor->id,
            'enroll_code' => 'TAFSIR26',
            'enrollment_type' => 'manual',
            'semester' => 'Ganjil 2026/2027',
            'is_active' => true,
            'leaderboard_enabled' => true,
            'certificate_criteria' => [
                'min_progress' => 100,
                'min_score' => 70,
            ],
        ]);

        Enrollment::query()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        $module = Module::query()->create([
            'course_id' => $course->id,
            'title' => 'Pertemuan 1: Pengantar Tafsir',
            'description' => 'Konsep dasar, adab, dan ruang lingkup ilmu tafsir.',
            'order' => 1,
            'is_published' => true,
        ]);

        $material = Material::query()->create([
            'module_id' => $module->id,
            'title' => 'Adab Mempelajari Al-Quran',
            'order' => 1,
            'is_published' => true,
        ]);

        $content = $material->contents()->create([
            'type' => 'artikel',
            'title' => 'Niat dan Adab dalam Menuntut Ilmu',
            'body' => 'Menuntut ilmu dimulai dari niat yang lurus, adab kepada guru, dan kesungguhan dalam amal.',
            'order' => 1,
        ]);

        ContentProgress::query()->create([
            'user_id' => $student->id,
            'content_id' => $content->id,
            'completed_at' => now(),
        ]);

        $quiz = Quiz::query()->create([
            'quizzable_type' => 'material',
            'quizzable_id' => $material->id,
            'title' => 'Quiz Pengantar Tafsir',
            'duration' => 15,
            'result_mode' => 'immediate',
            'passing_score' => 70,
            'is_published' => true,
        ]);

        $quiz->questions()->create([
            'question' => 'Apa hal pertama yang perlu diluruskan saat menuntut ilmu?',
            'type' => 'multiple_choice',
            'options' => ['Niat', 'Gelar', 'Popularitas', 'Nilai semata'],
            'correct_answer' => 'Niat',
            'points' => 10,
            'order' => 1,
        ]);

        Assignment::query()->create([
            'assignable_type' => 'module',
            'assignable_id' => $module->id,
            'title' => 'Ringkasan Adab Penuntut Ilmu',
            'description' => 'Tulis ringkasan singkat tentang adab menuntut ilmu dalam Islam.',
            'deadline' => now()->addWeek(),
            'allow_file' => true,
            'allow_link' => true,
            'is_published' => true,
        ]);
    }
}
