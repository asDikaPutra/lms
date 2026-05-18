<?php

namespace App\Notifications;

use App\Models\QuizAttempt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class QuizGradedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public QuizAttempt $attempt
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
        $quiz = $this->attempt->quiz;
        $quizzable = $quiz->quizzable;
        $courseId = $quizzable instanceof \App\Models\Module 
            ? $quizzable->course_id 
            : $quizzable->module->course_id;

        return [
            'type' => 'quiz_graded',
            'attempt_id' => $this->attempt->id,
            'quiz_id' => $quiz->id,
            'quiz_title' => $quiz->title,
            'score' => $this->attempt->score,
            'message' => "Quiz '{$quiz->title}' telah dinilai. Nilai: {$this->attempt->score}",
            'action_url' => route('student.courses.show', $courseId),
        ];
    }
}
