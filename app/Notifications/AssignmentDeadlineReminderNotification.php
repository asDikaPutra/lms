<?php

namespace App\Notifications;

use App\Models\Assignment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class AssignmentDeadlineReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Assignment $assignment
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
        $assignable = $this->assignment->assignable;
        $courseId = $assignable instanceof \App\Models\Module 
            ? $assignable->course_id 
            : $assignable->module->course_id;

        return [
            'type' => 'assignment_deadline_reminder',
            'assignment_id' => $this->assignment->id,
            'assignment_title' => $this->assignment->title,
            'deadline' => $this->assignment->deadline,
            'message' => "Pengingat: Tugas '{$this->assignment->title}' akan berakhir besok!",
            'action_url' => route('student.courses.show', $courseId),
        ];
    }
}
