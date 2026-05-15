<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MaterialController extends Controller
{
    public function store(Request $request, Module $module): RedirectResponse
    {
        Gate::authorize('update', $module);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $module->materials()->create([
            ...$validated,
            'order' => (int) $module->materials()->max('order') + 1,
            'is_published' => false,
        ]);

        return back()->with('success', 'Materi berhasil dibuat.');
    }

    public function update(Request $request, Material $material): RedirectResponse
    {
        Gate::authorize('update', $material);

        $material->update($request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]));

        return back()->with('success', 'Materi berhasil diperbarui.');
    }

    public function toggle(Material $material): RedirectResponse
    {
        Gate::authorize('update', $material);

        $material->update(['is_published' => ! $material->is_published]);

        return back()->with('success', $material->is_published ? 'Materi dipublish.' : 'Materi disembunyikan.');
    }

    public function reorder(Request $request, Module $module): RedirectResponse
    {
        Gate::authorize('update', $module);

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:materials,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            $module->materials()->whereKey($item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan materi diperbarui.');
    }

    public function destroy(Material $material): RedirectResponse
    {
        Gate::authorize('delete', $material);

        $material->delete();

        return back()->with('success', 'Materi berhasil dihapus.');
    }
}
