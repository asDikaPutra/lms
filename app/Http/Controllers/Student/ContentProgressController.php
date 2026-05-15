<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\ContentProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ContentProgressController extends Controller
{
    public function complete(Request $request, Content $content): RedirectResponse
    {
        $content->load('material.module.course');
        Gate::authorize('view', $content->material->module->course);
        abort_unless($content->material->is_published && $content->material->module->is_published, 403);

        ContentProgress::query()->updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'content_id' => $content->id,
            ],
            ['completed_at' => now()],
        );

        return back()->with('success', 'Konten ditandai selesai.');
    }
}
