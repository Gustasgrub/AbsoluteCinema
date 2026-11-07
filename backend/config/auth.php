<?php

use App\Models\User;

return [

    /*
    | Numatytasis "guard" – "api". Jis neturi sesijų: naudotoją nustato
    | App\Http\Middleware\AuthenticateJwt pagal JWT žetoną.
    */
    'defaults' => [
        'guard' => 'api',
    ],

    'guards' => [
        'api' => [
            'driver' => 'jwt',      // registruojamas App\Providers\AppServiceProvider
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => User::class,
        ],
    ],

];
