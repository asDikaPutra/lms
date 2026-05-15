<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ModuleController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $course->modules()->create([
            ...$validated,
            'order' => (int) $course->modules()->max('order') + 1,
            'is_published' => false,
        ]);

        return back()->with('success', 'Modul berhasil dibuat.');
    }

    public function update(Request $request, Module $module): RedirectResponse
    {
        Gate::authorize('update', $module);

        $module->update($request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]));

        return back()->with('success', 'Modul berhasil diperbarui.');
    }

    public function toggle(Module $module): RedirectResponse
    {
        Gate::authorize('update', $module);

        $module->update(['is_published' => ! $module->is_published]);

        return back()->with('success', $module->is_published ? 'Modul dipublish.' : 'Modul disembunyikan.');
    }

    public function reorder(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:modules,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            $course->modules()->whereKey($item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan modul diperbarui.');
    }

    public function destroy(Module $module): RedirectResponse
    {
        Gate::authorize('delete', $module);

        $module->delete();

        return back()->with('success', 'Modul berhasil dihapus.');
    }
}
