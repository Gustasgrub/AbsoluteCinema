<?php

use Illuminate\Support\Facades\Route;

// Pagrindinis adresas – nuoroda į API ir dokumentaciją
Route::get('/', fn () => response()->json([
    'name' => 'AbsoluteCinema API',
    'api' => url('api/v1'),
    'docs' => url('docs'),
]));

// OpenAPI specifikacija naršyklėje (Swagger UI). Pati specifikacija: public/openapi.yaml
Route::view('/docs', 'docs');
