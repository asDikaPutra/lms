<?php

return [
    'uploads' => [
        'max_kilobytes' => 51200,
        'material_mimes' => [
            'audio' => ['mp3', 'wav', 'ogg', 'm4a'],
            'pdf' => ['pdf'],
            'file' => ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip'],
        ],
        'submission_mimes' => ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip'],
        'avatar_mimes' => ['jpg', 'jpeg', 'png', 'webp'],
    ],
];
