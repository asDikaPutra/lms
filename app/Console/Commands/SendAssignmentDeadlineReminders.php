<?php

namespace App\Console\Commands;

use App\Models\Assignment;
use App\Models\Enrollment;
use App\Notifications\AssignmentDeadlineReminderNotification;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('assignment:send-deadline-reminders')]
#[Description('Send deadline reminders for assignments due tomorrow')]
class SendAssignmentDeadlineReminders extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tomorrow = now()->addDay()->startOfDay();
        $endOfTomorrow = now()->addDay()->endOfDay();

        // Get assignments with deadline tomorrow
        $assignments = Assignment::query()
            ->where('is_published', true)
            ->whereBetween('deadline', [$tomorrow, $endOfTomorrow])
            ->with(['assignable.module.course'])
            ->get();

        $notificationCount = 0;

        foreach ($assignments as $assignment) {
            // Get course from assignable
            $assignable = $assignment->assignable;
            $course = $assignable instanceof \App\Models\Module 
                ? $assignable->course 
                : $assignable->module->course;

            // Get enrolled students who haven't submitted or haven't been graded
            $enrolledStudentIds = Enrollment::query()
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->pluck('user_id');

            // Get students who haven't submitted or submission not graded
            $studentsToNotify = \App\Models\User::query()
                ->whereIn('id', $enrolledStudentIds)
                ->whereDoesntHave('submissions', function ($query) use ($assignment) {
                    $query->where('assignment_id', $assignment->id)
                          ->where('status', 'graded');
                })
                ->get();

            foreach ($studentsToNotify as $student) {
                $student->notify(new AssignmentDeadlineReminderNotification($assignment));
                $notificationCount++;
            }
        }

        $this->info("Sent {$notificationCount} deadline reminder notifications for {$assignments->count()} assignments.");

        return Command::SUCCESS;
    }
}
