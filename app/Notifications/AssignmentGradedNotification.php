<?php

namespace App\Notifications;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class AssignmentGradedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Submission $submission
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $assignment = $this->submission->assignment;
        $assignable = $assignment->assignable;
        $courseId = $assignable instanceof \App\Models\Module 
            ? $assignable->course_id 
            : $assignable->module->course_id;

        return [
            'type' => 'assignment_graded',
            'submission_id' => $this->submission->id,
            'assignment_id' => $assignment->id,
            'assignment_title' => $assignment->title,
            'grade' => $this->submission->grade,
            'message' => "Tugas '{$assignment->title}' telah dinilai. Nilai: {$this->submission->grade}",
            'action_url' => route('student.courses.show', $courseId),
        ];
    }
}
