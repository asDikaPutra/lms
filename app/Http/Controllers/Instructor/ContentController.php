<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreContentRequest;
use App\Models\Content;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ContentController extends Controller
{
    public function store(StoreContentRequest $request, Material $material): RedirectResponse
    {
        Gate::authorize('update', $material);

        $validated = $request->validated();
        $filePath = $request->hasFile('file') ? $request->file('file')->store('contents', 'public') : null;

        $material->contents()->create([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'body' => $validated['type'] === 'artikel' ? $validated['body'] ?? null : null,
            'url' => $validated['type'] === 'video' ? $validated['url'] ?? null : null,
            'file_path' => $filePath,
            'order' => (int) $material->contents()->max('order') + 1,
        ]);

        return back()->with('success', 'Konten berhasil ditambahkan.');
    }

    public function update(StoreContentRequest $request, Content $content): RedirectResponse
    {
        Gate::authorize('update', $content->material);

        $validated = $request->validated();
        $payload = [
            'type' => $validated['type'],
            'title' => $validated['title'],
            'body' => $validated['type'] === 'artikel' ? $validated['body'] ?? null : null,
            'url' => $validated['type'] === 'video' ? $validated['url'] ?? null : null,
        ];

        if ($request->hasFile('file')) {
            $payload['file_path'] = $request->file('file')->store('contents', 'public');
        }

        $content->update($payload);

        return back()->with('success', 'Konten berhasil diperbarui.');
    }

    public function reorder(Request $request, Material $material): RedirectResponse
    {
        Gate::authorize('update', $material);

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:contents,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            $material->contents()->whereKey($item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan konten diperbarui.');
    }

    public function destroy(Content $content): RedirectResponse
    {
        Gate::authorize('update', $content->material);

        $content->delete();

        return back()->with('success', 'Konten berhasil dihapus.');
    }
}
