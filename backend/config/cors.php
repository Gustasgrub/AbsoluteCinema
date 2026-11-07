<?php

/*
| CORS – kurie kiti domenai (pvz. atskirai talpinamas frontend) gali kreiptis į API iš naršyklės.
| Įprastai frontend kreipiasi per tą patį domeną (Vite / Caddy proxy), todėl CORS nereikalingas,
| bet jei frontend talpinamas kitame domene – jį reikia įrašyti į CORS_ALLOWED_ORIGINS.
*/

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    // Kad frontend JavaScript galėtų perskaityti šias atsakymo antraštes
    'exposed_headers' => ['Location', 'ETag'],

    'max_age' => 600,

    // Reikia, kad naršyklė siųstų refresh žetono slapuką
    'supports_credentials' => true,

];
