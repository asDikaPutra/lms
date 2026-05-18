<?php

namespace App\Http\Requests\Instructor;

use App\Services\VideoService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isInstructor() === true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['artikel', 'video', 'audio', 'pdf', 'file'])],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'url' => ['nullable', 'string', 'max:2048'],
            'file' => ['nullable', 'file', 'max:10240', 'mimes:mp3,wav,ogg,pdf,doc,docx,ppt,pptx,xls,xlsx,zip,txt'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $type = $this->input('type');

            if ($type === 'artikel' && blank($this->input('body'))) {
                $validator->errors()->add('body', 'Konten artikel wajib diisi.');
            }

            if ($type === 'video') {
                $url = $this->input('url');

                if (blank($url)) {
                    $validator->errors()->add('url', 'URL video wajib diisi.');
                } else {
                    $videoService = app(VideoService::class);
                    if (! $videoService->isValidYouTubeUrl($url)) {
                        $validator->errors()->add(
                            'url',
                            'URL harus berupa link YouTube yang valid (youtube.com/watch?v=... atau youtu.be/...).'
                        );
                    }
                }
            }

            if (in_array($type, ['audio', 'pdf', 'file'], true) && ! $this->hasFile('file')) {
                // Allow update without re-uploading file
                if ($this->isMethod('POST')) {
                    $validator->errors()->add('file', 'File wajib diunggah untuk tipe ini.');
                }
            }
        });
    }
}
