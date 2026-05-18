<?php

namespace App\Http\Controllers;

use App\Models\Discussion;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DiscussionController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        Gate::authorize('create', [Discussion::class, $material]);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
            'parent_id' => ['nullable', 'integer', 'exists:discussions,id'],
        ]);

        // Ensure parent belongs to the same material if provided
        if ($validated['parent_id'] ?? null) {
            $parent = Discussion::query()->findOrFail($validated['parent_id']);
            abort_unless($parent->material_id === $material->id, 403, 'Reply must belong to the same material.');
        }

        $discussion = $material->discussions()->create([
            'user_id' => $request->user()->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'body' => $validated['body'],
        ]);

        // Notify parent author if this is a reply
        if ($discussion->parent_id) {
            $parent = Discussion::query()->find($discussion->parent_id);
            if ($parent && $parent->user_id !== $request->user()->id) {
                $parent->user->notify(new \App\Notifications\DiscussionReplyNotification($discussion));
            }
        }

        return back()->with('success', 'Diskusi berhasil dikirim.');
    }

    public function destroy(Discussion $discussion): RedirectResponse
    {
        Gate::authorize('delete', $discussion);

        $discussion->delete();

        return back()->with('success', 'Diskusi berhasil dihapus.');
    }
}
