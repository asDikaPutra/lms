<?php

namespace App\Notifications;

use App\Models\Discussion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class DiscussionReplyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Discussion $reply
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
        $material = $this->reply->material;
        $courseId = $material->module->course_id;

        return [
            'type' => 'discussion_reply',
            'discussion_id' => $this->reply->id,
            'parent_id' => $this->reply->parent_id,
            'material_id' => $material->id,
            'material_title' => $material->title,
            'replier_name' => $this->reply->user->name,
            'message' => "{$this->reply->user->name} membalas diskusi Anda di '{$material->title}'",
            'action_url' => route('student.courses.show', $courseId),
        ];
    }
}
