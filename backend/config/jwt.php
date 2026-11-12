<?php

/*
|--------------------------------------------------------------------------
| JWT nustatymai
|--------------------------------------------------------------------------
| Access žetonas  – JWT, galioja trumpai (15 min.), siunčiamas antraštėje
|                   "Authorization: Bearer <token>".
| Refresh žetonas – atsitiktinė eilutė, galioja ilgai (14 d.), laikoma
|                   HttpOnly slapuke (cookie), DB saugomas tik jo hash'as.
*/

return [

    // Slaptas raktas, kuriuo pasirašomi žetonai (HS256). Sugeneruoti: php artisan jwt:secret
    'secret' => env('JWT_SECRET'),

    // Pasirašymo algoritmas: HMAC + SHA-256
    'algorithm' => 'HS256',

    // Kas išdavė žetoną ("iss" laukas)
    'issuer' => env('APP_URL', 'http://localhost'),

    // Galiojimo laikai minutėmis
    'access_ttl' => (int) env('JWT_ACCESS_TTL', 15),
    'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 60 * 24 * 14),

    // Refresh žetono slapukas
    'cookie' => [
        'name' => 'ac_refresh_token',
        'path' => '/api/v1/auth',                                  // siunčiamas tik į /auth/* adresus
        'secure' => (bool) env('JWT_COOKIE_SECURE', true),          // tik per HTTPS
        'same_site' => env('JWT_COOKIE_SAMESITE', 'strict'),       // apsauga nuo CSRF
    ],

];
