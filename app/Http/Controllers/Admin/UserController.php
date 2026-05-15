<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'status']);

        $users = User::query()
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%")
                        ->orWhere('nidn', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($query, string $role) => $query->where('role', $role))
            ->when(($filters['status'] ?? null) !== null && ($filters['status'] ?? '') !== '', fn ($query) => $query->where('is_active', $filters['status'] === 'active'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'stats' => [
                'total' => User::query()->count(),
                'active' => User::query()->where('is_active', true)->count(),
                'inactive' => User::query()->where('is_active', false)->count(),
            ],
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::query()->create($this->normalizedPayload($request->validated()));

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($this->normalizedPayload($request->validated(), true));

        return back()->with('success', 'User berhasil diperbarui.');
    }

    public function toggle(User $user): RedirectResponse
    {
        abort_if(auth()->id() === $user->id, 422, 'Tidak bisa menonaktifkan akun sendiri.');

        $user->update(['is_active' => ! $user->is_active]);

        return back()->with('success', $user->is_active ? 'User diaktifkan.' : 'User dinonaktifkan.');
    }

    public function importStudents(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $handle = fopen($validated['file']->getRealPath(), 'r');
        $header = fgetcsv($handle);
        $created = 0;

        if ($header === false) {
            fclose($handle);

            return back()->withErrors(['file' => 'File CSV tidak memiliki header.']);
        }

        while (($row = fgetcsv($handle)) !== false) {
            if (count($header) !== count($row)) {
                continue;
            }

            $data = array_combine($header, $row);

            if ($data === false || blank($data['name'] ?? null) || blank($data['email'] ?? null)) {
                continue;
            }

            User::query()->updateOrCreate(
                ['email' => trim($data['email'])],
                [
                    'name' => trim($data['name']),
                    'password' => $data['password'] ?? 'password',
                    'role' => 'student',
                    'nim' => $data['nim'] ?? null,
                    'nidn' => null,
                    'is_active' => true,
                ],
            );

            $created++;
        }

        fclose($handle);

        return back()->with('success', "{$created} data mahasiswa berhasil diimpor.");
    }

    private function normalizedPayload(array $data, bool $isUpdate = false): array
    {
        if (($data['role'] ?? null) === 'student') {
            $data['nidn'] = null;
        }

        if (($data['role'] ?? null) === 'instructor') {
            $data['nim'] = null;
        }

        if (($data['role'] ?? null) === 'admin') {
            $data['nim'] = null;
            $data['nidn'] = null;
        }

        if ($isUpdate && blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        return $data;
    }
}
