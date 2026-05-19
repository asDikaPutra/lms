<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(LoginRequest $request): RedirectResponse|SymfonyResponse
    {
        $request->authenticate();

        if (! $request->user()->is_active) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => 'Akun Anda tidak aktif.',
            ]);
        }

        $request->session()->regenerate();

        $redirectPath = $this->redirectPathFor($request->user());

        if ($request->header('X-Inertia')) {
            return Inertia::location($redirectPath);
        }

        return redirect()->intended($redirectPath);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    private function redirectPathFor($user): string
    {
        return match ($user->role) {
            'admin' => route('admin.dashboard', absolute: false),
            'instructor' => route('instructor.dashboard', absolute: false),
            default => route('student.dashboard', absolute: false),
        };
    }
}
