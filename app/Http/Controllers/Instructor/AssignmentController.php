<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Material;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AssignmentController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'assignable_type' => ['required', Rule::in(['module', 'material'])],
            'assignable_id' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'deadline' => ['required', 'date', 'after:now'],
            'allow_file' => ['boolean'],
            'allow_link' => ['boolean'],
            'is_published' => ['boolean'],
        ]);

        $parent = $this->resolveParent($validated['assignable_type'], (int) $validated['assignable_id']);
        Gate::authorize('update', $parent);

        $parent->assignments()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'deadline' => $validated['deadline'],
            'allow_file' => (bool) ($validated['allow_file'] ?? true),
            'allow_link' => (bool) ($validated['allow_link'] ?? false),
            'is_published' => (bool) ($validated['is_published'] ?? false),
        ]);

        return back()->with('success', 'Tugas berhasil dibuat.');
    }

    public function update(Request $request, Assignment $assignment): RedirectResponse
    {
        Gate::authorize('manage', $assignment);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'deadline' => ['required', 'date'],
            'allow_file' => ['boolean'],
            'allow_link' => ['boolean'],
            'is_published' => ['boolean'],
        ]);

        $assignment->update($validated);

        return back()->with('success', 'Tugas berhasil diperbarui.');
    }

    public function toggle(Assignment $assignment): RedirectResponse
    {
        Gate::authorize('manage', $assignment);

        $assignment->update(['is_published' => ! $assignment->is_published]);

        return back()->with('success', $assignment->is_published ? 'Tugas dipublish.' : 'Tugas disembunyikan.');
    }

    public function destroy(Assignment $assignment): RedirectResponse
    {
        Gate::authorize('manage', $assignment);

        $assignment->delete();

        return back()->with('success', 'Tugas berhasil dihapus.');
    }

    private function resolveParent(string $type, int $id): Module|Material
    {
        return $type === 'module'
            ? Module::query()->findOrFail($id)
            : Material::query()->findOrFail($id);
    }
}
